import { BaseLayer, ILayer, IMercator } from '@antv/l7';
import {
  AnimationMixer,
  Camera,
  Matrix4,
  PCFSoftShadowMap,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
  Object3D
} from 'three';
import {
  IThreeRenderService,
  ThreeRenderServiceType,
} from './threeRenderService';
import { IThreeJSLayer, ILngLat } from './IThreeJSLayer'
const DEG2RAD = Math.PI / 180;
export default class ThreeJSLayer
  extends BaseLayer<{
    onAddMeshes: (threeScene: Scene, layer: ThreeJSLayer) => void;
  }>
  implements IThreeJSLayer {
  public type: string = 'custom';
  protected threeRenderService: IThreeRenderService;
  // 构建 threejs 的 scene
  private scene: Scene = new Scene();
  private renderer: WebGLRenderer;
  private animateMixer: AnimationMixer[] = [];
  // 地图中点墨卡托坐标
  private center: IMercator;


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
  public getTranslateMatrix( lnglat: ILngLat, altitude: number = 0,) {
    return this.getModelMatrix( lnglat, altitude, [0, 0, 0], [1, 1, 1] )
  }

  /**
   * 设置当前物体往经纬度和高度方向的移动
   * @param object 
   * @param lnglat 
   * @param altitude 
   */
  public applyObjectLngLat(object: Object3D, lnglat: ILngLat, altitude = 0) {
    let positionMatrix = this.getTranslateMatrix(lnglat, altitude)
    object.applyMatrix4(positionMatrix)
  }

  /**
   * 设置物体当前的经纬度和高度
   * @param object 
   * @param lnglat 
   * @param altitude 
   */
  public setObjectLngLat(object: Object3D, lnglat: ILngLat, altitude = 0) {
    // @ts-ignore
    let [x, y] = this.mapService?.lngLatToCoord(lnglat)
    // @ts-ignore
    // console.log(this.mapService?.lngLatToCoord(lnglat))
    // if(x && y) {
      // console.log('------')
      object.position.set(x, y, altitude)
    // }
  }

  public getObjectLngLat(object: Object3D) {
    //   let coord = [object.position.x, object.position.y];
    //   // @ts-ignore
    //  return this.mapService.coordToLngLat(coord);
    return [0,0] as ILngLat
  }

  public buildModels() {
    // @ts-ignore
    this.threeRenderService = this.getContainer().get<IThreeRenderService>(
      ThreeRenderServiceType,
    );
    const config = this.getLayerConfig();
    if (config && config.onAddMeshes) {
      config.onAddMeshes(this.scene, this);
    }
  }
  public renderModels() {
    // 获取到 L7 的 gl
    const gl = this.rendererService.getGLContext();
    this.rendererService.setCustomLayerDefaults();
    const cullFace =
      this.mapService.constructor.name === 'AMapService' ? gl.BACK : gl.FRONT;
    gl.cullFace(cullFace);

    // threejs 的 renderer
    const renderer = this.threeRenderService.renderer;
    renderer.state.reset();
    renderer.autoClear = false;

    // 获取相机 （不同的地图获取对应的方式不同）
    const camera = this.threeRenderService.getRenderCamera();

    renderer.render(this.scene, camera);

    this.rendererService.setBaseState();
    this.animateMixer.forEach((mixer: AnimationMixer) => {
      mixer.update(this.getTime());
    });
    this.rendererService.setBaseState();
    this.rendererService.setDirty(true);
    return this;
  }

  public renderAMapModels() {
    const gl = this.rendererService.getGLContext();
    // gl.frontFace(gl.CCW);
    // gl.enable(gl.CULL_FACE);
    // gl.cullFace(gl.BACK);
    this.rendererService.setCustomLayerDefaults();
    const renderer = this.threeRenderService.renderer;
    renderer.state.reset();
    renderer.autoClear = false;
    renderer.render(this.scene, this.threeRenderService.getRenderCamera());
    this.animateMixer.forEach((mixer: AnimationMixer) => {
      mixer.update(this.getTime());
    });
    this.rendererService.setBaseState();
    this.rendererService.setDirty(true);
    return this;
  }

  public addAnimateMixer(mixer: AnimationMixer) {
    this.animateMixer.push(mixer);
  }
}
