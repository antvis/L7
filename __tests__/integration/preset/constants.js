import os from 'os';
import path from 'path';

export const TMP_DIR = path.join(os.tmpdir(), 'jest_global_setup');
