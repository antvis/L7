import { readFile } from 'fs/promises';
import { TestEnvironment as NodeEnvironment } from 'jest-environment-node';
import path from 'path';
import { TMP_DIR } from './constants';

/**
 * @see https://jestjs.io/docs/puppeteer
 */
class Environment extends NodeEnvironment {
  constructor(config) {
    super(config);
  }

  async setup() {
    await super.setup();
    this.global.PORT = await readFile(path.join(TMP_DIR, 'PORT'), 'utf8');
  }
}

export default Environment;
