import { chromium, devices } from "playwright";
import * as tests from "../plots";
import "./utils/useSnapshotMatchers";
import { sleep } from "./utils/sleep";

describe("Charts", () => {
  Object.keys(tests).forEach((key) => {
    it(key, async () => {
      // Setup
      const browser = await chromium.launch({
        args: ["--headless", "--no-sandbox"],
      });
      const context = await browser.newContext(devices["Desktop Chrome"]);
      const page = await context.newPage();

      await page.addInitScript(() => {
        window["USE_PLAYWRIGHT"] = 1;
      });

      // Go to test page served by vite devServer.
      const url = `http://localhost:${globalThis.PORT}/?name=${key}`;
      await page.goto(url);

      await sleep(300);

      // Chart already rendered, capture into buffer.
      const buffer = await page.locator("canvas").screenshot();

      const dir = `${__dirname}/snapshots`;
      try {
        const maxError = 0;
        await expect(buffer).toMatchCanvasSnapshot(dir, key, { maxError });
      } finally {
        await context.close();
        await browser.close();
      }
    });
  });
});
