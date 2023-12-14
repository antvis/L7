const portfinder = require('portfinder');
const { mkdir, writeFile } = require('fs').promises;
const path = require('path');
const { TMP_DIR } = require('./constants');
const { spawn } = require('child_process');

module.exports = async function (_globalConfig, _projectConfig) {
  const port = await portfinder.getPortPromise();
  // use the file system to expose the port for TestEnvironments
  await mkdir(TMP_DIR, { recursive: true });
  await writeFile(path.join(TMP_DIR, 'PORT'), port.toString());

  const testServerProcess = await new Promise((resolve, reject) => {
    // Try to start dumi devserver.
    const testServerProcess = spawn('npm', ['run', 'dev'], { detached: true });

    testServerProcess.on('error', (err) => {
      console.log('Failed to start subprocess.', err);
      reject(err);
    });

    // Make sure dumi devserver already started.
    testServerProcess.stdout.on('data', (data) => {
      if (data.toString().indexOf('Compiled successfully') > -1) {
        console.log(`\nTest server running with PID ${testServerProcess.pid}`);
        resolve(testServerProcess);
      }
    });
  });
  // store the PID so we can teardown it later.
  // this global is only available in the teardown but not in TestEnvironments
  globalThis.testServerProcess = testServerProcess;
};
