import { chromium, devices } from 'playwright';
import { TestDemoList } from './tests';
import './utils/useSnapshotMatchers';
describe('Snapshots', () => {
  const demosFlatList: Array<{
    type: string;
    name: string;
    sleepTime: number;
  }> = [];
  TestDemoList.filter((g) => g.snapshots !== false).forEach((groups) => {
    const { type, demos } = groups;

    demos
      .filter((g) => g.snapshots !== false)
      .map((demo) => {
        const { name, sleepTime = 1.5 } = demo;
        demosFlatList.push({
          type,
          name,
          sleepTime,
        });
      });
  });
  demosFlatList.map((demo) => {
    const { name, sleepTime = 1.5, type } = demo;
    const key = `${type}_${name}`;

    it(key, async () => {
      // Setup
      const browser = await chromium.launch({
        args: ['--headless', '--no-sandbox'],
      });
      const context = await browser.newContext(devices['Desktop Chrome']);
      const page = await context.newPage();
      // Go to test page served by vite devServer.
      const url = `http://localhost:8080/?type=${type}&name=${name}`;

      let resolveReadyPromise: () => void;
      const readyPromise = new Promise((resolve) => {
        resolveReadyPromise = () => {
          resolve(this);
        };
      });

      await context.exposeFunction('screenshot', async () => {
        resolveReadyPromise();
      });

      await page.goto(url);
      await readyPromise;

      // Chart already rendered, capture into buffer.
      const buffer = await page.locator('canvas').screenshot();

      const dir = `${__dirname}/snapshots`;

      const maxError = 0;
      try {
        expect(buffer).toMatchCanvasSnapshot(dir, key, { maxError });
      } finally {
        await context.close();
        await browser.close();
      }
    });
  });
});
