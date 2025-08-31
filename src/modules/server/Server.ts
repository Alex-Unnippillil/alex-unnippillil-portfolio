import { Compiler } from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import express, { Application, Request, Response } from 'express';
import {
  createLink,
  getLink,
  listLinks,
  logClick,
  ShortLink,
} from './LinkStore';

export default class Server {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  run(app: Application, server: WebpackDevServer, compiler: Compiler): void {
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    app.post('/api/links', (req: Request, res: Response) => {
      const { owner, target, disabled, expiresAt } = req.body;
      if (!owner || !target) {
        res.status(400).json({ error: 'owner and target required' });
        return;
      }
      const link = createLink(owner, target, {
        disabled: disabled === true || disabled === 'on',
        expiresAt: expiresAt ? Number(expiresAt) : undefined,
      });
      res.json(link);
    });

    app.get('/l/:id', (req: Request, res: Response) => {
      const link: ShortLink | undefined = getLink(req.params.id);
      if (!link || link.disabled || (link.expiresAt && link.expiresAt < Date.now())) {
        res.status(404).send('Not found');
        return;
      }
      const url = new URL(link.target);
      const utm: Record<string, string> = {};
      Object.entries(req.query).forEach(([k, v]) => {
        if (k.startsWith('utm_') && typeof v === 'string') {
          url.searchParams.set(k, v);
          utm[k] = v;
        }
      });
      logClick(link, {
        ts: Date.now(),
        ua: req.headers['user-agent'] as string || '',
        utm,
      });
      res.redirect(url.toString());
    });

    app.get('/api/links', (_req: Request, res: Response) => {
      res.json(listLinks());
    });

    app.get('/admin', (_req: Request, res: Response) => {
      res.send(`<!doctype html><html><body><h1>Links</h1><div id="links"></div><script>fetch('/api/links').then(r=>r.json()).then(d=>{const c=document.getElementById('links');d.forEach(l=>{const p=document.createElement('pre');p.textContent=JSON.stringify(l,null,2);c.appendChild(p);});});</script></body></html>`);
    });

    app.get('/create', (_req: Request, res: Response) => {
      res.send(`<!doctype html><html><body><h1>Create Link</h1><form id="f"><div>Owner: <input name="owner"/></div><div>Target: <input name="target"/></div><div>ExpiresAt: <input name="expiresAt"/></div><div>Disabled: <input type="checkbox" name="disabled"/></div><button type="submit">Create</button></form><pre id="result"></pre><script>document.getElementById('f').addEventListener('submit',async e=>{e.preventDefault();const fd=new FormData(e.target);const data=Object.fromEntries(fd.entries());if(data.disabled==='on'){data.disabled=true;}if(data.expiresAt){data.expiresAt=Number(data.expiresAt);}const r=await fetch('/api/links',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)});const j=await r.json();document.getElementById('result').textContent=JSON.stringify(j,null,2);});</script></body></html>`);
    });
  }
}
