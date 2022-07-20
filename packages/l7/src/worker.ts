import { setL7WorkerSource } from '@antv/l7-utils';
// @ts-ignore
import workerSource from '../dist/l7.worker.js';

setL7WorkerSource(workerSource);
