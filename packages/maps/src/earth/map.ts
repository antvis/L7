/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * MapboxService
 */
import type { IEarthService, IMercator, IViewport } from '@antv/l7-core';
import { CoordinateSystem, MapServiceEvent } from '@antv/l7-core';
import { Map } from '@antv/l7-map';
import BaseMapService from '../utils/BaseMapService';
import Viewport from './Viewport';
const EventMap: {
  [key: string]: any;
} = {
  mapmove: 'move',
  camerachange: 'move',
  zoomchange: 'zoom',
  dragging: 'drag',
};

const LNGLAT_OFFSET_ZOOM_THRESHOLD = 12;
/**
 * EarthService
 */
export default class L7EarthService extends BaseMapService<Map> implements IEarthService {
  public lngLatToMercator(lnglat: [number, number], altitude: number): IMercator {
    throw new Error('Method not implemented.');
  }
  public getModelMatrix(
    lnglat: [number, number],
    altitude: number,
    rotate: [number, number, number],
    scale: [number, number, number],
    origin: IMercator,
  ): number[] {
    throw new Error('Method not implemented.');
  }
  public version: string = 'GLOBEL';
  // TODO: 判断地图是否正在拖拽
  public dragging: boolean = false;
  public viewport: Viewport;

  // T: 用于记录鼠标对相机的控制
  private handleCameraChanging: boolean;
  private handleCameraTimer: any;

  //  map event
  public on(type: string, handle: (...args: any[]) => void): void {
    if (MapServiceEvent.indexOf(type) !== -1) {
      this.eventEmitter.on(type, handle);
    } else {
      // 统一事件名称
      this.map.on(EventMap[type] || type, handle);
    }
  }
  public off(type: string, handle: (...args: any[]) => void): void {
    this.map.off(EventMap[type] || type, handle);
    this.eventEmitter.off(type, handle);
  }

  public getMapCanvasContainer(): HTMLElement {
    return this.map.getCanvasContainer() as HTMLElement;
  }

  public getSize(): [number, number] {
    const size = this.map.transform;
    return [size.width, size.height];
  }
  // get mapStatus method

  public getType() {
    return 'earth';
  }

  public async init(): Promise<void> {
    const { id = 'map', style = 'light', rotation = 0, ...rest } = this.config;

    this.viewport = new Viewport();

    this.$mapContainer = this.creatMapContainer(id);
    this.map = new Map({
      container: this.$mapContainer,
      bearing: rotation,
      ...rest,
    });

    this.map.on('load', this.handleCameraChanged);
    this.map.on('move', this.handleCameraChanged);

    // 不同于高德地图，需要手动触发首次渲染
    this.handleCameraChanged({});
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
    return undefined;
  }

  public onCameraChanged(callback: (viewport: IViewport) => void): void {
    this.cameraChangedCallback = callback;
  }

  /**
   * 地球模式向外暴露的 Y 轴旋转方法
   * @returns
   */
  public rotateY(option: { force: boolean; reg: number }) {
    const { force = false, reg = 0.01 } = option || {};
    // TODO: 让旋转方法与
    if (this.handleCameraChanging && !force) {
      return;
    }

    if (this.viewport) {
      this.viewport.rotateY(reg);

      this.viewport.syncWithMapCamera({
        viewportHeight: this.map.transform.height,
        viewportWidth: this.map.transform.width,
      });

      this.cameraChangedCallback(this.viewport);
    }
  }

  protected handleCameraChanged = (e: any) => {
    // Tip: 统一触发地图变化事件
    this.emit('mapchange');
    const DELAY_TIME = 2000;
    this.handleCameraChanging = true;
    if (this.handleCameraTimer) {
      clearTimeout(this.handleCameraTimer);
    }
    this.handleCameraTimer = setTimeout(() => {
      this.handleCameraChanging = false;
    }, DELAY_TIME);
    // 定义鼠标相机控制
    const rotateStep = 0.02;
    if (e.type && e.originalEvent) {
      if (e.originalEvent.type === 'wheel') {
        this.viewport.scaleZoom(0.01 * Math.sign(e.originalEvent.wheelDelta) * -1);
      }

      if (Math.abs(e.originalEvent.movementX) > Math.abs(e.originalEvent.movementY)) {
        if (e.originalEvent.movementX > 0) {
          this.viewport.rotateY(rotateStep);
        } else if (e.originalEvent.movementX < 0) {
          this.viewport.rotateY(-rotateStep);
        }
      } else {
        if (e.originalEvent.movementY > 0) {
          this.viewport.rotateX(rotateStep);
        } else if (e.originalEvent.movementY < 0) {
          this.viewport.rotateX(-rotateStep);
        }
      }
    }

    const { offsetCoordinate = true } = this.config;

    // resync
    this.viewport.syncWithMapCamera({
      viewportHeight: this.map.transform.height,
      viewportWidth: this.map.transform.width,
    });
    // set coordinate system
    if (this.viewport.getZoom() > LNGLAT_OFFSET_ZOOM_THRESHOLD && offsetCoordinate) {
      this.coordinateSystemService.setCoordinateSystem(CoordinateSystem.LNGLAT_OFFSET);
    } else {
      this.coordinateSystemService.setCoordinateSystem(CoordinateSystem.LNGLAT);
    }

    this.cameraChangedCallback(this.viewport);
  };
}
