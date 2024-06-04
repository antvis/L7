import type { MousePitchHandler, MouseRotateHandler } from '../mouse';

/**
 * The `DragRotateHandler` allows the user to rotate the map by clicking and
 * dragging the cursor while holding the right mouse button or `ctrl` key.
 */
export default class DragRotateHandler {
  private mouseRotate: MouseRotateHandler;
  private mousePitch: MousePitchHandler;
  private pitchWithRotate: boolean;

  /**
   * @param {Object} [options]
   * @param {number} [options.bearingSnap] The threshold, measured in degrees, that determines when the map's
   *   bearing will snap to north.
   * @param {bool} [options.pitchWithRotate=true] Control the map pitch in addition to the bearing
   * @private
   */
  constructor(
    options: { pitchWithRotate: boolean },
    mouseRotate: MouseRotateHandler,
    mousePitch: MousePitchHandler,
  ) {
    this.pitchWithRotate = options.pitchWithRotate;
    this.mouseRotate = mouseRotate;
    this.mousePitch = mousePitch;
  }

  /**
   * Enables the "drag to rotate" interaction.
   *
   * @example
   * map.dragRotate.enable();
   */
  public enable() {
    this.mouseRotate.enable();
    if (this.pitchWithRotate) {
      this.mousePitch.enable();
    }
  }

  /**
   * Disables the "drag to rotate" interaction.
   *
   * @example
   * map.dragRotate.disable();
   */
  public disable() {
    this.mouseRotate.disable();
    this.mousePitch.disable();
  }

  /**
   * Returns a Boolean indicating whether the "drag to rotate" interaction is enabled.
   *
   * @returns {boolean} `true` if the "drag to rotate" interaction is enabled.
   */
  public isEnabled() {
    return this.mouseRotate.isEnabled() && (!this.pitchWithRotate || this.mousePitch.isEnabled());
  }

  /**
   * Returns a Boolean indicating whether the "drag to rotate" interaction is active, i.e. currently being used.
   *
   * @returns {boolean} `true` if the "drag to rotate" interaction is active.
   */
  public isActive() {
    return this.mouseRotate.isActive() || this.mousePitch.isActive();
  }
}
