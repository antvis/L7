import { MousePanHandler } from '../mouse/';
import { TouchPanHandler } from '../touch/';

export interface IDragPanOptions {
  linearity?: number;
  easing?: (t: number) => number;
  deceleration?: number;
  maxSpeed?: number;
}

/**
 * The `DragPanHandler` allows the user to pan the map by clicking and dragging
 * the cursor.
 */
export default class DragPanHandler {
  public inertiaOptions: IDragPanOptions;
  private el: HTMLElement;
  private mousePan: MousePanHandler;
  private touchPan: TouchPanHandler;
  /**
   * @private
   */
  constructor(
    el: HTMLElement,
    mousePan: MousePanHandler,
    touchPan: TouchPanHandler,
  ) {
    this.el = el;
    this.mousePan = mousePan;
    this.touchPan = touchPan;
  }

  /**
   * Enables the "drag to pan" interaction.
   *
   * @param {Object} [options] Options object
   * @param {number} [options.linearity=0] factor used to scale the drag velocity
   * @param {Function} [options.easing=bezier(0, 0, 0.3, 1)] easing function applled to `map.panTo` when applying the drag.
   * @param {number} [options.maxSpeed=1400] the maximum value of the drag velocity.
   * @param {number} [options.deceleration=2500] the rate at which the speed reduces after the pan ends.
   *
   * @example
   *   map.dragPan.enable();
   * @example
   *   map.dragPan.enable({
   *      linearity: 0.3,
   *      easing: bezier(0, 0, 0.3, 1),
   *      maxSpeed: 1400,
   *      deceleration: 2500,
   *   });
   */
  public enable(options?: IDragPanOptions) {
    this.inertiaOptions = options || {};
    this.mousePan.enable();
    this.touchPan.enable();
    this.el.classList.add('l7-touch-drag-pan');
  }

  /**
   * Disables the "drag to pan" interaction.
   *
   * @example
   * map.dragPan.disable();
   */
  public disable() {
    this.mousePan.disable();
    this.touchPan.disable();
    this.el.classList.remove('l7-touch-drag-pan');
  }

  /**
   * Returns a Boolean indicating whether the "drag to pan" interaction is enabled.
   *
   * @returns {boolean} `true` if the "drag to pan" interaction is enabled.
   */
  public isEnabled() {
    return this.mousePan.isEnabled() && this.touchPan.isEnabled();
  }

  /**
   * Returns a Boolean indicating whether the "drag to pan" interaction is active, i.e. currently being used.
   *
   * @returns {boolean} `true` if the "drag to pan" interaction is active.
   */
  public isActive() {
    return this.mousePan.isActive() || this.touchPan.isActive();
  }
}
