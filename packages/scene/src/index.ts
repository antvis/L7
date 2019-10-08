import {
  container,
  ILayer,
  IMapConfig,
  IMapService,
  IRenderConfig,
  IRendererService,
  ISceneService,
  MapType,
  SceneService,
  TYPES,
} from '@l7/core';
import { AMapService, MapboxService } from '@l7/maps';
import { ReglRendererService } from '@l7/renderer';

// 绑定渲染引擎服务
container
  .bind<IRendererService>(TYPES.IRendererService)
  .to(ReglRendererService)
  .inSingletonScope();

/**
 * 暴露 Scene API
 *
 * @example
 * import { Scene } from '@l7/scene';
 * import { PointLayer } from '@l7/layers';
 *
 * const scene = new Scene();
 * const pointLayer = new PointLayer();
 * scene.addLayer(pointLayer);
 * scene.render();
 */
class Scene {
  private sceneService: ISceneService;

  public constructor(config: IMapConfig & IRenderConfig) {
    const { type = MapType.amap } = config;

    // 根据用户传入参数绑定地图服务
    let mapService: new (...args: any[]) => IMapService;
    if (type === MapType.mapbox) {
      mapService = MapboxService;
    } else if (type === MapType.amap) {
      mapService = AMapService;
    } else {
      throw new Error('不支持的地图服务');
    }

    // DEMO 中切换底图实现时，需要重新绑定底图服务
    // @see https://github.com/inversify/InversifyJS/blob/master/wiki/container_api.md#containerrebindserviceidentifier-serviceidentifier
    if (container.isBound(TYPES.IMapService)) {
      container
        .rebind<IMapService>(TYPES.IMapService)
        .to(mapService)
        .inSingletonScope();
    } else {
      container
        .bind<IMapService>(TYPES.IMapService)
        .to(mapService)
        .inSingletonScope();
    }

    // 依赖注入
    this.sceneService = container.resolve(SceneService);
    this.sceneService.init(config);
  }

  public addLayer(layer: ILayer): void {
    this.sceneService.addLayer(layer);
  }

  public render(): void {
    this.sceneService.render();
  }

  public destroy() {
    this.sceneService.destroy();
  }
}

export { Scene };
