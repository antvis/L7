/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * AMapService
 */
import AMapLoader from '@amap/amap-jsapi-loader';

import type { Bounds, IMapCamera, IPoint, IViewport } from '@antv/l7-core';
import { CoordinateSystem } from '@antv/l7-core';
import { DOM, amap2Project } from '@antv/l7-utils';
import type { vec2 } from 'gl-matrix';
import { mat4, vec3 } from 'gl-matrix';
import type { IAMapInstance } from '../../typings/index';
import AMapBaseService from '../utils/amap/AMapBaseService';
import Viewport from './Viewport';
// @ts-ignore
import './logo.css';
const DEFAULTMAPCENTER = [108.92361, 34.54083];

// @ts-ignore
window.forceWebGL = true;
const AMAP_API_KEY: string = 'f59bcf249433f8b05caaee19f349b3d7';
// 'ff533602d57df6f8ab3b0fea226ae52f';
const AMAP_VERSION: string = '2.0';

/**
 * 高德地图脚本是否加载完毕
 */
const amapLoaded = false;
/**
 * 高德地图脚本加载成功等待队列，成功之后依次触发
 */
const pendingResolveQueue: Array<() => void> = [];

/**
 * AMapService
 */
export default class AMapService extends AMapBaseService {
  public version: string = 'GAODE2.x';

  /**
   * 用于 customCooords 数据的计算
   */
  public sceneCenter!: [number, number]; // 一般使用用户数据的第一个
  public sceneCenterMercator!: [number, number]; // 莫卡托

  protected viewport: Viewport;

  /**
   *   设置数据的绘制中心 高德2.0
   */
  public setCustomCoordCenter(center: [number, number]) {
    this.sceneCenter = center;
    this.sceneCenterMercator = amap2Project(...center);
  }

  public getCustomCoordCenter(): [number, number] {
    return this.sceneCenterMercator;
  }

  public lngLatToCoordByLayer(
    lnglat: number[],
    layerCenterMercator: [number, number],
  ) {
    const layerCenterFlat = layerCenterMercator || this.sceneCenterMercator;
    const coord = this._sub(
      amap2Project(lnglat[0], lnglat[1]),
      layerCenterFlat,
    );
    // Z 参数
    if (lnglat[2]) {
      coord.push(lnglat[2]);
    }
    return coord;
  }

  public coordToAMap2RelativeCoordinates(
    lnglatArray: number[][][] | number[][] | number[],
    layerCenter: [number, number],
  ): number[][][] | number[][] | number[] {
    const layerCenterMercator = amap2Project(layerCenter[0], layerCenter[1]);
    if (typeof lnglatArray[0] === 'number') {
      return this.lngLatToCoordByLayer(
        lnglatArray as number[],
        layerCenterMercator,
      );
    } else {
      // @ts-ignore
      return lnglatArray.map((lnglats) => {
        if (Array.isArray(lnglats) && typeof lnglats[0] === 'number') {
          return this.lngLatToCoordByLayer(
            lnglats as number[],
            layerCenterMercator,
          );
        } else {
          // @ts-ignore
          return lnglats.map((lnglat) => {
            return this.lngLatToCoordByLayer(
              lnglat as number[],
              layerCenterMercator,
            );
          });
        }
      });
    }
  }

  public setCoordCenter(center: [number, number]) {
    // @ts-ignore
    this.map.customCoords.setCenter(center || DEFAULTMAPCENTER);
    this.setCustomCoordCenter(center || DEFAULTMAPCENTER);
  }

  /**
   * 根据数据的绘制中心转换经纬度数据 高德2.0
   */
  public lngLatToCoord(lnglat: [number, number]) {
    // 单点
    if (!this.sceneCenter) {
      // @ts-ignore
      this.map.customCoords.setCenter(lnglat);
      this.setCustomCoordCenter(lnglat);
    }
    return this._sub(
      amap2Project(lnglat[0], lnglat[1]),
      this.sceneCenterMercator,
    );
  }

  /**
   * 转化线、面类型的点位数据
   */
  public lngLatToCoords(
    lnglatArray: number[][][] | number[][],
  ): number[][][] | number[][] {
    // @ts-ignore
    return lnglatArray.map((lnglats) => {
      if (typeof lnglats[0] === 'number') {
        return this.lngLatToCoord(lnglats as [number, number]);
      } else {
        // @ts-ignore
        return lnglats.map((lnglat) => {
          return this.lngLatToCoord(lnglat as [number, number]);
        });
      }
    });
  }

  public addMarkerContainer(): void {
    if (!this.map) {
      return;
    }
    const mapContainer = this.map.getContainer();
    if (mapContainer !== null) {
      const amap = mapContainer.getElementsByClassName(
        'amap-maps',
      )[0] as HTMLElement;
      // amap2 的 amap-maps 新增 z-index=0; 样式，让 marker 中 zIndex 失效
      amap.style.zIndex = 'auto';
      this.markerContainer = DOM.create('div', 'l7-marker-container2', amap);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // tslint:disable-next-line:variable-name no-empty
  public updateView(_viewOption: Partial<IMapCamera>): void {}

  public getOverlayContainer(): HTMLElement | undefined {
    return undefined;
  }

  public getType() {
    return 'amap2';
  }

  public getBounds(): Bounds {
    const bounds = this.map.getBounds();

    // @ts-ignore
    const NE = bounds.getNorthEast();
    // @ts-ignore
    const SW = bounds.getSouthWest();
    const center = this.getCenter();
    const maxlng =
      center.lng > NE.getLng() || center.lng < SW.getLng()
        ? 180 - NE.getLng()
        : NE.getLng();
    const minlng = center.lng < SW.getLng() ? SW.getLng() - 180 : SW.getLng();
    // 兼容 Mapbox，统一返回西南、东北
    return [
      [minlng, SW.getLat()],
      [maxlng, NE.getLat()],
    ];
  }

  public getMinZoom(): number {
    // const zooms = this.map.get('zooms') as [number, number];
    // @ts-ignore
    const zooms = this.map.getZooms() as [number, number];
    return zooms[0] - 1;
  }
  public getMaxZoom(): number {
    // const zooms = this.map.get('zooms') as [number, number];
    // @ts-ignore
    const zooms = this.map.getZooms() as [number, number];
    return zooms[1] - 1;
  }

  public lngLatToContainer(lnglat: [number, number]): IPoint {
    const pixel = this.map.lngLatToContainer(lnglat);
    return {
      x: pixel.getX(),
      y: pixel.getY(),
    };
  }
  public lngLatToPixel(lnglat: [number, number]): IPoint {
    // @ts-ignore
    const p = this.map.lngLatToPixel(new AMap.LngLat(lnglat[0], lnglat[1]));
    // lngLatToPixel
    return {
      x: p.getX(),
      y: p.getY(),
    };
  }

  public getModelMatrix(
    lnglat: [number, number],
    altitude: number,
    rotate: [number, number, number],
    scale: [number, number, number] = [1, 1, 1],
  ): number[] {
    // const flat = this.viewport.projectFlat(lnglat);
    // @ts-ignore
    const flat = this.map.customCoords.lngLatToCoord(lnglat);
    // @ts-ignore
    const modelMatrix = mat4.create();

    mat4.translate(
      modelMatrix,
      modelMatrix,
      vec3.fromValues(flat[0], flat[1], altitude),
    );

    mat4.scale(
      modelMatrix,
      modelMatrix,
      vec3.fromValues(scale[0], scale[1], scale[2]),
    );

    mat4.rotateX(modelMatrix, modelMatrix, rotate[0]);
    mat4.rotateY(modelMatrix, modelMatrix, rotate[1]);
    mat4.rotateZ(modelMatrix, modelMatrix, rotate[2]);

    return modelMatrix as unknown as number[];
  }
  public async init(): Promise<void> {
    const {
      id,
      style = 'light',
      minZoom = 0,
      maxZoom = 24,
      token = AMAP_API_KEY,
      mapInstance,
      plugin = [],
      version = AMAP_VERSION,
      ...rest
    } = this.config;
    this.viewport = new Viewport();
    if (!(window.AMap || mapInstance)) {
      plugin.push('Map3D');
      // if (AMapLoader.status.AMap === 'notload') {
      await AMapLoader.load({
        key: token, // 申请好的Web端开发者Key，首次调用 load 时必填
        version: AMAP_VERSION, // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
        plugins: plugin, // 需要使用的的插件列表，如比例尺'AMap.Scale'等
      });
    }
    if (mapInstance) {
      this.map = mapInstance as AMap.Map & IAMapInstance;
      this.$mapContainer = this.map.getContainer();

      // 在使用 map.customCoords 的时候必须使用
      const mapInitCenter = this.map.getCenter();
      // @ts-ignore
      this.map.customCoords?.setCenter([
        // @ts-ignore
        mapInitCenter.lng,
        // @ts-ignore
        mapInitCenter.lat,
      ]);
      // @ts-ignore
      this.setCustomCoordCenter([mapInitCenter.lng, mapInitCenter.lat]);
      this.map.on('viewchange', this.handleViewChanged);
    } else {
      this.$mapContainer = this.creatMapContainer(
        id as string | HTMLDivElement,
      );
      const mapConstructorOptions = {
        mapStyle: this.getMapStyleValue(style as string),
        zooms: [minZoom, maxZoom],
        viewMode: '3D',
        ...rest,
      };
      if (mapConstructorOptions.zoom) {
        // 高德地图在相同大小下需要比 MapBox 多一个 zoom 层级
        mapConstructorOptions.zoom += 1;
      }
      if (token === AMAP_API_KEY) {
        // @ts-ignore
        window._AMapSecurityConfig = {
          securityJsCode: '2653011adeb04230b3a26cc9a780a800',
        };

        console.warn(
          `%c${this.configService.getSceneWarninfo('MapToken')}!`,
          'color: #873bf4;font-weigh:900;font-size: 16px;',
        );
      }
      // @ts-ignore
      const map = new AMap.Map(this.$mapContainer, mapConstructorOptions);
      // @ts-ignore
      this.map = map;
      // 在使用 map.customCoords 的时候必须使用
      const mapInitCenter = map.getCenter();
      // @ts-ignore

      // @ts-ignore
      this.map.customCoords?.setCenter([mapInitCenter.lng, mapInitCenter.lat]);

      // @ts-ignore
      this.setCustomCoordCenter([mapInitCenter.lng, mapInitCenter.lat]);
      // 监听地图相机事件
      map.on('viewchange', this.handleViewChanged);
    }

    this.initViewPort();
  }

  public getMapContainer() {
    return this.$mapContainer;
  }

  public onCameraChanged(callback: (viewport: IViewport) => void): void {
    this.cameraChangedCallback = callback;
  }

  private initViewPort() {
    // @ts-ignore
    const {
      // @ts-ignore
      fov,
      // @ts-ignore
      near,
      // @ts-ignore
      far,
      // @ts-ignore
      aspect,
      // @ts-ignore
      position,
      // @ts-ignore
      lookAt,
      // @ts-ignore
      up,
      // @ts-ignore
      // left, right, bottom, top
      // @ts-ignore
    } = this.map.customCoords?.getCameraParams() || {};
    // Tip: 统一触发地图变化事件
    this.emit('mapchange');
    // @ts-ignore
    const center = this.map.customCoords.getCenter() as [number, number];
    const zoom = this.map.getZoom();
    // @ts-ignore
    if (this.cameraChangedCallback) {
      this.viewport.syncWithMapCamera({
        aspect,
        far,
        fov,
        cameraPosition: position,
        lookAt,
        near,
        up,
        // AMap 定义的缩放等级 与 Mapbox 相差 1
        zoom: zoom - 1, // 与amap1.x对比相差一个级别
        center,
        offsetOrigin: [position[0], position[1]],

        // @ts-ignore
        // left, right, bottom, top
      });
      // set coordinate system
      this.coordinateSystemService.setCoordinateSystem(CoordinateSystem.P20_2);
      this.cameraChangedCallback(this.viewport);
    }
  }

  private _sub(a: number[] | vec3 | vec2, b: number[]): [number, number] {
    const r: [number, number] = [0, 0];
    r[0] = a[0] - b[0];
    r[1] = a[1] - b[1];
    return r;
  }

  /**
   *
   * @param e
   */
  private handleViewChanged = (e: any): void => {
    const {
      // @ts-ignore
      fov,
      // @ts-ignore
      near,
      // @ts-ignore
      far,
      // @ts-ignore
      aspect,
      // @ts-ignore
      position,
      // @ts-ignore
      lookAt,
      // @ts-ignore
      up,
      // @ts-ignore
      // left, right, bottom, top
      // @ts-ignore
    } = this.map.customCoords.getCameraParams();
    // Tip: 统一触发地图变化事件
    this.emit('mapchange');
    // @ts-ignore
    const center = this.map.customCoords.getCenter() as [number, number];
    if (this.cameraChangedCallback) {
      // resync viewport
      this.viewport.syncWithMapCamera({
        aspect,
        far,
        fov,
        cameraPosition: position,
        lookAt,
        up,
        near,
        // AMap 定义的缩放等级 与 Mapbox 相差 1
        zoom: this.map.getZoom() - 1, // 与amap1.x对比相差一个级别
        center,
        offsetOrigin: [position[0], position[1]],

        // @ts-ignore
        // left, right, bottom, top
      });
      // set coordinate system
      this.coordinateSystemService.setCoordinateSystem(CoordinateSystem.P20_2);
      this.cameraChangedCallback(this.viewport);
    }
  };
}
