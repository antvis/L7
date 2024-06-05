import type { Handler } from '../handler_manager';
import { DOM } from '../util/dom';

import type { Map } from '../map';

/**
 * The {@link CooperativeGesturesHandler} options object for the gesture settings
 */
export type GestureOptions = boolean;

/**
 * A `CooperativeGestureHandler` is a control that adds cooperative gesture info when user tries to zoom in/out.
 *
 * @group Handlers
 *
 * @example
 * ```ts
 * const map = new Map({
 *   cooperativeGestures: true
 * });
 * ```
 * @see [Example: cooperative gestures](https://maplibre.org/maplibre-gl-js-docs/example/cooperative-gestures/)
 **/
export class CooperativeGesturesHandler implements Handler {
  _options: GestureOptions;
  _map: Map;
  _container: HTMLElement;
  /**
   * This is the key that will allow to bypass the cooperative gesture protection
   */
  _bypassKey: 'metaKey' | 'ctrlKey' =
    navigator.userAgent.indexOf('Mac') !== -1 ? 'metaKey' : 'ctrlKey';
  _enabled: boolean;

  constructor(map: Map, options: GestureOptions) {
    this._map = map;
    this._options = options;
    this._enabled = false;
  }
  isActive(): boolean {
    return false;
  }
  reset(): void {}

  _setupUI() {
    if (this._container) return;
    const mapCanvasContainer = this._map.getCanvasContainer();
    // Add a cooperative gestures class (enable touch-action: pan-x pan-y;)
    mapCanvasContainer.classList.add('l7-cooperative-gestures');
    this._container = DOM.create('div', 'l7-cooperative-gesture-screen', mapCanvasContainer);
    // Create and append the desktop message div
    const desktopDiv = document.createElement('div');
    desktopDiv.className = 'l7-desktop-message';
    desktopDiv.textContent = 'Missing UI string';
    this._container.appendChild(desktopDiv);
    // Create and append the mobile message div
    const mobileDiv = document.createElement('div');
    mobileDiv.className = 'l7-mobile-message';
    mobileDiv.textContent = 'Missing UI string';
    this._container.appendChild(mobileDiv);
    // Remove cooperative gesture screen from the accessibility tree since screenreaders cannot interact with the map using gestures
    this._container.setAttribute('aria-hidden', 'true');
  }

  _destoryUI() {
    if (this._container) {
      DOM.remove(this._container);
      const mapCanvasContainer = this._map.getCanvasContainer();
      mapCanvasContainer.classList.remove('l7-cooperative-gestures');
    }
    delete this._container;
  }

  enable() {
    this._setupUI();
    this._enabled = true;
  }

  disable() {
    this._enabled = false;
    this._destoryUI();
  }

  isEnabled() {
    return this._enabled;
  }

  touchmove(e: TouchEvent) {
    this._onCooperativeGesture(e.touches.length === 1);
  }

  wheel(e: WheelEvent) {
    if (!this._map.scrollZoom.isEnabled()) {
      return;
    }
    this._onCooperativeGesture(!e[this._bypassKey]);
  }

  _onCooperativeGesture(showNotification: boolean) {
    if (!this._enabled || !showNotification) return;
    // Alert user how to scroll/pan
    this._container.classList.add('l7-show');
    setTimeout(() => {
      this._container.classList.remove('l7-show');
    }, 100);
  }
}
