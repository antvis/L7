import { chromium, devices } from 'playwright';
import { sleep } from './utils/sleep';
import './utils/useSnapshotMatchers';

describe('Snapshots', () => {
  const tests = {
    'point-circle': 'features/point/circle',
  };
  Object.keys(tests).forEach((key) => {
    it(key, async () => {
      // Setup
      const browser = await chromium.launch({
        args: ['--headless', '--no-sandbox'],
      });
      const context = await browser.newContext(devices['Desktop Chrome']);
      const page = await context.newPage();

      await page.addInitScript(() => {
        window['USE_PLAYWRIGHT'] = 1;
      });

      // Go to test page served by vite devServer.
      const url = `http://localhost:6006/${tests[key]}`;
      await page.goto(url);

      await sleep(300);

      // Chart already rendered, capture into buffer.
      const buffer = await page.locator('canvas').nth(1).screenshot();

      const dir = `${__dirname}/snapshots`;

      const maxError = 0;
      expect(buffer).toMatchCanvasSnapshot(dir, key, { maxError });

      await context.close();
      await browser.close();
    });
  });
});
