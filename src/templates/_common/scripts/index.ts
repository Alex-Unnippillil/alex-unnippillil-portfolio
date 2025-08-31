(() => {
  const reloadKey = 'asset-hash-reload';

  async function computeHash(content: string): Promise<string> {
    const buffer = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(content));
    return Array.from(new Uint8Array(buffer)).map((b) => b.toString(16).padStart(2, '0')).join('');
  }

  async function verifyAssets(): Promise<void> {
    try {
      const res = await fetch('/asset-manifest.json', { cache: 'no-store' });
      const manifest = await res.json();
      const critical = Object.keys(manifest).filter((k) => /main.*\.(js|css)$/.test(k));

      await Promise.all(critical.map(async (file) => {
        const assetRes = await fetch(`/${file}`, { cache: 'no-store' });
        const text = await assetRes.text();
        const hash = await computeHash(text);
        if (hash !== manifest[file]) {
          throw new Error(`Hash mismatch for ${file}`);
        }
      }));
    } catch (err) {
      if (!sessionStorage.getItem(reloadKey)) {
        sessionStorage.setItem(reloadKey, '1');
        if ('caches' in window) {
          const keys = await caches.keys();
          await Promise.all(keys.map((k) => caches.delete(k)));
        }
        window.location.reload();
      } else {
        document.body.innerHTML = `
          <div style="display:flex;align-items:center;justify-content:center;height:100vh;text-align:center;padding:1rem;">
            <div>
              <h1>Update required</h1>
              <p>Some files failed to load correctly. Please perform a hard refresh (Ctrl+Shift+R) to update the application.</p>
            </div>
          </div>`;
      }
    }
  }

  verifyAssets();

  if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js');
    });
  }
})();
