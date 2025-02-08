import type { Browser, BrowserContext } from 'playwright';
import { chromium, devices } from 'playwright';
import { sleep } from './sleep';
import './useSnapshotMatchers';

export function generateCanvasTestCases(
  namespace: string,
  tests: { name: string; sleepTime?: number; snapshot?: boolean }[],
) {
  const port = (globalThis as any).PORT;
  let browser: Browser, context: BrowserContext;

  beforeAll(async () => {
    // Setup
    browser = await chromium.launch({
      args: ['--headless', '--no-sandbox'],
    });
    context = await browser.newContext(devices['Desktop Chrome']);
  });

  afterAll(async () => {
    if (!browser) return;
    await context.close();
    await browser.close();
  });

  tests
    .filter((test) => test.snapshot !== false)
    .map((test) => {
      const { name, sleepTime = 200 } = test;
      const key = `${namespace}_${name}`;

      it(key, async () => {
        const page = await context.newPage();

        let resolveReady: () => void;
        const readyPromise = new Promise<void>((resolve) => {
          resolveReady = () => {
            resolve();
          };
        });

        await page.exposeFunction('screenshot', async () => {
          resolveReady();
        });

        // Go to test page served by vite devServer.
        const url = `http://localhost:${port}/?namespace=${namespace}&name=${name}&snapshot=true`;
        await page.goto(url);
        await readyPromise;
        await sleep(sleepTime);

        // Chart already rendered, capture into buffer.
        const buffer = await page.locator('canvas').screenshot();
        const dir = `${__dirname}/../snapshots`;
        const maxError = 0;

        try {
          expect(buffer).toMatchCanvasSnapshot(dir, key, { maxError });
        } finally {
          page.close();
        }
      });
    });
}
