import { inject, injectable } from 'inversify';
import { IRendererService, IShaderModuleService } from '../../../index';
import { TYPES } from '../../../types';
import { ICameraService } from '../../camera/ICameraService';
import { IInteractionService } from '../../interaction/IInteractionService';
import { ILayer, ILayerService } from '../../layer/ILayerService';
import { IPass, PassType } from '../IMultiPassRenderer';

/**
 * 常规 Pass 基类
 */
@injectable()
export default class BaseNormalPass<InitializationOptions = {}>
  implements IPass<InitializationOptions> {
  @inject(TYPES.IShaderModuleService)
  protected readonly shaderModuleService: IShaderModuleService;

  protected rendererService: IRendererService;
  protected cameraService: ICameraService;
  protected interactionService: IInteractionService;
  protected layerService: ILayerService;

  protected config: Partial<InitializationOptions> | undefined;

  public getName() {
    return '';
  }

  public getType() {
    return PassType.Normal;
  }

  public init(layer: ILayer, config?: Partial<InitializationOptions>) {
    this.config = config;
    this.rendererService = layer
      .getContainer()
      .get<IRendererService>(TYPES.IRendererService);
    this.cameraService = layer
      .getContainer()
      .get<ICameraService>(TYPES.ICameraService);
    this.interactionService = layer
      .getContainer()
      .get<IInteractionService>(TYPES.IInteractionService);
    this.layerService = layer
      .getContainer()
      .get<ILayerService>(TYPES.ILayerService);
  }

  public render(layer: ILayer) {
    //
  }
}
