import { Map } from '../map';

const defaultOptions = {
  panStep: 100,
  bearingStep: 15,
  pitchStep: 10,
};

/**
 * The `KeyboardHandler` allows the user to zoom, rotate, and pan the map using
 * the following keyboard shortcuts:
 *
 * - `=` / `+`: Increase the zoom level by 1.
 * - `Shift-=` / `Shift-+`: Increase the zoom level by 2.
 * - `-`: Decrease the zoom level by 1.
 * - `Shift--`: Decrease the zoom level by 2.
 * - Arrow keys: Pan by 100 pixels.
 * - `Shift+⇢`: Increase the rotation by 15 degrees.
 * - `Shift+⇠`: Decrease the rotation by 15 degrees.
 * - `Shift+⇡`: Increase the pitch by 10 degrees.
 * - `Shift+⇣`: Decrease the pitch by 10 degrees.
 */
class KeyboardHandler {
  private enabled: boolean;
  private active: boolean;
  private panStep: number;
  private bearingStep: number;
  private pitchStep: number;

  /**
   * @private
   */
  constructor() {
    const stepOptions = defaultOptions;
    this.panStep = stepOptions.panStep;
    this.bearingStep = stepOptions.bearingStep;
    this.pitchStep = stepOptions.pitchStep;
  }

  public reset() {
    this.active = false;
  }

  public keydown(e: KeyboardEvent) {
    if (e.altKey || e.ctrlKey || e.metaKey) {
      return;
    }
    let zoomDir = 0;
    let bearingDir = 0;
    let pitchDir = 0;
    let xDir = 0;
    let yDir = 0;

    switch (e.keyCode) {
      case 61:
      case 107:
      case 171:
      case 187:
        zoomDir = 1;
        break;

      case 189:
      case 109:
      case 173:
        zoomDir = -1;
        break;

      case 37:
        if (e.shiftKey) {
          bearingDir = -1;
        } else {
          e.preventDefault();
          xDir = -1;
        }
        break;

      case 39:
        if (e.shiftKey) {
          bearingDir = 1;
        } else {
          e.preventDefault();
          xDir = 1;
        }
        break;

      case 38:
        if (e.shiftKey) {
          pitchDir = 1;
        } else {
          e.preventDefault();
          yDir = -1;
        }
        break;

      case 40:
        if (e.shiftKey) {
          pitchDir = -1;
        } else {
          e.preventDefault();
          yDir = 1;
        }
        break;

      default:
        return;
    }

    return {
      cameraAnimation: (map: Map) => {
        const zoom = map.getZoom();
        map.easeTo(
          {
            duration: 300,
            easeId: 'keyboardHandler',
            easing: easeOut,

            zoom: zoomDir
              ? Math.round(zoom) + zoomDir * (e.shiftKey ? 2 : 1)
              : zoom,
            bearing: map.getBearing() + bearingDir * this.bearingStep,
            pitch: map.getPitch() + pitchDir * this.pitchStep,
            offset: [-xDir * this.panStep, -yDir * this.panStep],
            center: map.getCenter(),
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

function easeOut(t: number) {
  return t * (2 - t);
}

export default KeyboardHandler;
