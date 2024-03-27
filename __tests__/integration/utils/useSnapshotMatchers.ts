import type { ToMatchCanvasSnapshotOptions } from './toMatchCanvasSnapshot';
import { toMatchCanvasSnapshot } from './toMatchCanvasSnapshot';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace jest {
    interface Matchers<R> {
      toMatchCanvasSnapshot(dir: string, name: string, options?: ToMatchCanvasSnapshotOptions): R;
    }
  }
}

expect.extend({
  toMatchCanvasSnapshot,
});
