const fs = require('fs');
const path = require('path');

function getCostReport(distDir = path.resolve(__dirname, '../dist')) {
  const report = {};
  if (!fs.existsSync(distDir)) {
    return report;
  }
  const files = fs.readdirSync(distDir).filter((f) => f.endsWith('.html'));
  files.forEach((file) => {
    const htmlPath = path.join(distDir, file);
    const html = fs.readFileSync(htmlPath, 'utf8');
    const scripts = Array.from(html.matchAll(/<script[^>]+src="(.*?)"/g)).map((m) => m[1]);
    const links = Array.from(html.matchAll(/<link[^>]+href="(.*?)"[^>]*rel="stylesheet"/g)).map((m) => m[1]);
    let total = 0;
    [...scripts, ...links].forEach((asset) => {
      const assetPath = path.join(distDir, asset);
      if (fs.existsSync(assetPath)) {
        total += fs.statSync(assetPath).size;
      }
    });
    const route = file === 'index.html' ? '/' : `/${path.basename(file, '.html')}`;
    report[route] = total;
  });
  return report;
}

if (require.main === module) {
  const report = getCostReport();
  console.log(JSON.stringify(report, null, 2));
}

module.exports = { getCostReport };
