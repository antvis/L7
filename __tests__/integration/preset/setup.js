import { mkdir, writeFile } from 'fs/promises';
import path from 'path';
import portfinder from 'portfinder';
import { createServer } from 'vite';
import { TMP_DIR } from './constants.js';

export default async function (_globalConfig, _projectConfig) {
  const port = await portfinder.getPortPromise();

  // @see https://vitejs.dev/guide/api-javascript.html#createserver
  const server = await createServer({
    configFile: './vite.config.ts',
    server: {
      port: port,
      open: false,
    },
  });
  await server.listen();

  // use the file system to expose the port for TestEnvironments
  await mkdir(TMP_DIR, { recursive: true });
  await writeFile(path.join(TMP_DIR, 'PORT'), port.toString());

  server.printUrls();

  // store the server instance so we can teardown it later.
  // this global is only available in the teardown but not in TestEnvironments
  globalThis.VITE_SERVER = server;
}
