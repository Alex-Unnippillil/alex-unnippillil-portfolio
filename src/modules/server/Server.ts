import { Compiler } from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import express, { Application } from 'express';

export default class Server {
  private reports: any[] = [];

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  run(app: Application, server: WebpackDevServer, compiler: Compiler): void {
    app.use(express.json({ type: ['application/json', 'application/csp-report', 'application/reports+json'] }));

    app.post('/csp-report', (req, res) => {
      this.reports.push(req.body);
      res.status(204).end();
    });

    app.get('/csp-reports', (req, res) => {
      res.json(this.reports);
    });

    app.use((req, res, next) => {
      const csp = "default-src 'self'; require-trusted-types-for 'script'; report-uri /csp-report";
      const header = process.env.CSP_REPORT_ONLY === 'true'
        ? 'Content-Security-Policy-Report-Only'
        : 'Content-Security-Policy';
      res.setHeader(header, csp);
      next();
    });
  }

  getReports(): any[] {
    return this.reports;
  }
}
