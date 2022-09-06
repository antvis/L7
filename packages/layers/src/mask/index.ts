import BaseLayer from '../core/BaseLayer';
import { IMaskLayerStyleOptions } from '../core/interface';
import MaskModels, { MaskModelType } from './models';
import {
  TYPES,
  ICameraService,
  ICoordinateSystemService,
  ILayerPlugin,
  ILayerService,
  IMapService,
  IRendererService,
  IShaderModuleService,
  IStyleAttributeService,
} from '@antv/l7-core';
export default class MaskLayer extends BaseLayer<IMaskLayerStyleOptions> {
  public type: string = 'MaskLayer';
  public defaultSourceConfig: {
    data: [];
    options: {
      parser: {
        type: 'geojson';
      };
    };
  };

  public init() {
    // 设置配置项
    const sceneId = this.container.get<string>(TYPES.SceneID);

    this.configService.setLayerConfig(sceneId, this.id, this.rawConfig);
    this.layerType = this.rawConfig.layerType;


    this.rendererService = this.container.get<IRendererService>(
      TYPES.IRendererService,
    );
    this.layerService = this.container.get<ILayerService>(TYPES.ILayerService);


    this.mapService = this.container.get<IMapService>(TYPES.IMapService);
  
    this.cameraService = this.container.get<ICameraService>(
      TYPES.ICameraService,
    );
    this.coordinateService = this.container.get<ICoordinateSystemService>(
      TYPES.ICoordinateSystemService,
    );
    this.shaderModuleService = this.container.get<IShaderModuleService>(
      TYPES.IShaderModuleService,
    );
    this.postProcessingPassFactory = this.container.get(
      TYPES.IFactoryPostProcessingPass,
    );
    this.normalPassFactory = this.container.get(TYPES.IFactoryNormalPass);

    // 图层容器服务
    this.styleAttributeService = this.container.get<IStyleAttributeService>(
      TYPES.IStyleAttributeService,
    );

    // 完成样式服务注册完成前添加的属性
    this.pendingStyleAttributes.forEach(
      ({ attributeName, attributeField, attributeValues, updateOptions }) => {
        this.styleAttributeService.updateStyleAttribute(
          attributeName,
          {
            // @ts-ignore
            scale: {
              field: attributeField,
              ...this.splitValuesAndCallbackInAttribute(
                // @ts-ignore
                attributeValues,
                // @ts-ignore
                this.getLayerConfig()[attributeName],
              ),
            },
          },
          // @ts-ignore
          updateOptions,
        );
      },
    );
    this.pendingStyleAttributes = [];

    // 获取插件集
    this.plugins = this.container.getAll<ILayerPlugin>(TYPES.ILayerPlugin);
    // 完成插件注册，传入场景和图层容器内的服务
    for (const plugin of this.plugins) {
      plugin.apply(this, {
        rendererService: this.rendererService,
        mapService: this.mapService,
        styleAttributeService: this.styleAttributeService,
        normalPassFactory: this.normalPassFactory,
        postProcessingPassFactory: this.postProcessingPassFactory,
      });
    }

    // 触发 init 生命周期插件
    this.hooks.init.call();
    this.hooks.afterInit.call();

    return this;
  }

  public buildModels() {
    const shape = this.getModelType();
    this.layerModel = new MaskModels[shape](this);
    this.layerModel.initModels((models) => {
      this.models = models;
      this.emit('modelLoaded', null);
    });
  }
  public rebuildModels() {
    this.layerModel.buildModels((models) => {
      this.models = models;
      this.emit('modelLoaded', null);
    });
  }
  protected getConfigSchema() {
    return {
      properties: {
        opacity: {
          type: 'number',
          minimum: 0,
          maximum: 1,
        },
      },
    };
  }

  protected getModelType(): MaskModelType {
    return 'fill';
  }
}
