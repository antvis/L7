import { readFile } from 'fs/promises';
import { TestEnvironment } from 'jest-environment-node';
import path from 'path';
import { TMP_DIR } from './constants.js';

/**
 * @see https://jestjs.io/docs/puppeteer
 */
class Environment extends TestEnvironment {
  constructor(config) {
    super(config);
  }

  async setup() {
    await super.setup();
    this.global.PORT = await readFile(path.join(TMP_DIR, 'PORT'), 'utf8');
  }
}

export default Environment;
