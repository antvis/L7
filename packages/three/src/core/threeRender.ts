import { Scene } from '@antv/l7';
import {
  AnimationMixer,
  Camera,
  Matrix4,
  PCFSoftShadowMap,
  PerspectiveCamera,
  Scene as ThreeScene,
  WebGLRenderer,
} from 'three';
import {
  IThreeRenderService,
  ThreeRenderService,
  ThreeRenderServiceType,
} from './threeRenderService';

export default class ThreeRender {
  private threeRenderService: IThreeRenderService;
  constructor(scene: Scene) {
    const sceneContainer = scene.getServiceContainer();
    sceneContainer
      .bind<IThreeRenderService>(ThreeRenderServiceType)
      .to(ThreeRenderService)
      .inSingletonScope();

    this.threeRenderService = sceneContainer.get<IThreeRenderService>(
      ThreeRenderServiceType,
    );
  }
  public init() {
    this.threeRenderService.init();
  }
}
