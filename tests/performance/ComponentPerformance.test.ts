import fs from 'fs';
import path from 'path';
import { performance } from 'perf_hooks';

describe('component lifecycle performance', () => {
  it('records mount/update/unmount timings within budget', () => {
    const budgetPath = path.join(__dirname, 'budget.json');
    const budget = JSON.parse(fs.readFileSync(budgetPath, 'utf8')) as Record<string, number>;

    class DemoComponent {
      private counter = 0;
      mount() {
        this.counter = this.counter + 1;
      }
      update() {
        this.counter = this.counter + 1;
      }
      unmount() {
        this.counter = this.counter - 1;
      }
    }

    const component = new DemoComponent();

    let t0 = performance.now();
    component.mount();
    const mountTime = performance.now() - t0;

    t0 = performance.now();
    component.update();
    const updateTime = performance.now() - t0;

    t0 = performance.now();
    component.unmount();
    const unmountTime = performance.now() - t0;

    const resultsPath = path.join(__dirname, 'results.json');
    const results: any[] = fs.existsSync(resultsPath)
      ? JSON.parse(fs.readFileSync(resultsPath, 'utf8'))
      : [];
    results.push({
      timestamp: new Date().toISOString(),
      mount: mountTime,
      update: updateTime,
      unmount: unmountTime,
    });
    fs.writeFileSync(resultsPath, `${JSON.stringify(results, null, 2)}\n`);

    expect(mountTime).toBeLessThanOrEqual(budget.mount);
    expect(updateTime).toBeLessThanOrEqual(budget.update);
    expect(unmountTime).toBeLessThanOrEqual(budget.unmount);
  });
});
