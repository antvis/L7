import { BaseLayer, ILayer, IMercator } from '@antv/l7';
import {
  AnimationMixer,
  Camera,
  Matrix4,
  PCFSoftShadowMap,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
} from 'three';
import {
  IThreeRenderService,
  ThreeRenderServiceType,
} from './threeRenderService';
const DEG2RAD = Math.PI / 180;
interface IThreeJSLayer extends ILayer {
  getModelMatrix(
    lnglat: [number, number],
    altitude: number,
    rotation: [number, number, number],
    scale: [number, number, number],
  ): Matrix4;
  addAnimateMixer(mixer: AnimationMixer): void;
}
export default class ThreeJSLayer
  extends BaseLayer<{
    onAddMeshes: (threeScene: Scene, layer: ThreeJSLayer) => void;
  }>
  implements IThreeJSLayer {
  public type: string = 'custom';
  protected threeRenderService: IThreeRenderService;
  private scene: Scene = new Scene();
  private renderer: WebGLRenderer;
  private animateMixer: AnimationMixer[] = [];
  // 地图中点墨卡托坐标
  private center: IMercator;

  // 初始状态相机变换矩阵

  /**
   * 根据模型
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

  public buildModels() {
    this.threeRenderService = this.getContainer().get<IThreeRenderService>(
      ThreeRenderServiceType,
    );
    const config = this.getLayerConfig();
    if (config && config.onAddMeshes) {
      config.onAddMeshes(this.scene, this);
    }
  }
  public renderModels() {
    const gl = this.rendererService.getGLContext();
    this.rendererService.setCustomLayerDefaults();
    const cullFace =
      this.mapService.constructor.name === 'AMapService' ? gl.BACK : gl.FRONT;
    gl.cullFace(cullFace);
    const renderer = this.threeRenderService.renderer;
    renderer.state.reset();
    renderer.autoClear = false;
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
