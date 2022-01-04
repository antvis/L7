import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { TYPES } from '../../../types';
import { ICameraService } from '../../camera/ICameraService';
import { IInteractionService } from '../../interaction/IInteractionService';
import { ILayer, ILayerService } from '../../layer/ILayerService';
import { IMapService } from '../../map/IMapService';
import { IShaderModuleService } from '../../shader/IShaderModuleService';
import { IPass, PassType } from '../IMultiPassRenderer';
import { IRendererService } from '../IRendererService';

/**
 * 常规 Pass 基类
 */
@injectable()
export default class BaseNormalPass<InitializationOptions = {}>
  implements IPass<InitializationOptions> {
  // @inject(TYPES.IShaderModuleService)
  protected shaderModuleService: IShaderModuleService;

  protected rendererService: IRendererService;
  protected cameraService: ICameraService;
  protected mapService: IMapService;
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
    this.mapService = layer.getContainer().get<IMapService>(TYPES.IMapService);
    this.interactionService = layer
      .getContainer()
      .get<IInteractionService>(TYPES.IInteractionService);
    this.layerService = layer
      .getContainer()
      .get<ILayerService>(TYPES.ILayerService);
    this.shaderModuleService = layer
      .getContainer()
      .get<IShaderModuleService>(TYPES.IShaderModuleService);
  }

  public render(layer: ILayer) {
    //
  }
}
