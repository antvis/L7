import fsPromises from 'fs/promises';
import terminate from 'terminate';
import { TMP_DIR } from './constants';

export default async function (_globalConfig, _projectConfig) {
  const testServerProcess = globalThis.testServerProcess;

  await new Promise((resolve) => {
    terminate(testServerProcess.pid, () => {
      resolve(undefined);
    });
  });

  // clean-up the tmp file
  await fsPromises.rm(TMP_DIR, { recursive: true, force: true });
}
