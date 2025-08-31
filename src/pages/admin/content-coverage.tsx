import React, { useEffect, useState } from 'react';

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

const ContentCoverage: React.FC = () => {
  const [pages, setPages] = useState<PageInfo[]>([]);

  useEffect(() => {
    fetch('/reports/content-map.json')
      .then((res) => res.json())
      .then((data) => setPages(Object.values(data)));
  }, []);

  const renderStatus = (page: PageInfo) => {
    const missing: string[] = [];
    if (!page.meta.description) missing.push('description');
    if (page.imagesMissingAlt > 0) missing.push('alt text');
    if (!page.meta.ogTitle || !page.meta.ogDescription || !page.meta.ogImage) missing.push('og tags');
    return missing.length ? missing.join(', ') : 'ok';
  };

  return (
    <div>
      <h1>Content Coverage</h1>
      <table>
        <thead>
          <tr>
            <th>URL</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {pages.map((p) => (
            <tr key={p.url} style={{ backgroundColor: renderStatus(p) === 'ok' ? '#dfd' : '#fdd' }}>
              <td><a href={p.url}>{p.title || p.url}</a></td>
              <td>{renderStatus(p)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ContentCoverage;
