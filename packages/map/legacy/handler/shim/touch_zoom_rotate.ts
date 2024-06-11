import type TapDragZoomHandler from '../tap/tap_drag_zoom';
import type { TouchRotateHandler, TouchZoomHandler } from '../touch';

/**
 * The `TouchZoomRotateHandler` allows the user to zoom and rotate the map by
 * pinching on a touchscreen.
 *
 * They can zoom with one finger by double tapping and dragging. On the second tap,
 * hold the finger down and drag up or down to zoom in or out.
 */
export default class TouchZoomRotateHandler {
  private el: HTMLElement;
  private touchZoom: TouchZoomHandler;
  private touchRotate: TouchRotateHandler;
  private tapDragZoom: TapDragZoomHandler;
  private rotationDisabled: boolean;
  private enabled: boolean;

  /**
   * @private
   */
  constructor(
    el: HTMLElement,
    touchZoom: TouchZoomHandler,
    touchRotate: TouchRotateHandler,
    tapDragZoom: TapDragZoomHandler,
  ) {
    this.el = el;
    this.touchZoom = touchZoom;
    this.touchRotate = touchRotate;
    this.tapDragZoom = tapDragZoom;
    this.rotationDisabled = false;
    this.enabled = true;
  }

  /**
   * Enables the "pinch to rotate and zoom" interaction.
   *
   * @param {Object} [options] Options object.
   * @param {string} [options.around] If "center" is passed, map will zoom around the center
   *
   * @example
   *   map.touchZoomRotate.enable();
   * @example
   *   map.touchZoomRotate.enable({ around: 'center' });
   */
  public enable(options: { around?: 'center' }) {
    this.touchZoom.enable(options);
    if (!this.rotationDisabled) {
      this.touchRotate.enable(options);
    }
    this.tapDragZoom.enable();

    this.el.classList.add('l7-touch-zoom-rotate');
  }

  /**
   * Disables the "pinch to rotate and zoom" interaction.
   *
   * @example
   *   map.touchZoomRotate.disable();
   */
  public disable() {
    this.touchZoom.disable();
    this.touchRotate.disable();
    this.tapDragZoom.disable();

    this.el.classList.remove('l7-touch-zoom-rotate');
  }

  /**
   * Returns a Boolean indicating whether the "pinch to rotate and zoom" interaction is enabled.
   *
   * @returns {boolean} `true` if the "pinch to rotate and zoom" interaction is enabled.
   */
  public isEnabled() {
    return (
      this.touchZoom.isEnabled() &&
      (this.rotationDisabled || this.touchRotate.isEnabled()) &&
      this.tapDragZoom.isEnabled()
    );
  }

  /**
   * Returns true if the handler is enabled and has detected the start of a zoom/rotate gesture.
   *
   * @returns {boolean} //eslint-disable-line
   */
  public isActive() {
    return this.touchZoom.isActive() || this.touchRotate.isActive() || this.tapDragZoom.isActive();
  }

  /**
   * Disables the "pinch to rotate" interaction, leaving the "pinch to zoom"
   * interaction enabled.
   *
   * @example
   *   map.touchZoomRotate.disableRotation();
   */
  public disableRotation() {
    this.rotationDisabled = true;
    this.touchRotate.disable();
  }

  /**
   * Enables the "pinch to rotate" interaction.
   *
   * @example
   *   map.touchZoomRotate.enable();
   *   map.touchZoomRotate.enableRotation();
   */
  public enableRotation() {
    this.rotationDisabled = false;
    if (this.touchZoom.isEnabled()) {
      this.touchRotate.enable();
    }
  }
}
