/**
 * Root Container
 * @see /dev-docs/IoC 容器、依赖注入与服务说明.md
 */
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
import { IDebugService } from './services/debug/IDebugService';
import { IInteractionService } from './services/interaction/IInteractionService';
import { IPickingService } from './services/interaction/IPickingService';
import { ILayerService } from './services/layer/ILayerService';
import { IStyleAttributeService } from './services/layer/IStyleAttributeService';
import { ISceneService } from './services/scene/ISceneService';
import { IShaderModuleService } from './services/shader/IShaderModuleService';

/** Service implements */
import FontService from './services/asset/FontService';
import IconService from './services/asset/IconService';
import CameraService from './services/camera/CameraService';
import ControlService from './services/component/ControlService';
import MarkerService from './services/component/MarkerService';
import PopupService from './services/component/PopupService';
import GlobalConfigService from './services/config/ConfigService';
import CoordinateSystemService from './services/coordinate/CoordinateSystemService';
import DebugService from './services/debug/DebugService';
import InteractionService from './services/interaction/InteractionService';
import PickingService from './services/interaction/PickingService';
import LayerService from './services/layer/LayerService';
import StyleAttributeService from './services/layer/StyleAttributeService';
import SceneService from './services/scene/SceneService';
import ShaderModuleService from './services/shader/ShaderModuleService';

/** PostProcessing passes */
import { IMarkerService } from './services/component/IMarkerService';
import { IPopupService } from './services/component/IPopupService';
import {
  IMultiPassRenderer,
  IPass,
  IPostProcessingPass,
  IPostProcessor,
} from './services/renderer/IMultiPassRenderer';
import ClearPass from './services/renderer/passes/ClearPass';
import MultiPassRenderer from './services/renderer/passes/MultiPassRenderer';
import PixelPickingPass from './services/renderer/passes/PixelPickingPass';
import BloomPass from './services/renderer/passes/post-processing/BloomPass';
import BlurHPass from './services/renderer/passes/post-processing/BlurHPass';
import BlurVPass from './services/renderer/passes/post-processing/BlurVPass';
import ColorHalfTonePass from './services/renderer/passes/post-processing/ColorHalfTonePass';
import CopyPass from './services/renderer/passes/post-processing/CopyPass';
import HexagonalPixelatePass from './services/renderer/passes/post-processing/HexagonalPixelatePass';
import InkPass from './services/renderer/passes/post-processing/InkPass';
import NoisePass from './services/renderer/passes/post-processing/NoisePass';
import SepiaPass from './services/renderer/passes/post-processing/SepiaPass';
import PostProcessor from './services/renderer/passes/PostProcessor';
import RenderPass from './services/renderer/passes/RenderPass';
import TAAPass from './services/renderer/passes/TAAPass';

// @see https://github.com/inversify/InversifyJS/blob/master/wiki/container_api.md#defaultscope
const container = new Container();

/**
 * bind global services in root container
 */
container
  .bind<IGlobalConfigService>(TYPES.IGlobalConfigService)
  .to(GlobalConfigService)
  .inSingletonScope();
// @see https://github.com/inversify/InversifyJS/blob/master/wiki/inheritance.md#what-can-i-do-when-my-base-class-is-provided-by-a-third-party-module
decorate(injectable(), EventEmitter);
container.bind(TYPES.IEventEmitter).to(EventEmitter);
// 支持 L7 使用 new 而非容器实例化的场景，同时禁止 lazyInject cache
// @see https://github.com/inversify/inversify-inject-decorators#caching-vs-non-caching-behaviour
const DECORATORS = getDecorators(container, false);

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
  return function (
    this: any,
    proto: any,
    key: string,
    descriptor?: IBabelPropertyDescriptor,
  ): void {
    // make it work as usual
    original.call(this, proto, key);
    // return link to proto, so own value wont be 'undefined' after component's creation
    if (descriptor) {
      descriptor.initializer = () => {
        return proto[key];
      };
    }
  };
};
export const lazyMultiInject = (
  serviceIdentifier: interfaces.ServiceIdentifier<any>,
) => {
  const original = DECORATORS.lazyMultiInject(serviceIdentifier);
  // the 'descriptor' parameter is actually always defined for class fields for Babel, but is considered undefined for TSC
  // so we just hack it with ?/! combination to avoid "TS1240: Unable to resolve signature of property decorator when called as an expression"
  return function (
    this: any,
    proto: any,
    key: string,
    descriptor?: IBabelPropertyDescriptor,
  ): void {
    // make it work as usual
    original.call(this, proto, key);
    if (descriptor) {
      // return link to proto, so own value wont be 'undefined' after component's creation
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      descriptor!.initializer = () => {
        return proto[key];
      };
    }
  };
};

export default container;

let sceneIdCounter = 0;
export function createSceneContainer() {
  // @see https://github.com/inversify/InversifyJS/blob/master/wiki/hierarchical_di.md#support-for-hierarchical-di-systems
  const sceneContainer = new Container();
  sceneContainer.parent = container;

  // 生成场景 ID 并保存在容器内
  sceneContainer
    .bind<string>(TYPES.SceneID)
    .toConstantValue(`${sceneIdCounter++}`);
  sceneContainer
    .bind<IShaderModuleService>(TYPES.IShaderModuleService)
    .to(ShaderModuleService)
    .inSingletonScope();
  sceneContainer
    .bind<ILayerService>(TYPES.ILayerService)
    .to(LayerService)
    .inSingletonScope();
  sceneContainer
    .bind<IDebugService>(TYPES.IDebugService)
    .to(DebugService)
    .inSingletonScope();
  sceneContainer
    .bind<ISceneService>(TYPES.ISceneService)
    .to(SceneService)
    .inSingletonScope();
  sceneContainer
    .bind<ICameraService>(TYPES.ICameraService)
    .to(CameraService)
    .inSingletonScope();
  sceneContainer
    .bind<ICoordinateSystemService>(TYPES.ICoordinateSystemService)
    .to(CoordinateSystemService)
    .inSingletonScope();
  sceneContainer
    .bind<IInteractionService>(TYPES.IInteractionService)
    .to(InteractionService)
    .inSingletonScope();
  sceneContainer
    .bind<IPickingService>(TYPES.IPickingService)
    .to(PickingService)
    .inSingletonScope();
  sceneContainer
    .bind<IControlService>(TYPES.IControlService)
    .to(ControlService)
    .inSingletonScope();
  sceneContainer
    .bind<IMarkerService>(TYPES.IMarkerService)
    .to(MarkerService)
    .inSingletonScope();
  sceneContainer
    .bind<IIconService>(TYPES.IIconService)
    .to(IconService)
    .inSingletonScope();
  sceneContainer
    .bind<IFontService>(TYPES.IFontService)
    .to(FontService)
    .inSingletonScope();

  sceneContainer
    .bind<IPopupService>(TYPES.IPopupService)
    .to(PopupService)
    .inSingletonScope();

  // 绑定常规 passes
  sceneContainer
    .bind<IPass<unknown>>(TYPES.INormalPass)
    .to(ClearPass)
    .whenTargetNamed('clear');
  sceneContainer
    .bind<IPass<unknown>>(TYPES.INormalPass)
    .to(PixelPickingPass)
    .whenTargetNamed('pixelPicking');
  sceneContainer
    .bind<IPass<unknown>>(TYPES.INormalPass)
    .to(RenderPass)
    .whenTargetNamed('render');
  sceneContainer
    .bind<IPass<unknown>>(TYPES.INormalPass)
    .to(TAAPass)
    .whenTargetNamed('taa');
  sceneContainer
    .bind<interfaces.Factory<IPass<unknown>>>(TYPES.IFactoryNormalPass)
    .toFactory<IPass<unknown>>(
      (context) => (named: string) =>
        context.container.getNamed<IPass<unknown>>(TYPES.INormalPass, named),
    );

  // 绑定 post processing passes
  sceneContainer
    .bind<IPostProcessingPass<unknown>>(TYPES.IPostProcessingPass)
    .to(CopyPass)
    .whenTargetNamed('copy');
  sceneContainer
    .bind<IPostProcessingPass<unknown>>(TYPES.IPostProcessingPass)
    .to(BloomPass)
    .whenTargetNamed('bloom');
  sceneContainer
    .bind<IPostProcessingPass<unknown>>(TYPES.IPostProcessingPass)
    .to(BlurHPass)
    .whenTargetNamed('blurH');
  sceneContainer
    .bind<IPostProcessingPass<unknown>>(TYPES.IPostProcessingPass)
    .to(BlurVPass)
    .whenTargetNamed('blurV');
  sceneContainer
    .bind<IPostProcessingPass<unknown>>(TYPES.IPostProcessingPass)
    .to(NoisePass)
    .whenTargetNamed('noise');
  sceneContainer
    .bind<IPostProcessingPass<unknown>>(TYPES.IPostProcessingPass)
    .to(SepiaPass)
    .whenTargetNamed('sepia');
  sceneContainer
    .bind<IPostProcessingPass<unknown>>(TYPES.IPostProcessingPass)
    .to(ColorHalfTonePass)
    .whenTargetNamed('colorHalftone');
  sceneContainer
    .bind<IPostProcessingPass<unknown>>(TYPES.IPostProcessingPass)
    .to(HexagonalPixelatePass)
    .whenTargetNamed('hexagonalPixelate');
  sceneContainer
    .bind<IPostProcessingPass<unknown>>(TYPES.IPostProcessingPass)
    .to(InkPass)
    .whenTargetNamed('ink');

  // 绑定工厂方法
  sceneContainer
    .bind<interfaces.Factory<IPostProcessingPass<unknown>>>(
      TYPES.IFactoryPostProcessingPass,
    )
    .toFactory<IPostProcessingPass<unknown>>((context) => (named: string) => {
      const pass = context.container.getNamed<IPostProcessingPass<unknown>>(
        TYPES.IPostProcessingPass,
        named,
      );
      pass.setName(named);
      return pass;
    });

  return sceneContainer;
}

export function createLayerContainer(sceneContainer: Container) {
  const layerContainer = new Container();
  layerContainer.parent = sceneContainer;

  layerContainer
    .bind<IStyleAttributeService>(TYPES.IStyleAttributeService)
    .to(StyleAttributeService)
    .inSingletonScope();
  layerContainer
    .bind<IMultiPassRenderer>(TYPES.IMultiPassRenderer)
    .to(MultiPassRenderer)
    .inSingletonScope();
  layerContainer
    .bind<IPostProcessor>(TYPES.IPostProcessor)
    .to(PostProcessor)
    .inSingletonScope();
  return layerContainer;
}
