import ClickZoomHandler from '../click_zoom';
import TapZoomHandler from '../tap/tap_zoom';

/**
 * The `DoubleClickZoomHandler` allows the user to zoom the map at a point by
 * double clicking or double tapping.
 */
export default class DoubleClickZoomHandler {
  private clickZoom: ClickZoomHandler;
  private tapZoom: TapZoomHandler;

  /**
   * @private
   */
  constructor(clickZoom: ClickZoomHandler, TapZoom: TapZoomHandler) {
    this.clickZoom = clickZoom;
    this.tapZoom = TapZoom;
  }

  /**
   * Enables the "double click to zoom" interaction.
   *
   * @example
   * map.doubleClickZoom.enable();
   */
  public enable() {
    this.clickZoom.enable();
    this.tapZoom.enable();
  }

  /**
   * Disables the "double click to zoom" interaction.
   *
   * @example
   * map.doubleClickZoom.disable();
   */
  public disable() {
    this.clickZoom.disable();
    this.tapZoom.disable();
  }

  /**
   * Returns a Boolean indicating whether the "double click to zoom" interaction is enabled.
   *
   * @returns {boolean} `true` if the "double click to zoom" interaction is enabled.
   */
  public isEnabled() {
    return this.clickZoom.isEnabled() && this.tapZoom.isEnabled();
  }

  /**
   * Returns a Boolean indicating whether the "double click to zoom" interaction is active, i.e. currently being used.
   *
   * @returns {boolean} `true` if the "double click to zoom" interaction is active.
   */
  public isActive() {
    return this.clickZoom.isActive() || this.tapZoom.isActive();
  }
}
