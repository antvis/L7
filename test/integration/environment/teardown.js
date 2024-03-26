const terminate = require('terminate');
const fs = require('fs').promises;
const { TMP_DIR } = require('./constants');

module.exports = async function (_globalConfig, _projectConfig) {
  const testServerProcess = globalThis.testServerProcess;

  await new Promise((resolve) => {
    terminate(testServerProcess.pid, () => {
      resolve(undefined);
    });
  });

  // clean-up the tmp file
  await fs.rm(TMP_DIR, { recursive: true, force: true });
};
