// @ts-ignore
import Point from '../geo/point';

// tslint:disable-next-line:no-submodule-imports
import { lodashUtil } from '@antv/l7-utils';
import type { EarthMap } from '../earthmap';
import type { Map } from '../map';
import { bezier, clamp, now } from '../util';
import type { IDragPanOptions } from './shim/drag_pan';
const { merge } = lodashUtil;
const defaultInertiaOptions = {
  linearity: 0.3,
  easing: bezier(0, 0, 0.3, 1),
};

const defaultPanInertiaOptions = merge(
  {
    deceleration: 2500,
    maxSpeed: 1400,
  },
  defaultInertiaOptions,
);

const defaultZoomInertiaOptions = merge(
  {
    deceleration: 20,
    maxSpeed: 1400,
  },
  defaultInertiaOptions,
);

const defaultBearingInertiaOptions = merge(
  {
    deceleration: 1000,
    maxSpeed: 360,
  },
  defaultInertiaOptions,
);

const defaultPitchInertiaOptions = merge(
  {
    deceleration: 1000,
    maxSpeed: 90,
  },
  defaultInertiaOptions,
);

export interface IInertiaOptions {
  linearity: number;
  easing: (t: number) => number;
  deceleration: number;
  maxSpeed: number;
}

export type InputEvent = MouseEvent | TouchEvent | KeyboardEvent | WheelEvent;

export default class HandlerInertia {
  private map: Map | EarthMap;
  private inertiaBuffer: Array<{
    time: number;
    settings: { [key: string]: any };
  }>;

  constructor(map: Map | EarthMap) {
    this.map = map;
    this.clear();
  }

  public clear() {
    this.inertiaBuffer = [];
  }

  public record(settings: any) {
    this.drainInertiaBuffer();
    this.inertiaBuffer.push({ time: now(), settings });
  }

  public drainInertiaBuffer() {
    const inertia = this.inertiaBuffer;
    const nowTime = now();
    const cutoff = 160; // msec

    while (inertia.length > 0 && nowTime - inertia[0].time > cutoff) {
      inertia.shift();
    }
  }

  public onMoveEnd(panInertiaOptions?: IDragPanOptions) {
    this.drainInertiaBuffer();
    if (this.inertiaBuffer.length < 2) {
      return;
    }

    const deltas = {
      zoom: 0,
      bearing: 0,
      pitch: 0,
      pan: new Point(0, 0),
      pinchAround: undefined,
      around: undefined,
    };

    for (const { settings } of this.inertiaBuffer) {
      deltas.zoom += settings.zoomDelta || 0;
      deltas.bearing += settings.bearingDelta || 0;
      deltas.pitch += settings.pitchDelta || 0;
      if (settings.panDelta) {
        deltas.pan._add(settings.panDelta);
      }
      if (settings.around) {
        deltas.around = settings.around;
      }
      if (settings.pinchAround) {
        deltas.pinchAround = settings.pinchAround;
      }
    }

    const lastEntry = this.inertiaBuffer[this.inertiaBuffer.length - 1];
    const duration = lastEntry.time - this.inertiaBuffer[0].time;

    const easeOptions: { [key: string]: any } = {};

    if (deltas.pan.mag()) {
      const result = calculateEasing(
        deltas.pan.mag(),
        duration,
        merge({}, defaultPanInertiaOptions, panInertiaOptions || {}),
      );
      easeOptions.offset = deltas.pan.mult(result.amount / deltas.pan.mag());
      easeOptions.center = this.map.transform.center;
      extendDuration(easeOptions, result);
    }

    if (deltas.zoom) {
      const result = calculateEasing(deltas.zoom, duration, defaultZoomInertiaOptions);
      easeOptions.zoom = this.map.transform.zoom + result.amount;
      extendDuration(easeOptions, result);
    }

    if (deltas.bearing) {
      const result = calculateEasing(deltas.bearing, duration, defaultBearingInertiaOptions);
      easeOptions.bearing = this.map.transform.bearing + clamp(result.amount, -179, 179);
      extendDuration(easeOptions, result);
    }

    if (deltas.pitch) {
      const result = calculateEasing(deltas.pitch, duration, defaultPitchInertiaOptions);
      easeOptions.pitch = this.map.transform.pitch + result.amount;
      extendDuration(easeOptions, result);
    }

    if (easeOptions.zoom || easeOptions.bearing) {
      const last = deltas.pinchAround === undefined ? deltas.around : deltas.pinchAround;
      easeOptions.around = last ? this.map.unproject(last) : this.map.getCenter();
    }

    this.clear();
    return merge(easeOptions, {
      noMoveStart: true,
    });
  }
}

// Unfortunately zoom, bearing, etc can't have different durations and easings so
// we need to choose one. We use the longest duration and it's corresponding easing.
function extendDuration(easeOptions: any, result: any) {
  if (!easeOptions.duration || easeOptions.duration < result.duration) {
    easeOptions.duration = result.duration;
    easeOptions.easing = result.easing;
  }
}

function calculateEasing(amount: number, inertiaDuration: number, inertiaOptions: IInertiaOptions) {
  const { maxSpeed, linearity, deceleration } = inertiaOptions;
  const speed = clamp((amount * linearity) / (inertiaDuration / 1000), -maxSpeed, maxSpeed);
  const duration = Math.abs(speed) / (deceleration * linearity);
  return {
    easing: inertiaOptions.easing,
    duration: duration * 1000,
    amount: speed * (duration / 2),
  };
}
