import 'reflect-metadata';

import { EventEmitter } from 'eventemitter3';
import { Container, decorate, injectable, interfaces } from 'inversify';
import getDecorators from 'inversify-inject-decorators';
import { TYPES } from './types';

/** Service interfaces */
import { IFontService } from './services/asset/IFontService';
import { IIconService } from './services/asset/IIconService';
import { ICameraService } from './services/camera/ICameraService';
import { IControlService } from './services/component/IControlService';
import { IGlobalConfigService } from './services/config/IConfigService';
import { ICoordinateSystemService } from './services/coordinate/ICoordinateSystemService';
import { IInteractionService } from './services/interaction/IInteractionService';
import { ILayerService } from './services/layer/ILayerService';
import { ILogService } from './services/log/ILogService';
import { IShaderModuleService } from './services/shader/IShaderModuleService';

/** Service implements */
import FontService from './services/asset/FontService';
import IconService from './services/asset/IconService';
import CameraService from './services/camera/CameraService';
import ControlService from './services/component/ControlService';
import GlobalConfigService from './services/config/ConfigService';
import CoordinateSystemService from './services/coordinate/CoordinateSystemService';
import InteractionService from './services/interaction/InteractionService';
import LayerService from './services/layer/LayerService';
import LayerStyleService from './services/layer/LayerStyleService';
import LogService from './services/log/LogService';
import ShaderModuleService from './services/shader/ShaderModuleService';
// @see https://github.com/inversify/InversifyJS/blob/master/wiki/container_api.md#defaultscope
const container = new Container();

/**
 * bind services
 */
container
  .bind<IGlobalConfigService>(TYPES.IGlobalConfigService)
  .to(GlobalConfigService)
  .inSingletonScope();
container
  .bind<ILayerService>(TYPES.ILayerService)
  .to(LayerService)
  .inSingletonScope();
container
  .bind<ICameraService>(TYPES.ICameraService)
  .to(CameraService)
  .inSingletonScope();
container
  .bind<ICoordinateSystemService>(TYPES.ICoordinateSystemService)
  .to(CoordinateSystemService)
  .inSingletonScope();
container
  .bind<IIconService>(TYPES.IIconService)
  .to(IconService)
  .inSingletonScope();
container
  .bind<IShaderModuleService>(TYPES.IShaderModuleService)
  .to(ShaderModuleService)
  .inSingletonScope();
container
  .bind<ILogService>(TYPES.ILogService)
  .to(LogService)
  .inSingletonScope();
container
  .bind<IInteractionService>(TYPES.IInteractionService)
  .to(InteractionService)
  .inSingletonScope();
container
  .bind<IFontService>(TYPES.IFontService)
  .to(FontService)
  .inSingletonScope();
container
  .bind<IControlService>(TYPES.IControlService)
  .to(ControlService)
  .inSingletonScope();

// @see https://github.com/inversify/InversifyJS/blob/master/wiki/inheritance.md#what-can-i-do-when-my-base-class-is-provided-by-a-third-party-module
decorate(injectable(), EventEmitter);

// 支持 L7 使用 new 而非容器实例化的场景
// @see https://github.com/inversify/inversify-inject-decorators
const DECORATORS = getDecorators(container);

interface IBabelPropertyDescriptor extends PropertyDescriptor {
  initializer(): any;
}
// Add babel legacy decorators support
// @see https://github.com/inversify/InversifyJS/issues/1050
// @see https://github.com/inversify/InversifyJS/issues/1026#issuecomment-504936034
export const lazyInject = (
  serviceIdentifier: interfaces.ServiceIdentifier<any>,
) => {
  const original = DECORATORS.lazyInject(serviceIdentifier);
  // the 'descriptor' parameter is actually always defined for class fields for Babel, but is considered undefined for TSC
  // so we just hack it with ?/! combination to avoid "TS1240: Unable to resolve signature of property decorator when called as an expression"
  return function(
    this: any,
    proto: any,
    key: string,
    descriptor?: IBabelPropertyDescriptor,
  ): void {
    // make it work as usual
    original.call(this, proto, key);
    // return link to proto, so own value wont be 'undefined' after component's creation
    descriptor!.initializer = () => {
      return proto[key];
    };
  };
};

export default container;
