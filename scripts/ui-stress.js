const fs = require('fs');
const puppeteer = require('puppeteer');
const { withMemoryLeakCheck } = require('./harness');

async function openWindows(browser, count = 3) {
  let totalFps = 0;
  const longTasks = [];

  for (let i = 0; i < count; i++) {
    const page = await browser.newPage();
    await page.setViewport({ width: 800 + i * 50, height: 600 + i * 50 });
    await page.goto('about:blank');
    await page.evaluate(() => {
      const btn = document.createElement('button');
      btn.id = 'btn';
      btn.textContent = 'click';
      document.body.appendChild(btn);
      btn.addEventListener('click', () => {});
    });
    await page.click('#btn');

    const metrics = await page.evaluate(() => {
      return new Promise(resolve => {
        const longTasks = [];
        new PerformanceObserver(list => {
          longTasks.push(...list.getEntries().map(e => e.duration));
        }).observe({ type: 'longtask', buffered: true });

        let frames = 0;
        const start = performance.now();
        function frame(now) {
          frames++;
          if (now - start > 1000) {
            resolve({
              fps: frames / ((now - start) / 1000),
              longTasks
            });
          } else {
            requestAnimationFrame(frame);
          }
        }
        requestAnimationFrame(frame);
      });
    });

    totalFps += metrics.fps;
    longTasks.push(...metrics.longTasks);
    await page.close();
  }

  return { frameRate: totalFps / count, longTasks };
}

async function run() {
  const browser = await puppeteer.launch();
  const { result, leak, duration } = await withMemoryLeakCheck(() => openWindows(browser));
  await browser.close();

  const report = {
    frameRate: result.frameRate,
    longTasks: result.longTasks,
    memory: { leak, duration }
  };

  fs.mkdirSync('reports', { recursive: true });
  fs.writeFileSync('reports/ui-stress.json', JSON.stringify(report, null, 2));
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
