/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * MapboxService
 */
import type { IMercator } from '@antv/l7-core';
import { Map, MercatorCoordinate } from '@antv/l7-map';
import { mat4, vec3 } from 'gl-matrix';
import Viewport from '../lib/web-mercator-viewport';
import { MapType } from '../types';
import BaseMapService from '../utils/BaseMapService';

// TODO: 基于抽象类 BaseMap 实现
export default class DefaultMapService extends BaseMapService<Map> {
  public version: string = MapType.DEFAULT;
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
    const { x = 0, y = 0, z = 0 } = MercatorCoordinate.fromLngLat(lnglat, altitude);
    return { x, y, z };
  }
  public getModelMatrix(
    lnglat: [number, number],
    altitude: number,
    rotate: [number, number, number],
    scale: [number, number, number] = [1, 1, 1],
    origin: IMercator = { x: 0, y: 0, z: 0 },
  ): number[] {
    const modelAsMercatorCoordinate = MercatorCoordinate.fromLngLat(lnglat, altitude);
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

  public viewport: Viewport;

  public async init(): Promise<void> {
    const {
      id = 'map',
      style = 'light',
      rotation = 0,
      mapInstance,
      version = 'DEFAULTMAP',
      mapSize = 10000,
      interactive = true,
      ...rest
    } = this.config;

    this.viewport = new Viewport();

    this.version = version;
    this.simpleMapCoord.setSize(mapSize);
    if (version === 'SIMPLE' && rest.center) {
      rest.center = this.simpleMapCoord.unproject(rest.center as [number, number]);
    }
    if (mapInstance) {
      // @ts-ignore
      this.map = mapInstance;
      this.$mapContainer = this.map.getContainer();
    } else {
      this.$mapContainer = this.creatMapContainer(id);
      this.map = new Map({
        container: this.$mapContainer,
        bearing: rotation,
        ...rest,
      });
    }

    this.map.on('load', () => {
      this.handleCameraChanged();
    });
    if (interactive) {
      // L7 作为第三方地图插件时关闭重绘
      this.map.on('move', this.handleCameraChanged);
    }

    // 不同于高德地图，需要手动触发首次渲染
    setTimeout(() => {
      this.handleCameraChanged();
    }, 100);
    this.handleCameraChanged();
  }

  protected creatMapContainer(id: string | HTMLDivElement) {
    let wrapper = id as HTMLDivElement;
    if (typeof id === 'string') {
      wrapper = document.getElementById(id) as HTMLDivElement;
    }
    const container = document.createElement('div');
    container.style.cssText += `
      position: absolute;
      top: 0;
      height: 100%;
      width: 100%;
    `;
    wrapper.appendChild(container);
    return container;
  }

  public exportMap(type: 'jpg' | 'png'): string {
    return '';
  }

  public setMapStyle(style: any): void {}

  public getCanvasOverlays() {
    return this.getContainer();
  }
}
