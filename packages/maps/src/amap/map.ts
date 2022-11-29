/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * AMapService
 */
import {
  CoordinateSystem,
  IMapCamera,
  IMapService,
  IViewport,
} from '@antv/l7-core';
import { mat4, vec3 } from 'gl-matrix';
import { injectable } from 'inversify';
import 'reflect-metadata';
import { IAMapEvent, IAMapInstance } from '../../typings/index';
import AMapBaseService from '../utils/amap/AMapBaseService';
import AMapLoader from '../utils/amaploader';
import { Version } from '../version';
import Viewport from './Viewport';
// @ts-ignore
window.forceWebGL = true;

const AMAP_API_KEY: string = '15cd8a57710d40c9b7c0e3cc120f1200';
const AMAP_VERSION: string = '1.4.15';

/**
 * 高德地图脚本是否加载完毕
 */
let amapLoaded = false;
/**
 * 高德地图脚本加载成功等待队列，成功之后依次触发
 */
let pendingResolveQueue: Array<() => void> = [];
const LNGLAT_OFFSET_ZOOM_THRESHOLD = 12; // 暂时关闭 fix 统一不同坐标系，不同底图的高度位置

/**
 * AMapService
 */
@injectable()
export default class AMapService
  extends AMapBaseService
  implements IMapService<AMap.Map & IAMapInstance>
{
  public version: string = Version['GAODE1.x'];
  protected viewport: IViewport;

  public getModelMatrix(
    lnglat: [number, number],
    altitude: number,
    rotate: [number, number, number],
    scale: [number, number, number] = [1, 1, 1],
  ): number[] {
    const flat = this.viewport.projectFlat(lnglat);
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
      maxZoom = 18,
      token = AMAP_API_KEY,
      mapInstance,
      plugin = [],
      ...rest
    } = this.config;
    // 高德地图创建独立的container；
    // tslint:disable-next-line:typedef
    await new Promise<void>((resolve) => {
      const resolveMap = () => {
        if (mapInstance) {
          this.map = mapInstance as AMap.Map & IAMapInstance;
          this.$mapContainer = this.map.getContainer();
          setTimeout(() => {
            this.map.on('camerachange', this.handleCameraChanged);
            resolve();
          }, 30);
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
          // @ts-ignore
          const map = new AMap.Map(this.$mapContainer, mapConstructorOptions);
          // 监听地图相机事件
          map.on('camerachange', this.handleCameraChanged);
          // Tip: 为了兼容开启 MultiPassRender 的情况
          // 修复 MultiPassRender 在高德地图 1.x 的情况下，缩放地图改变 zoom 时存在可视化层和底图不同步的现象
          map.on('camerachange', () => {
            setTimeout(() => this.handleAfterMapChange());
          });

          // @ts-ignore
          this.map = map;
          setTimeout(() => {
            resolve();
          }, 10);
        }
      };
      if (!amapLoaded && !mapInstance) {
        if (token === AMAP_API_KEY) {
          console.warn(this.configService.getSceneWarninfo('MapToken'));
        }
        amapLoaded = true;
        plugin.push('Map3D');
        AMapLoader.load({
          key: token, // 申请好的Web端开发者Key，首次调用 load 时必填
          version: AMAP_VERSION, // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
          plugins: plugin, // 需要使用的的插件列表，如比例尺'AMap.Scale'等
        })
          .then((AMap) => {
            resolveMap();

            if (pendingResolveQueue.length) {
              pendingResolveQueue.forEach((r) => r());
              pendingResolveQueue = [];
            }
          })
          .catch((e) => {
            throw new Error(e);
          });
      } else {
        if ((amapLoaded && window.AMap) || mapInstance) {
          resolveMap();
        } else {
          pendingResolveQueue.push(resolveMap);
        }
      }
    });

    this.viewport = new Viewport();
  }

  public meterToCoord(center: [number, number], outer: [number, number]) {
    // 统一根据经纬度来转化
    // Tip: 实际米距离 unit meter
    const meterDis = AMap.GeometryUtil.distance(
      new AMap.LngLat(...center),
      new AMap.LngLat(...outer),
    );

    // Tip: 三维世界坐标距离
    const [x1, y1] = this.lngLatToCoord(center);
    const [x2, y2] = this.lngLatToCoord(outer);
    const coordDis = Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));

    return coordDis / meterDis;
  }

  // tslint:disable-next-line:no-empty
  public updateView(viewOption: Partial<IMapCamera>): void {}

  public getOverlayContainer(): HTMLElement | undefined {
    return undefined;
  }

  public exportMap(type: 'jpg' | 'png'): string {
    const renderCanvas = this.getContainer()?.getElementsByClassName(
      'amap-layer',
    )[0] as HTMLCanvasElement;
    const layersPng =
      type === 'jpg'
        ? (renderCanvas?.toDataURL('image/jpeg') as string)
        : (renderCanvas?.toDataURL('image/png') as string);
    return layersPng;
  }

  public onCameraChanged(callback: (viewport: IViewport) => void): void {
    this.cameraChangedCallback = callback;
  }

  protected handleCameraChanged = (e: IAMapEvent): void => {
    const { fov, near, far, height, pitch, rotation, aspect, position } =
      e.camera;
    const { lng, lat } = this.getCenter();
    // Tip: 触发地图变化事件
    this.emit('mapchange');

    if (this.cameraChangedCallback) {
      this.viewport.syncWithMapCamera({
        aspect,
        // AMap 定义 rotation 为顺时针方向，而 Mapbox 为逆时针
        // @see https://docs.mapbox.com/mapbox-gl-js/api/#map#getbearing
        bearing: 360 - rotation,
        far,
        fov,
        cameraHeight: height,
        near,
        pitch,
        // AMap 定义的缩放等级 与 Mapbox 相差 1
        zoom: this.map.getZoom() - 1,
        center: [lng, lat],
        offsetOrigin: [position.x, position.y],
      });
      const { offsetZoom = LNGLAT_OFFSET_ZOOM_THRESHOLD } = this.config;
      // console.log('this.viewport', this.viewport)
      // set coordinate system
      if (this.viewport.getZoom() > offsetZoom) {
        this.coordinateSystemService.setCoordinateSystem(
          CoordinateSystem.P20_OFFSET,
        );
      } else {
        this.coordinateSystemService.setCoordinateSystem(CoordinateSystem.P20);
      }
      this.cameraChangedCallback(this.viewport);
    }
  };
}
