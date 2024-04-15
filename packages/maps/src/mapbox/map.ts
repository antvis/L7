/**
 * MapboxService
 */
import type { IMercator } from '@antv/l7-core';
import { mat4, vec3 } from 'gl-matrix';
import type { Map } from 'mapbox-gl';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import Viewport from '../lib/web-mercator-viewport';
import type { IMapboxInstance } from '../types';
import BaseMapService from '../utils/BaseMapService';
window.mapboxgl = mapboxgl;

let mapdivCount = 0;
const MAPBOX_API_KEY =
  '101MlGsZ2AmmA&access_token=pk.eyJ1IjoiZXhhbXBsZXMiLCJhIjoiY2p0MG01MXRqMW45cjQzb2R6b2ptc3J4MSJ9.zA2W0IkI0c6KaAhJfk9bWg';

// TODO: 基于抽象类 BaseMap 实现
export default class MapboxService extends BaseMapService<Map & IMapboxInstance> {
  public version: string = 'MAPBOX';
  // get mapStatus method

  public viewport: Viewport;

  public getType() {
    return 'mapbox';
  }

  /**
   * 将经纬度转成墨卡托坐标
   * @param lnglat
   * @returns
   */
  public lngLatToCoord(lnglat: [number, number], origin: IMercator = { x: 0, y: 0, z: 0 }) {
    // @ts-ignore
    const { x, y } = this.lngLatToMercator(lnglat, 0);
    return [x - origin.x, y - origin.y] as [number, number];
  }

  public lngLatToMercator(lnglat: [number, number], altitude: number): IMercator {
    const { x = 0, y = 0, z = 0 } = window.mapboxgl.MercatorCoordinate.fromLngLat(lnglat, altitude);
    return { x, y, z };
  }
  public getModelMatrix(
    lnglat: [number, number],
    altitude: number,
    rotate: [number, number, number],
    scale: [number, number, number] = [1, 1, 1],
    origin: IMercator = { x: 0, y: 0, z: 0 },
  ): number[] {
    const modelAsMercatorCoordinate = window.mapboxgl.MercatorCoordinate.fromLngLat(
      lnglat,
      altitude,
    );
    // @ts-ignore
    const meters = modelAsMercatorCoordinate.meterInMercatorCoordinateUnits();
    const modelMatrix = mat4.create();

    mat4.translate(
      modelMatrix,
      modelMatrix,
      vec3.fromValues(
        modelAsMercatorCoordinate.x - origin.x,
        modelAsMercatorCoordinate.y - origin.y,
        modelAsMercatorCoordinate.z || 0 - origin.z,
      ),
    );

    mat4.scale(
      modelMatrix,
      modelMatrix,
      vec3.fromValues(meters * scale[0], -meters * scale[1], meters * scale[2]),
    );

    mat4.rotateX(modelMatrix, modelMatrix, rotate[0]);
    mat4.rotateY(modelMatrix, modelMatrix, rotate[1]);
    mat4.rotateZ(modelMatrix, modelMatrix, rotate[2]);

    return modelMatrix as unknown as number[];
  }

  public async init(): Promise<void> {
    const {
      id = 'map',
      attributionControl = false,
      style = 'light',
      token = MAPBOX_API_KEY,
      rotation = 0,
      mapInstance,
      ...rest
    } = this.config;

    this.viewport = new Viewport();

    /**
     * TODO: 使用 mapbox v0.53.x 版本 custom layer，需要共享 gl context
     * @see https://github.com/mapbox/mapbox-gl-js/blob/master/debug/threejs.html#L61-L64
     */

    // 判断全局 mapboxgl 对象的加载
    if (!mapInstance && !window.mapboxgl) {
      // 用户有时传递进来的实例是继承于 mapbox 实例化的，不一定是 mapboxgl 对象。
      console.error(this.configService.getSceneWarninfo('SDK'));
    }

    if (
      token === MAPBOX_API_KEY &&
      style !== 'blank' &&
      !window.mapboxgl.accessToken &&
      !mapInstance // 如果用户传递了 mapInstance，应该不去干预实例的 accessToken。
    ) {
      console.warn(this.configService.getSceneWarninfo('MapToken'));
    }

    // 判断是否设置了 accessToken
    if (!mapInstance && !window.mapboxgl.accessToken) {
      // 用户有时传递进来的实例是继承于 mapbox 实例化的，不一定是 mapboxgl 对象。
      window.mapboxgl.accessToken = token;
    }

    if (mapInstance) {
      // @ts-ignore
      this.map = mapInstance;
      this.$mapContainer = this.map.getContainer();
    } else {
      this.$mapContainer = this.creatMapContainer(id);
      // @ts-ignore
      this.map = new window.mapboxgl.Map({
        container: this.$mapContainer,
        style: this.getMapStyleValue(style),
        attributionControl,
        bearing: rotation,
        ...rest,
      });
    }
    this.map.on('load', () => {
      this.handleCameraChanged();
    });
    this.map.on('move', this.handleCameraChanged);

    // 不同于高德地图，需要手动触发首次渲染
    this.handleCameraChanged();
  }

  public destroy() {
    // 销毁地图可视化层的容器
    this.$mapContainer?.parentNode?.removeChild(this.$mapContainer);

    this.eventEmitter.removeAllListeners();
    if (this.map) {
      this.map.remove();
      this.$mapContainer = null;
    }
  }
  public emit(name: string, ...args: any[]) {
    this.eventEmitter.emit(name, ...args);
  }
  public once(name: string, ...args: any[]) {
    this.eventEmitter.once(name, ...args);
  }

  public getMapContainer() {
    return this.$mapContainer;
  }

  public getCanvasOverlays() {
    return this.getMapContainer()?.querySelector('.mapboxgl-canvas-container') as HTMLElement;
  }

  public meterToCoord(center: [number, number], outer: [number, number]) {
    // 统一根据经纬度来转化
    // Tip: 实际米距离 unit meter
    const centerLnglat = new mapboxgl.LngLat(center[0], center[1]);

    const outerLnglat = new mapboxgl.LngLat(outer[0], outer[1]);
    const meterDis = centerLnglat.distanceTo(outerLnglat);

    // Tip: 三维世界坐标距离

    const centerMercator = mapboxgl.MercatorCoordinate.fromLngLat({
      lng: center[0],
      lat: center[1],
    });
    const outerMercator = mapboxgl.MercatorCoordinate.fromLngLat({
      lng: outer[0],
      lat: outer[1],
    });
    const { x: x1, y: y1 } = centerMercator;
    const { x: x2, y: y2 } = outerMercator;
    // Math.pow(2, 22) 4194304
    const coordDis = Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2)) * 4194304 * 2;

    return coordDis / meterDis;
  }

  public exportMap(type: 'jpg' | 'png'): string {
    const renderCanvas = this.map.getCanvas();
    const layersPng =
      type === 'jpg'
        ? (renderCanvas?.toDataURL('image/jpeg') as string)
        : (renderCanvas?.toDataURL('image/png') as string);
    return layersPng;
  }

  protected creatMapContainer(id: string | HTMLDivElement) {
    let $wrapper = id as HTMLDivElement;
    if (typeof id === 'string') {
      $wrapper = document.getElementById(id) as HTMLDivElement;
    }
    const $amapdiv = document.createElement('div');
    $amapdiv.style.cssText += `
      position: absolute;
      top: 0;
      height: 100%;
      width: 100%;
    `;
    $amapdiv.id = 'l7_mapbox_div' + mapdivCount++;
    $wrapper.appendChild($amapdiv);
    return $amapdiv;
  }
}
