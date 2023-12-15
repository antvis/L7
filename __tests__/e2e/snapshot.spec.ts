import { chromium, devices } from 'playwright';
import { tests } from './tests';
import { sleep } from './utils/sleep';
import './utils/useSnapshotMatchers';

describe('Snapshots', () => {
  Object.keys(tests).forEach((key) => {
    it(key, async () => {
      // Setup
      const browser = await chromium.launch({
        args: ['--headless', '--no-sandbox'],
      });
      const context = await browser.newContext(devices['Desktop Chrome']);
      const page = await context.newPage();

      // Go to test page served by vite devServer.
      const url = `http://localhost:6006/${tests[key]}`;
      await page.goto(url);

      await sleep(1500);

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
