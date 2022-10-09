/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * MapboxService
 */
import { CoordinateSystem, IMercator } from '@antv/l7-core';
import { Map } from '@antv/l7-map';
import { $window } from '@antv/l7-utils';
import { injectable } from 'inversify';
import 'reflect-metadata';
import { Version } from '../version';
import Viewport from '../utils/Viewport';
import BaseMapService from '../utils/BaseMapService';

const LNGLAT_OFFSET_ZOOM_THRESHOLD = 12;
/**
 * AMapService
 */
@injectable()
export default class L7MapService extends BaseMapService<Map> {
  public version: string = Version.L7MAP;
  public lngLatToMercator(
    _lnglat: [number, number],
    _altitude: number,
  ): IMercator {
    throw new Error('Method not implemented.');
  }
  public getModelMatrix(): number[] {
    throw new Error('Method not implemented.');
  }
  public viewport: Viewport;

  public async init(): Promise<void> {
    const {
      id = 'map',
      style = 'light',
      rotation = 0,
      mapInstance,
      version = 'L7MAP',
      mapSize = 10000,
      interactive = true,
      ...rest
    } = this.config;

    this.viewport = new Viewport();

    this.version = version;
    this.simpleMapCoord.setSize(mapSize);
    if (version === Version.SIMPLE && rest.center) {
      rest.center = this.simpleMapCoord.unproject(
        rest.center as [number, number],
      );
    }
    if (mapInstance) {
      // @ts-ignore
      this.map = mapInstance;
      this.$mapContainer = this.map.getContainer();
    } else {
      this.$mapContainer = this.creatMapContainer(id);
      // @ts-ignore
      this.map = new Map({
        container: this.$mapContainer,
        style: this.getMapStyle(style),
        bearing: rotation,
        ...rest,
      });
    }

    this.map.on('load', this.handleCameraChanged);
    if (interactive) {
      // L7 作为第三方地图插件时关闭重绘
      this.map.on('move', this.handleCameraChanged);
    }

    // 不同于高德地图，需要手动触发首次渲染
    this.handleCameraChanged();
  }

  // 初始化小程序地图
  public async initMiniMap(): Promise<void> {
    const {
      id = 'map',
      style = 'light',
      rotation = 0,
      mapInstance,
      canvas = null,
      hasBaseMap = false,
      ...rest
    } = this.config;

    this.viewport = new Viewport();

    this.$mapContainer = canvas;

    this.map = new Map({
      container: this.$mapContainer as HTMLElement,
      style: this.getMapStyle(style),
      bearing: rotation,
      // @ts-ignore
      canvas,
      ...rest,
    });

    if (!hasBaseMap) {
      // 没有地图底图的模式
      this.map.on('load', this.handleCameraChanged);
      this.map.on('move', this.handleCameraChanged);

      // 不同于高德地图，需要手动触发首次渲染
      this.handleCameraChanged();
    } else {
      // 存在地图底图的模式（ L7Mini ）
      const center = this.map.getCenter();
      // 不同于高德地图，需要手动触发首次渲染
      this.handleMiniCameraChanged(
        center.lng,
        center.lat,
        this.map.getZoom(),
        this.map.getBearing(),
        this.map.getPitch(),
      );
      $window.document.addEventListener('mapCameaParams', (event: any) => {
        const {
          e: { longitude, latitude, scale, bearing, pitch },
        } = event;
        this.handleMiniCameraChanged(
          longitude,
          latitude,
          scale - 1.25,
          bearing,
          pitch,
        );
      });
    }
  }

  public exportMap(type: 'jpg' | 'png'): string {
    const renderCanvas = this.map.getCanvas();
    const layersPng =
      type === 'jpg'
        ? (renderCanvas?.toDataURL('image/jpeg') as string)
        : (renderCanvas?.toDataURL('image/png') as string);
    return layersPng;
  }

  // 处理小程序中有底图模式下的相机跟新
  private handleMiniCameraChanged = (
    lng: number,
    lat: number,
    zoom: number,
    bearing: number,
    pitch: number,
  ) => {
    const { offsetCoordinate = true } = this.config;

    // resync
    this.viewport.syncWithMapCamera({
      // bearing: this.map.getBearing(),
      bearing,
      center: [lng, lat],
      viewportHeight: this.map.transform.height,
      // pitch: this.map.getPitch(),
      pitch,
      viewportWidth: this.map.transform.width,
      zoom,
      // mapbox 中固定相机高度为 viewport 高度的 1.5 倍
      cameraHeight: 0,
    });
    // set coordinate system
    if (
      this.viewport.getZoom() > LNGLAT_OFFSET_ZOOM_THRESHOLD &&
      offsetCoordinate
    ) {
      this.coordinateSystemService.setCoordinateSystem(
        CoordinateSystem.LNGLAT_OFFSET,
      );
    } else {
      this.coordinateSystemService.setCoordinateSystem(CoordinateSystem.LNGLAT);
    }

    this.cameraChangedCallback(this.viewport);
  };
}
