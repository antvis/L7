/** Service interfaces */
import type { IFontService } from './services/asset/IFontService';
import type { IIconService } from './services/asset/IIconService';
import type { ICameraService } from './services/camera/ICameraService';
import type { IControlService } from './services/component/IControlService';
import type { IGlobalConfigService } from './services/config/IConfigService';
import type { ICoordinateSystemService } from './services/coordinate/ICoordinateSystemService';
import type { IDebugService } from './services/debug/IDebugService';
import type { IPickingService } from './services/interaction/IPickingService';
import type { ILayerService } from './services/layer/ILayerService';
import type { IStyleAttributeService } from './services/layer/IStyleAttributeService';
import type { ISceneService } from './services/scene/ISceneService';
import type { IShaderModuleService } from './services/shader/IShaderModuleService';

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
import type { IMarkerService } from './services/component/IMarkerService';
import type { IPopupService } from './services/component/IPopupService';
import type { IMapConfig, IMapService } from './services/map/IMapService';
import type {
  IMultiPassRenderer,
  IPass,
  IPostProcessingPass,
  IPostProcessor,
} from './services/renderer/IMultiPassRenderer';
import type { IRendererService } from './services/renderer/IRendererService';
import ClearPass from './services/renderer/passes/ClearPass';
import MultiPassRenderer from './services/renderer/passes/MultiPassRenderer';
import PixelPickingPass from './services/renderer/passes/PixelPickingPass';
import PostProcessor from './services/renderer/passes/PostProcessor';
import RenderPass from './services/renderer/passes/RenderPass';
import BloomPass from './services/renderer/passes/post-processing/BloomPass';
import BlurHPass from './services/renderer/passes/post-processing/BlurHPass';
import BlurVPass from './services/renderer/passes/post-processing/BlurVPass';
import ColorHalfTonePass from './services/renderer/passes/post-processing/ColorHalfTonePass';
import CopyPass from './services/renderer/passes/post-processing/CopyPass';
import HexagonalPixelatePass from './services/renderer/passes/post-processing/HexagonalPixelatePass';
import InkPass from './services/renderer/passes/post-processing/InkPass';
import NoisePass from './services/renderer/passes/post-processing/NoisePass';
import SepiaPass from './services/renderer/passes/post-processing/SepiaPass';

export const globalConfigService = new GlobalConfigService();

export interface L7Container {
  id: string;
  globalConfigService: IGlobalConfigService;
  shaderModuleService: IShaderModuleService;
  layerService: ILayerService;
  debugService: IDebugService;
  rendererService: IRendererService;
  sceneService: ISceneService;
  cameraService: ICameraService;
  coordinateSystemService: ICoordinateSystemService;
  interactionService: InteractionService;
  mapConfig: Partial<IMapConfig>;
  mapService: IMapService;
  fontService: IFontService;
  iconService: IIconService;
  markerService: IMarkerService;
  popupService: IPopupService;
  controlService: IControlService;
  pickingService: IPickingService;
  styleAttributeService: IStyleAttributeService;
  normalPassFactory: (name: string) => IPass<unknown>;
  postProcessingPass: Record<string, IPostProcessingPass<unknown>>;
  postProcessingPassFactory: (named: string) => IPostProcessingPass<unknown>;
  postProcessor: IPostProcessor;
  multiPassRenderer: IMultiPassRenderer;
  customRenderService: {
    [key: string]: any;
  };
}

let sceneIdCounter = 0;
export function createSceneContainer(): L7Container {
  const shaderModuleService = new ShaderModuleService();
  const debugService = new DebugService();
  const cameraService = new CameraService();
  const coordinateSystemService = new CoordinateSystemService(cameraService);
  const fontService = new FontService();
  const iconService = new IconService();
  const markerService = new MarkerService();
  const popupService = new PopupService();
  const controlService = new ControlService();

  // @ts-ignore
  const container: L7Container = {
    id: `${sceneIdCounter++}`,
    globalConfigService,
    shaderModuleService,
    debugService,
    cameraService,
    coordinateSystemService,
    fontService,
    iconService,
    markerService,
    popupService,
    controlService,
    customRenderService: {},
  };

  // lazy binding
  const layerService = new LayerService(container);
  container.layerService = layerService;

  const sceneService = new SceneService(container);
  container.sceneService = sceneService;

  const interactionService = new InteractionService(container);
  container.interactionService = interactionService;

  const pickingService = new PickingService(container);
  container.pickingService = pickingService;

  const normalPass: Record<string, IPass<unknown>> = {
    clear: new ClearPass(),
    pixelPicking: new PixelPickingPass(),
    render: new RenderPass(),
  };
  container.normalPassFactory = (named: string) => {
    return normalPass[named];
  };

  const postProcessingPass: Record<string, IPostProcessingPass<unknown>> = {
    copy: new CopyPass(),
    bloom: new BloomPass(),
    blurH: new BlurHPass(),
    blurV: new BlurVPass(),
    noise: new NoisePass(),
    sepia: new SepiaPass(),
    colorHalftone: new ColorHalfTonePass(),
    hexagonalPixelate: new HexagonalPixelatePass(),
    ink: new InkPass(),
  };
  container.postProcessingPass = postProcessingPass;
  container.postProcessingPassFactory = (named: string) => {
    return postProcessingPass[named];
  };

  return container;
}

export function createLayerContainer(sceneContainer: L7Container) {
  const layerContainer = {
    ...sceneContainer,
  };

  layerContainer.postProcessor = new PostProcessor(layerContainer.rendererService);
  layerContainer.multiPassRenderer = new MultiPassRenderer(layerContainer.postProcessor);
  layerContainer.styleAttributeService = new StyleAttributeService(layerContainer.rendererService);

  return layerContainer;
}
