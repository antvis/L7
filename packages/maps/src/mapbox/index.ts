/**
 * MapboxService
 */
import {
  CoordinateSystem,
  ICoordinateSystemService,
  IMapConfig,
  IMapService,
  IViewport,
  TYPES,
} from '@l7/core';
import { inject, injectable } from 'inversify';
import mapboxgl from 'mapbox-gl';
import Viewport from './Viewport';

mapboxgl.accessToken =
  'pk.eyJ1IjoieGlhb2l2ZXIiLCJhIjoiY2pxcmc5OGNkMDY3cjQzbG42cXk5NTl3YiJ9.hUC5Chlqzzh0FFd_aEc-uQ';
const LNGLAT_OFFSET_ZOOM_THRESHOLD = 12;

/**
 * AMapService
 */
@injectable()
export default class MapboxService implements IMapService {
  @inject(TYPES.ICoordinateSystemService)
  private readonly coordinateSystemService: ICoordinateSystemService;

  private map: IMapboxInstance;
  private viewport: Viewport;
  private cameraChangedCallback: (viewport: IViewport) => void;

  public async init(mapConfig: IMapConfig): Promise<void> {
    const { id, ...rest } = mapConfig;

    this.viewport = new Viewport();

    /**
     * TODO: 使用 mapbox v0.53.x 版本 custom layer，需要共享 gl context
     * @see https://github.com/mapbox/mapbox-gl-js/blob/master/debug/threejs.html#L61-L64
     */
    // @ts-ignore
    this.map = new mapboxgl.Map({
      container: id,
      ...rest,
    });

    this.map.on('move', this.handleCameraChanged);

    // 不同于高德地图，需要手动触发首次渲染
    this.handleCameraChanged();

    const $link: HTMLLinkElement = document.createElement('link');
    $link.href =
      'https://api.tiles.mapbox.com/mapbox-gl-js/v1.2.1/mapbox-gl.css';
    $link.rel = 'stylesheet';
    document.head.appendChild($link);
  }

  public onCameraChanged(callback: (viewport: IViewport) => void): void {
    this.cameraChangedCallback = callback;
  }

  private handleCameraChanged = () => {
    // @see https://github.com/mapbox/mapbox-gl-js/issues/2572
    const { lat, lng } = this.map.getCenter().wrap();

    // resync
    this.viewport.syncWithMapCamera({
      bearing: this.map.getBearing(),
      center: [lng, lat],
      viewportHeight: this.map.transform.height,
      pitch: this.map.getPitch(),
      viewportWidth: this.map.transform.width,
      zoom: this.map.getZoom(),
      // mapbox 中固定相机高度为 viewport 高度的 1.5 倍
      cameraHeight: 0,
    });

    // set coordinate system
    if (this.viewport.getZoom() > LNGLAT_OFFSET_ZOOM_THRESHOLD) {
      this.coordinateSystemService.setCoordinateSystem(
        CoordinateSystem.LNGLAT_OFFSET,
      );
    } else {
      this.coordinateSystemService.setCoordinateSystem(CoordinateSystem.LNGLAT);
    }

    this.cameraChangedCallback(this.viewport);
  };
}
