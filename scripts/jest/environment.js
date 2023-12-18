const { readFile } = require('fs').promises;
const path = require('path');
const NodeEnvironment = require('jest-environment-node').TestEnvironment;
const { TMP_DIR } = require('./constants');

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

module.exports = Environment;
