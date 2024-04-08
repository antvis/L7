import type { Browser, BrowserContext } from 'playwright';
import { chromium, devices } from 'playwright';
import { TEST_CASES } from './test-cases';
import { sleep } from './utils/sleep';
import './utils/useSnapshotMatchers';

describe('Snapshots', () => {
  const port = (globalThis as any).PORT;
  let browser: Browser, context: BrowserContext;

  beforeAll(async () => {
    // Setup
    browser = await chromium.launch({
      args: ['--headless', '--no-sandbox'],
    });
    context = await browser.newContext(devices['Desktop Chrome']);
    await context.exposeFunction('screenshot', () => {});
  });

  afterAll(async () => {
    await context.close();
    await browser.close();
  });

  const demoList = TEST_CASES.filter((g) => g.snapshots !== false)
    .map((groups) => {
      const { type, demos } = groups;
      return demos
        .filter((g) => g.snapshots !== false)
        .map((demo) => {
          const { name, sleepTime = 100 } = demo;
          return {
            type,
            name,
            sleepTime,
          };
        });
    })
    .flat();

  demoList.map((demo) => {
    const { name, type, sleepTime } = demo;
    const key = `${type}_${name}`;

    it(key, async () => {
      const page = await context.newPage();
      // Go to test page served by vite devServer.
      const url = `http://localhost:${port}/?type=${type}&name=${name}`;
      await page.goto(url);
      await sleep(sleepTime);

      // Chart already rendered, capture into buffer.
      const buffer = await page.locator('canvas').screenshot();
      const dir = `${__dirname}/snapshots`;
      const maxError = 0;

      try {
        expect(buffer).toMatchCanvasSnapshot(dir, key, { maxError });
      } finally {
        page.close();
      }
    });
  });
});
