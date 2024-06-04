// @ts-ignore
import type { EarthMap } from '../earthmap';
import type Point from '../geo/point';
import type { Map } from '../map';

export default class ClickZoomHandler {
  private enabled: boolean;
  private active: boolean;

  constructor() {
    this.reset();
  }

  public reset() {
    this.active = false;
  }

  public dblclick(e: MouseEvent, point: Point) {
    e.preventDefault();
    return {
      cameraAnimation: (map: Map | EarthMap) => {
        map.easeTo(
          {
            duration: 300,
            zoom: map.getZoom() + (e.shiftKey ? -1 : 1),
            around: map.unproject(point),
          },
          { originalEvent: e },
        );
      },
    };
  }

  public enable() {
    this.enabled = true;
  }
  public disable() {
    this.enabled = false;
    this.reset();
  }

  public isEnabled() {
    return this.enabled;
  }

  public isActive() {
    return this.active;
  }
}
