import type { Browser, BrowserContext, Page } from 'playwright';
import { chromium, devices } from 'playwright';
import { sleep } from './sleep';
import './useSnapshotMatchers';

export function generateCanvasTestCases(
  namespace: string,
  tests: { name: string; sleepTime?: number; snapshots?: boolean }[],
) {
  const port = (globalThis as any).PORT;
  let browser: Browser, context: BrowserContext, page: Page;

  beforeAll(async () => {
    // Setup
    browser = await chromium.launch({
      args: ['--headless', '--no-sandbox'],
    });
    context = await browser.newContext(devices['Desktop Chrome']);
    page = await context.newPage();
    await context.exposeFunction('screenshot', () => {});
  });

  afterAll(async () => {
    await context.close();
    await browser.close();
  });

  tests
    .filter((test) => test.snapshots !== false)
    .map((test) => {
      const { name, sleepTime = 200 } = test;
      const key = `${namespace}_${name}`;

      it(key, async () => {
        // Go to test page served by vite devServer.
        const url = `http://localhost:${port}/?type=${namespace}&name=${name}`;
        await page.goto(url);
        await sleep(sleepTime);

        // Chart already rendered, capture into buffer.
        const buffer = await page.locator('canvas').screenshot();
        const dir = `${__dirname}/../snapshots`;
        const maxError = 0;

        try {
          expect(buffer).toMatchCanvasSnapshot(dir, key, { maxError });
        } finally {
          //
        }
      });
    });
}
