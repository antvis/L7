import {
  TYPES,
  ICameraService,
  ICoordinateSystemService,
  IEncodeFeature,
  IFontService,
  IIconService,
  ILayerPlugin,
  ILayerService,
  IMapService,
  IRendererService,
  IShaderModuleService,
  IStyleAttributeService,
} from '@antv/l7-core';
import BaseLayer from '../../../core/BaseLayer';
import {
  ILineLayerStyleOptions,
  IPointLayerStyleOptions,
  IPolygonLayerStyleOptions,
  IMaskLayerStyleOptions,
} from '../../../core/interface';
import lineFillModel from '../../../line/models/tile';
import lineSimpleModel from '../../../line/models/simpleTileLine';

import pointTextModel from '../../../point/models/tileText';
import pointFillModel from '../../../point/models/tile';
import polygonFillModel from '../../../polygon/models/tile';

import maskModel from '../../../mask/models/fill';

type ILayerStyleOptions = IPolygonLayerStyleOptions & ILineLayerStyleOptions & IPointLayerStyleOptions & IMaskLayerStyleOptions;

export default class VectorLayer extends BaseLayer<
  Partial<
  ILayerStyleOptions & {needListen: boolean;}
  >
> {
  public needListen: boolean = true;
  public isVector: boolean = true;
  public isTileLayer: boolean = true;
  public type: string = this.layerType as string || 'vectorLayer';
  // Tip: 单独被 tile 瓦片的渲染链路使用（用于优化性能）
  private pickedID: number | null = null;
  public startInit:boolean = false;
  


  public async init(): Promise<void> {
  
    // 设置配置项
    const sceneId = this.container.get<string>(TYPES.SceneID);
    this.configService.setLayerConfig(sceneId, this.id, this.rawConfig);
    this.layerType = this.rawConfig.layerType;
    this.startInit = true;

    if(this.type === 'PointLayer') {
      // Tip: iconService 和 fontService 只有在矢量点图层中才会被使用
      this.iconService = this.container.get<IIconService>(TYPES.IIconService);
      this.fontService = this.container.get<IFontService>(TYPES.IFontService);
    }

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
    await this.hooks.init.promise();
    this.inited = true;
    this.hooks.afterInit.call();
    this.emit('inited', {
      target: this,
      type: 'inited',
    });
    this.emit('add', {
      target: this,
      type: 'add',
    });

  }

  public renderModels(isPicking?: boolean) {
    this.models.forEach((model) => {
      model.draw(
        {
          uniforms: this.layerModel.getUninforms(),
        },
        isPicking,
      );
    });
    return this;
  }

  public getPickID() {
    return this.pickedID;
  }

  public setPickID() {
    return this.pickedID;
  }

  public async buildModels() {
    const model = this.getModelType();
    this.layerModel = new model(this);
    await this.initLayerModels();
  }



  protected getModelType() {
    switch (this.layerType) {
      case 'PolygonLayer':
        return polygonFillModel;
      case 'LineLayer':
        return this.getLineModel();
      case 'PointLayer':
        return this.getPointModel();
      case 'MaskLayer':
          return maskModel;
      default:
        return pointFillModel;
    }
  }

  protected getLineModel() {
    const shapeAttribute = this.styleAttributeService.getLayerStyleAttribute(
      'shape',
    );
    const shape = shapeAttribute?.scale?.field;
    switch(shape) {
      case 'tileline':
      case 'line':
        return lineFillModel;
      case 'simple':
        return lineSimpleModel;
      default:
        return lineFillModel;
    }
  }

  protected getPointModel() {
    const layerData = this.getEncodedData();
    const { shape2d } = this.getLayerConfig();
    const item = layerData.find((fe: IEncodeFeature) => {
      return fe.hasOwnProperty('shape');
    });
    // only support pointFill & pointText now
    if (item) {
      const shape = item.shape;
      if (shape2d?.indexOf(shape as string) !== -1) {
        return pointFillModel;
      } else {
        return pointTextModel;
      }
    } else {
      return pointFillModel;
    }
  }

  protected getDefaultConfig() {
    return {};
  }
}
