import MarkdownIt from 'markdown-it';
import anchor from 'markdown-it-anchor';
import sanitizeHtml from 'sanitize-html';
import { Worker } from 'worker_threads';
import path from 'path';

export default class Markdown {
  private static md = new MarkdownIt({
    html: false,
    linkify: true,
  }).use(anchor, { slugify: Markdown.slug });

  static slug(str: string): string {
    return str
      .trim()
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-');
  }

  private static rewriteLinks(html: string): string {
    return html.replace(/<a href="([^"]+)">/g, (match, href) => {
      if (/^https?:\/\//.test(href)) {
        return `<a href="${href}" target="_blank" rel="noopener">`;
      }
      return match;
    });
  }

  private static async highlight(html: string): Promise<string> {
    const regex = /<pre><code class="language-(.*?)">([\s\S]*?)<\/code><\/pre>/g;
    const tasks: Promise<{ original: string; replaced: string }>[] = [];
    let match: RegExpExecArray | null;
    // eslint-disable-next-line no-cond-assign
    while ((match = regex.exec(html)) !== null) {
      const [original, lang, code] = match;
      const unescaped = code
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&amp;/g, '&');
      const task = Markdown.runShiki(unescaped, lang).then((replaced) => ({ original, replaced }));
      tasks.push(task);
    }
    const highlighted = await Promise.all(tasks);
    let output = html;
    highlighted.forEach(({ original, replaced }) => {
      output = output.replace(original, replaced);
    });
    return output;
  }

  private static runShiki(code: string, lang: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const worker = new Worker(path.resolve(__dirname, 'shikiWorker.js'));
      worker.on('message', (msg) => {
        if (msg.type === 'ready') {
          worker.postMessage({ code, lang });
        } else if (msg.type === 'result') {
          resolve(msg.html as string);
          worker.terminate();
        }
      });
      worker.on('error', reject);
    });
  }

  static async render(md: string): Promise<string> {
    let html = Markdown.md.render(md);
    html = await Markdown.highlight(html);
    html = Markdown.rewriteLinks(html);

    const allowedTags = sanitizeHtml.defaults.allowedTags.concat(['img', 'span']);
    const allowedAttributes = {
      ...sanitizeHtml.defaults.allowedAttributes,
      a: ['href', 'target', 'rel'],
      img: ['src', 'alt', 'title'],
      code: ['class'],
      pre: ['class', 'style'],
      span: ['style'],
      h1: ['id'],
      h2: ['id'],
      h3: ['id'],
      h4: ['id'],
      h5: ['id'],
      h6: ['id'],
    };
    const allowedStyles = {
      '*': {
        color: [/^#[0-9a-fA-F]+$/],
        'background-color': [/^#[0-9a-fA-F]+$/],
      },
    };

    return sanitizeHtml(html, { allowedTags, allowedAttributes, allowedStyles });
  }
}
