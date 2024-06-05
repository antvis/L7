import type { IEarthService, IMercator } from '@antv/l7-core';
import { MapServiceEvent } from '@antv/l7-core';
import { Map } from '@antv/l7-map';
import MapService from '../map/map';
import { MapType } from '../types';
import EarthViewport from './earth-viewport';

const EarthEvent: Record<string, string> = {
  mapmove: 'move',
  camerachange: 'move',
  zoomchange: 'zoom',
  dragging: 'drag',
};

/**
 * EarthService
 */
export default class EarthService extends MapService implements IEarthService {
  protected viewport = new EarthViewport();

  public type: string = MapType.GLOBEL;

  public dragging: boolean = false;

  // 用于记录鼠标对相机的控制
  private handleCameraChanging: boolean;
  private handleCameraTimer: any;

  public async init(): Promise<void> {
    const { id = 'map', rotation = 0, ...rest } = this.config;

    this.mapContainer = this.creatMapContainer(id);
    this.map = new Map({
      container: this.mapContainer,
      bearing: rotation,
      ...rest,
    });

    this.map.on('load', this.handleCameraChanged);
    this.map.on('move', this.handleCameraChanged);

    this.handleCameraChanged({});
  }

  protected handleCameraChanged = (e?: any) => {
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

    const option = {
      viewportWidth: this.map.transform.width,
      viewportHeight: this.map.transform.height,
    };

    this.updateView(option);
  };

  public getCanvasOverlays() {
    return null;
  }

  // MapEvent，定义事件类型
  public on(type: string, handle: (...args: any[]) => void): void {
    if (MapServiceEvent.indexOf(type) !== -1) {
      this.eventEmitter.on(type, handle);
    } else {
      // 统一事件名称
      this.map.on(EarthEvent[type] || type, handle);
    }
  }

  public once(type: string, handle: (...args: any[]) => void) {
    if (MapServiceEvent.indexOf(type) !== -1) {
      this.eventEmitter.once(type, handle);
    } else {
      // 统一事件名称
      this.map.once(EarthEvent[type] || type, handle);
    }
  }

  public off(type: string, handle: (...args: any[]) => void): void {
    this.map.off(EarthEvent[type] || type, handle);
    this.eventEmitter.off(type, handle);
  }

  public getSize(): [number, number] {
    const size = this.map.transform;

    return [size.width, size.height];
  }

  /**
   * 地球模式向外暴露的 Y 轴旋转方法
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

      this.cameraChangedCallback?.(this.viewport);
    }
  }

  /**
   * 将经纬度转成墨卡托坐标
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public lngLatToMercator(lnglat: [number, number], altitude: number): IMercator {
    throw new Error('Method not implemented.');
  }

  public getModelMatrix(
    lnglat: [number, number],
    altitude: number,
    rotate: [number, number, number],
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    scale: [number, number, number] = [1, 1, 1],
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    origin: IMercator = { x: 0, y: 0, z: 0 },
  ): number[] {
    throw new Error('Method not implemented.');
  }
}
