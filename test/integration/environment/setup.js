import { spawn } from 'child_process';
import { mkdir, writeFile } from 'fs/promises';
import path from 'path';
import portfinder from 'portfinder';
import { TMP_DIR } from './constants';

export default async function (_globalConfig, _projectConfig) {
  const port = await portfinder.getPortPromise();
  // use the file system to expose the port for TestEnvironments
  await mkdir(TMP_DIR, { recursive: true });
  await writeFile(path.join(TMP_DIR, 'PORT'), port.toString());

  const testServerProcess = await new Promise((resolve, reject) => {
    // Try to start dumi devserver.
    const testServerProcess = spawn('npm', ['run', 'dev:ci'], {
      detached: true,
    });
    console.log(`Starting test server with PID ${testServerProcess.pid}`);

    testServerProcess.on('error', (err) => {
      console.log('Failed to start subprocess.', err);
      reject(err);
    });

    // Make sure dumi devserver already started.
    testServerProcess.stdout.on('data', (data) => {
      resolve(testServerProcess);
    });
  });
  // store the PID so we can teardown it later.
  // this global is only available in the teardown but not in TestEnvironments
  globalThis.testServerProcess = testServerProcess;
}
