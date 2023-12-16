import { chromium, devices } from 'playwright';
import { testList } from '../tests';
import { sleep } from './sleep';



testList.forEach((key) => {
    it(key, async () => {
        // Setup
        const browser = await chromium.launch({
            args: ['--headless', '--no-sandbox'],
        });
        const context = await browser.newContext(devices['Desktop Chrome']);
        const page = await context.newPage();

        // Go to test page served by vite devServer.
        // const url = `http://localhost:6006/${tests[key]}`;
        const url = `http://localhost:8080/?name=${key}`;
        await page.goto(url);

        await sleep(1500);

        const screenshotPath = `/snapshots/${key}.png`;
        page.locator('canvas').screenshot({ path: screenshotPath });

        await context.close();
        await browser.close();

    });
});

