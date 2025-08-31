import axios from 'axios';
import fs from 'fs';
import path from 'path';

interface PageInfo {
  url: string;
  title: string | null;
  meta: {
    description?: string | null;
    ogTitle?: string | null;
    ogDescription?: string | null;
    ogImage?: string | null;
  };
  imagesMissingAlt: number;
  internalLinks: string[];
}

function extractTitle(html: string): string | null {
  const match = html.match(/<title>([^<]*)<\/title>/i);
  return match ? match[1].trim() : null;
}

function extractMeta(html: string): PageInfo['meta'] {
  const meta: PageInfo['meta'] = {};
  const descMatch = html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["'][^>]*>/i);
  meta.description = descMatch ? descMatch[1].trim() : null;
  const ogTitleMatch = html.match(/<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']*)["'][^>]*>/i);
  meta.ogTitle = ogTitleMatch ? ogTitleMatch[1].trim() : null;
  const ogDescMatch = html.match(/<meta[^>]+property=["']og:description["'][^>]+content=["']([^"']*)["'][^>]*>/i);
  meta.ogDescription = ogDescMatch ? ogDescMatch[1].trim() : null;
  const ogImgMatch = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']*)["'][^>]*>/i);
  meta.ogImage = ogImgMatch ? ogImgMatch[1].trim() : null;
  return meta;
}

function extractLinks(html: string, baseUrl: string, origin: string): string[] {
  const links: string[] = [];
  const regex = /<a[^>]+href=["']([^"'#]+)["'][^>]*>/gi;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(html)) !== null) {
    const href = match[1];
    try {
      const url = new URL(href, baseUrl);
      if (url.origin === origin) {
        links.push(url.toString().replace(/#.*$/, '').replace(/\/$/, ''));
      }
    } catch {
      // ignore invalid URLs
    }
  }
  return Array.from(new Set(links));
}

function countImagesMissingAlt(html: string): number {
  const regex = /<img(?![^>]*alt=)[^>]*>/gi;
  const matches = html.match(regex);
  return matches ? matches.length : 0;
}

async function crawl(startUrl: string): Promise<Record<string, PageInfo>> {
  const pages: Record<string, PageInfo> = {};
  const visited = new Set<string>();
  const queue: string[] = [startUrl];
  const origin = new URL(startUrl).origin;

  while (queue.length) {
    const url = queue.shift()!;
    if (visited.has(url)) continue;
    visited.add(url);
    try {
      const response = await axios.get(url);
      const html: string = response.data;
      const title = extractTitle(html);
      const meta = extractMeta(html);
      const links = extractLinks(html, url, origin);
      const imagesMissingAlt = countImagesMissingAlt(html);

      pages[url] = {
        url,
        title,
        meta,
        imagesMissingAlt,
        internalLinks: links,
      };

      links.forEach((link) => {
        if (!visited.has(link)) {
          queue.push(link);
        }
      });
    } catch (e) {
      console.error(`Failed to fetch ${url}: ${(e as Error).message}`);
    }
  }

  return pages;
}

function detectOrphans(pages: Record<string, PageInfo>, rootUrl: string): string[] {
  const incoming: Record<string, number> = {};
  Object.keys(pages).forEach((u) => { incoming[u] = 0; });

  Object.values(pages).forEach((page) => {
    page.internalLinks.forEach((link) => {
      if (incoming[link] !== undefined) {
        incoming[link] += 1;
      }
    });
  });

  return Object.keys(incoming).filter((u) => incoming[u] === 0 && u !== rootUrl);
}

async function main() {
  const startUrl = process.argv[2] || 'https://example.com';
  const pages = await crawl(startUrl);
  const orphans = detectOrphans(pages, startUrl);
  const reportsDir = path.resolve(__dirname, '../reports');
  fs.mkdirSync(reportsDir, { recursive: true });
  fs.writeFileSync(path.join(reportsDir, 'content-map.json'), JSON.stringify(pages, null, 2));
  fs.writeFileSync(path.join(reportsDir, 'orphans.json'), JSON.stringify(orphans, null, 2));
}

if (require.main === module) {
  main();
}

export { crawl, detectOrphans };
