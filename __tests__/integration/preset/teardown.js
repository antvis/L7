import { rm } from 'fs/promises';
import { TMP_DIR } from './constants.js';

export default async function (_globalConfig, _projectConfig) {
  const server = globalThis.VITE_SERVER;
  await server.close();

  // clean-up the tmp file
  await rm(TMP_DIR, { recursive: true, force: true });
}
