import { Scene } from '@antv/l7-scene';
import {
  IThreeRenderService,
  ThreeRenderService,
  ThreeRenderServiceType,
} from './threeRenderService';

export default class ThreeRender {
  public threeRenderService: IThreeRenderService;
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
