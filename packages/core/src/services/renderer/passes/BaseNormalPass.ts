import type { ICameraService } from '../../camera/ICameraService';
import type { IInteractionService } from '../../interaction/IInteractionService';
import type { ILayer, ILayerService } from '../../layer/ILayerService';
import type { IMapService } from '../../map/IMapService';
import type { IShaderModuleService } from '../../shader/IShaderModuleService';
import type { IPass } from '../IMultiPassRenderer';
import { PassType } from '../IMultiPassRenderer';
import type { IRendererService } from '../IRendererService';

/**
 * 常规 Pass 基类
 */
export default class BaseNormalPass<InitializationOptions = {}>
  implements IPass<InitializationOptions>
{
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
    this.rendererService = layer.getContainer().rendererService;
    this.cameraService = layer.getContainer().cameraService;
    this.mapService = layer.getContainer().mapService;
    this.interactionService = layer.getContainer().interactionService;
    this.layerService = layer.getContainer().layerService;
    this.shaderModuleService = layer.getContainer().shaderModuleService;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public render(layer: ILayer) {
    //
  }
}
