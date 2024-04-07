import type { Scene } from '@antv/l7';
import type { IThreeRenderService } from './threeRenderService';
import { ThreeRenderService } from './threeRenderService';

export default class ThreeRender {
  public threeRenderService: IThreeRenderService;
  constructor(scene: Scene) {
    const sceneContainer = scene.getServiceContainer();
    this.threeRenderService = new ThreeRenderService(
      sceneContainer.rendererService,
      sceneContainer.mapService,
    );
    sceneContainer.customRenderService['three'] = this.threeRenderService;
  }
  public init() {
    this.threeRenderService.init();
  }
}
