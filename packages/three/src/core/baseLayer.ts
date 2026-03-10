import type { ILayer, IMercator, ISourceCFG } from '@antv/l7';
import { BaseLayer } from '@antv/l7';
import type { AnimationMixer, Object3D, WebGLRenderer } from 'three';
import { Matrix4, Scene, Vector3 } from 'three';
import type { IThreeRenderService } from './threeRenderService';

type ILngLat = [number, number];
export default class ThreeJSLayer
  extends BaseLayer<{
    onAddMeshes: (threeScene: Scene, layer: ThreeJSLayer) => void;
  }>
  implements ILayer
{
  public type: string = 'custom';
  public threeRenderService: IThreeRenderService;
  public isUpdate: boolean = false;
  public update: (() => void) | null = null;
  // 构建 threejs 的 scene
  private scene: Scene = new Scene();
  private renderer: WebGLRenderer;
  private animateMixer: AnimationMixer[] = [];
  // 地图中点墨卡托坐标
  private center: IMercator;
  public defaultSourceConfig: {
    data: any;
    options: ISourceCFG | undefined;
  } = {
    data: {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'Point',
            coordinates: [0, 0],
          },
        },
      ],
    },
    options: {
      parser: {
        type: 'geojson',
      },
    },
  };
  public forceRender: boolean = true;

  public setUpdate(callback: () => void) {
    this.update = callback;
    this.isUpdate = true;
  }

  /**
   * 根据数据计算对应地图的模型矩阵 不同地图主要是点位偏移不同
   */
  public getModelMatrix(
    lnglat: [number, number],
    altitude: number = 0,
    rotation: [number, number, number] = [0, 0, 0],
    scale: [number, number, number] = [1, 1, 1],
  ): Matrix4 {
    return new Matrix4().fromArray(
      this.mapService.getModelMatrix(
        lnglat,
        altitude,
        rotation,
        scale,
        this.threeRenderService.center,
      ),
    );
  }

  /**
   * 获取平移矩阵
   * @param lnglat
   * @param altitude
   * @returns
   */
  public getTranslateMatrix(lnglat: ILngLat, altitude: number = 0) {
    return this.getModelMatrix(lnglat, altitude, [0, 0, 0], [1, 1, 1]);
  }

  /**
   * 设置当前物体往经纬度和高度方向的移动
   *
   * - 默认/Mapbox 地图：通过 getModelMatrix 将 mercator 坐标转为相对场景中心的偏移并做单位换算
   * - 高德地图：直接设置 amap2Project 绝对坐标（与 AMapCamera setCenter([0,0]) 坐标系一致）
   *
   * @param object
   * @param lnglat
   * @param altitude
   */
  public applyObjectLngLat(object: Object3D, lnglat: ILngLat, altitude = 0) {
    if (this.mapService.getType() === 'amap') {
      // 高德地图 camera 使用 customCoords.setCenter([0,0])，坐标系 = amap2Project 绝对 Web Mercator
      // 与 setObjectLngLat 逻辑一致，直接设置绝对坐标
      this.setObjectLngLat(object, lnglat, altitude);
    } else {
      // 默认/Mapbox：通过 applyMatrix4 正确处理 mercator 单位换算和中心偏移
      const positionMatrix = this.getTranslateMatrix(lnglat, altitude);
      object.applyMatrix4(positionMatrix);
    }
  }

  /**
   * 设置物体当前的经纬度和高度
   * @param object
   * @param lnglat
   * @param altitude
   */
  public setObjectLngLat(object: Object3D, lnglat: ILngLat, altitude = 0) {
    // @ts-ignore
    const [x, y] = this.lnglatToCoord(lnglat);
    object.position.set(x, y, altitude);
  }

  /**
   * 将经纬度+高度转为 Three.js BufferGeometry 顶点坐标
   *
   * 用于手动管理顶点位置（如 BufferGeometry）时统一处理不同地图的坐标系：
   * - 默认/Mapbox 地图：返回相对于场景中心的 mercator 偏移坐标
   * - 高德地图：返回绝对 Web Mercator 坐标（与 AMapCamera setCenter([0,0]) 一致）
   *
   * @param lnglat 经纬度
   * @param altitude 高度（米）
   * @returns Three.js 世界坐标 [x, y, z]
   */
  public lnglatToThreePosition(lnglat: ILngLat, altitude = 0): [number, number, number] {
    const result = this.mapService.lngLatToMercator(lnglat, altitude);
    if (this.mapService.getType() === 'amap') {
      return [result.x, result.y, altitude];
    }
    const center = this.threeRenderService.center;
    return [result.x - center.x, result.y - center.y, (result.z ?? 0) - (center.z ?? 0)];
  }

  /**
   * 将经纬度转为 three 世界坐标
   * @param lnglat
   * @returns
   */
  public lnglatToCoord(lnglat: ILngLat): [number, number] {
    try {
      const result = this.mapService.lngLatToMercator(lnglat, 0);
      const x = result?.x ?? NaN;
      const y = result?.y ?? NaN;
      return [x, y];
    } catch (e) {
      console.warn('[L7-Three] lnglatToCoord error:', e);
      return [NaN, NaN];
    }
  }

  /**
   * 获取
   * @param object
   * @returns
   */
   
  public getObjectLngLat(object: Object3D) {
    return [0, 0] as ILngLat;
  }

  /**
   * 设置网格适配到地图坐标系
   * @param object
   */
  public adjustMeshToMap(object: Object3D) {
    object.up = new Vector3(0, 0, 1);
    const defaultLngLat = this.mapService.getCenter();
    const modelMatrix = this.getModelMatrix(
      [defaultLngLat.lng, defaultLngLat.lat], // 经纬度坐标
      0, // 高度，单位米/
      [Math.PI / 2, -Math.PI, 0], // 沿 XYZ 轴旋转角度
      [1, 1, 1], // 沿 XYZ 轴缩放比例
    );
    object.applyMatrix4(modelMatrix);
  }

  /**
   * 设置网格的缩放 （主要是抹平 mapbox 底图时的差异，若是高德底图则可以直接设置网格的 scale 属性/方法）
   * @param object
   * @param x
   * @param y
   * @param z
   */
  public setMeshScale(object: Object3D, x: number = 1, y: number = 1, z: number = 1) {
    const scaleMatrix = new Matrix4();
    scaleMatrix.scale(new Vector3(x, y, z));
    object.applyMatrix4(scaleMatrix);
  }

  public async buildModels() {
    // @ts-ignore
    this.threeRenderService = this.container.customRenderService['three'];
    const config = this.getLayerConfig();
    if (config && config.onAddMeshes) {
      await config.onAddMeshes(this.scene, this);
    }
  }
  public renderModels() {
    if (!this.threeRenderService) {
      return this;
    }
    if (this.isUpdate && this.update) {
      this.update();
    }
    // 获取到 L7 的 gl
    const gl = this.rendererService.getGLContext();
    this.rendererService.setCustomLayerDefaults();
    const cullFace = this.mapService.version?.indexOf('GAODE') !== -1 ? gl.BACK : gl.FRONT;
    gl.cullFace(cullFace);

    // threejs 的 renderer
    const renderer = this.threeRenderService.renderer;
    // resetState() 是 Three.js r163+ 的公开稳定 API，清除 Three.js 内部状态缓存以与共享的 WebGL 上下文同步
    renderer.resetState();
    renderer.autoClear = false;

    // 获取相机 （不同的地图获取对应的方式不同）
    const camera = this.threeRenderService.getRenderCamera();
    renderer.render(this.scene, camera);

    this.rendererService.setState();
    this.animateMixer.forEach((mixer: AnimationMixer) => {
      mixer.update(this.getTime());
    });

    this.rendererService.setState();
    this.rendererService.setDirty(true);
    return this;
  }

  public renderAMapModels() {
    // gl.frontFace(gl.CCW);
    // gl.enable(gl.CULL_FACE);
    // gl.cullFace(gl.BACK);
    this.rendererService.setCustomLayerDefaults();
    const renderer = this.threeRenderService.renderer;
    renderer.resetState();
    renderer.autoClear = false;
    renderer.render(this.scene, this.threeRenderService.getRenderCamera());
    this.animateMixer.forEach((mixer: AnimationMixer) => {
      mixer.update(this.getTime());
    });
    this.rendererService.setBaseState();
    this.rendererService.setDirty(true);
    return this;
  }

  public getRenderCamera() {
    return this.threeRenderService.getRenderCamera();
  }

  public addAnimateMixer(mixer: AnimationMixer) {
    this.animateMixer.push(mixer);
  }
}
