let lastFrameTime: number | null = null;
let frameTimes: number[] = [];

const minFramerateTarget = 30;
const frameTimeTarget = 1000 / minFramerateTarget;
const performance = window.performance;

export interface IPerformanceMetrics {
  loadTime: number;
  fullLoadTime: number;
  fps: number;
  percentDroppedFrames: number;
}

export const PerformanceMarkers = {
  create: 'create',
  load: 'load',
  fullLoad: 'fullLoad',
};

export const PerformanceUtils = {
  mark(marker: string) {
    performance.mark(marker);
  },
  frame(timestamp: number) {
    const currTimestamp = timestamp;
    if (lastFrameTime != null) {
      const frameTime = currTimestamp - lastFrameTime;
      frameTimes.push(frameTime);
    }
    lastFrameTime = currTimestamp;
  },
  clearMetrics() {
    lastFrameTime = null;
    frameTimes = [];
    performance.clearMeasures('loadTime');
    performance.clearMeasures('fullLoadTime');
    // @ts-ignore
    // tslint:disable-next-line:forin
    for (const marker in PerformanceMarkers) {
      // @ts-ignore
      performance.clearMarks(PerformanceMarkers[marker]);
    }
  },
  getPerformanceMetrics(): IPerformanceMetrics {
    const loadTime = performance.measure(
      'loadTime',
      PerformanceMarkers.create,
      PerformanceMarkers.load,
      // @ts-ignore
    ).duration;

    const fullLoadTime = performance.measure(
      'fullLoadTime',
      PerformanceMarkers.create,
      PerformanceMarkers.fullLoad,
      // @ts-ignore
    ).duration;
    const totalFrames = frameTimes.length;

    const avgFrameTime =
      frameTimes.reduce((prev, curr) => prev + curr, 0) / totalFrames / 1000;
    const fps = 1 / avgFrameTime;

    // count frames that missed our framerate target
    const droppedFrames = frameTimes
      .filter((frameTime) => frameTime > frameTimeTarget)
      .reduce((acc, curr) => {
        return acc + (curr - frameTimeTarget) / frameTimeTarget;
      }, 0);
    const percentDroppedFrames =
      (droppedFrames / (totalFrames + droppedFrames)) * 100;

    return {
      loadTime,
      fullLoadTime,
      fps,
      percentDroppedFrames,
    };
  },
};
