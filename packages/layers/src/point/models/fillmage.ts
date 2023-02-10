import {
  AttributeType,
  gl,
  IAttribute,
  IElements,
  IEncodeFeature,
  IModel,
  IModelUniform,
  ITexture2D,
} from '@antv/l7-core';
import { getCullFace, getMask } from '@antv/l7-utils';
import { isNumber } from 'lodash';
import BaseModel from '../../core/BaseModel';
import { IPointLayerStyleOptions, SizeUnitType } from '../../core/interface';
import { PointFillTriangulation } from '../../core/triangulation';
// static pointLayer shader - not support animate
import pointFillFrag from '../shaders/image/fillImage_frag.glsl';
import pointFillVert from '../shaders/image/fillImage_vert.glsl';

export default class FillImageModel extends BaseModel {
  private meter2coord: number = 1;
  private texture: ITexture2D;
  private isMeter: boolean = false;
  private radian: number = 0; // 旋转的弧度
  public getUninforms(): IModelUniform {
    const {
      opacity = 1,
      offsets = [0, 0],
      rotation,
      raisingHeight = 0.0,
      heightfixed = false,
      unit = 'pixel',
    } = this.layer.getLayerConfig() as IPointLayerStyleOptions;

    if (this.rendererService.getDirty()) {
      this.texture.bind();
    }
    /**
     *               rotateFlag
     * DEFAULT          1
     * MAPBOX           1
     * GAODE2.x         -1
     * GAODE1.x         -1
     */
    let rotateFlag = 1;
    if (
      this.mapService.version === 'GAODE2.x' ||
      this.mapService.version === 'GAODE1.x'
    ) {
      rotateFlag = -1;
    }
    // 控制图标的旋转角度（绕 Z 轴旋转）
    this.radian =
      rotation !== undefined
        ? (rotateFlag * Math.PI * rotation) / 180
        : (rotateFlag * Math.PI * (this.mapService.getRotation() % 360)) / 180;

    if (
      this.dataTextureTest &&
      this.dataTextureNeedUpdate({
        opacity,
        offsets,
      })
    ) {
      // 判断当前的样式中哪些是需要进行数据映射的，哪些是常量，同时计算用于构建数据纹理的一些中间变量
      this.judgeStyleAttributes({
        opacity,
        offsets,
      });

      const encodeData = this.layer.getEncodedData();
      const { data, width, height } = this.calDataFrame(
        this.cellLength,
        encodeData,
        this.cellProperties,
      );
      this.rowCount = height; // 当前数据纹理有多少行

      this.dataTexture =
        this.cellLength > 0 && data.length > 0
          ? this.createTexture2D({
              flipY: true,
              data,
              format: gl.LUMINANCE,
              type: gl.FLOAT,
              width,
              height,
            })
          : this.createTexture2D({
              flipY: true,
              data: [1],
              format: gl.LUMINANCE,
              type: gl.FLOAT,
              width: 1,
              height: 1,
            });
    }
    return {
      u_raisingHeight: Number(raisingHeight),
      u_heightfixed: Number(heightfixed),
      u_Size_Unit: SizeUnitType[unit] as SizeUnitType,
      u_RotateMatrix: new Float32Array([
        Math.cos(this.radian),
        Math.sin(this.radian),
        -Math.sin(this.radian),
        Math.cos(this.radian),
      ]),

      u_dataTexture: this.dataTexture, // 数据纹理 - 有数据映射的时候纹理中带数据，若没有任何数据映射时纹理是 [1]
      u_cellTypeLayout: this.getCellTypeLayout(),

      u_texture: this.texture,
      u_textSize: [1024, this.iconService.canvasHeight || 128],

      u_opacity: isNumber(opacity) ? opacity : 1.0,
      u_offsets: this.isOffsetStatic(offsets)
        ? (offsets as [number, number])
        : [0, 0],
    };
  }

  public getAttribute(): {
    attributes: {
      [attributeName: string]: IAttribute;
    };
    elements: IElements;
  } {
    return this.styleAttributeService.createAttributesAndIndices(
      this.layer.getEncodedData(),
      PointFillTriangulation,
    );
  }

  public async initModels(): Promise<IModel[]> {
    this.iconService.on('imageUpdate', this.updateTexture);
    this.updateTexture();
    return this.buildModels();
  }

  public async buildModels(): Promise<IModel[]> {
    const { mask = false, maskInside = true } =
      this.layer.getLayerConfig() as IPointLayerStyleOptions;
    const model = await this.layer.buildLayerModel({
      moduleName: 'pointFillImage',
      vertexShader: pointFillVert,
      fragmentShader: pointFillFrag,
      triangulation: PointFillTriangulation,
      depth: { enable: false },
      blend: this.getBlend(),
      stencil: getMask(mask, maskInside),
      cull: {
        enable: true,
        face: getCullFace(this.mapService.version),
      },
    });
    return [model];
  }

  public clearModels() {
    this.iconService.off('imageUpdate', this.updateTexture);
    this.texture?.destroy();
    this.dataTexture?.destroy();
  }

  // overwrite baseModel func
  protected registerBuiltinAttributes() {
    this.styleAttributeService.registerStyleAttribute({
      name: 'rotate',
      type: AttributeType.Attribute,
      descriptor: {
        name: 'a_Rotate',
        buffer: {
          usage: gl.DYNAMIC_DRAW,
          data: [],
          type: gl.FLOAT,
        },
        size: 1,
        update: (feature: IEncodeFeature) => {
          const { rotate = 0 } = feature;
          return Array.isArray(rotate) ? [rotate[0]] : [rotate as number];
        },
      },
    });
    this.styleAttributeService.registerStyleAttribute({
      name: 'uv',
      type: AttributeType.Attribute,
      descriptor: {
        name: 'a_Uv',
        buffer: {
          // give the WebGL driver a hint that this buffer may change
          usage: gl.DYNAMIC_DRAW,
          data: [],
          type: gl.FLOAT,
        },
        size: 2,
        update: (feature: IEncodeFeature) => {
          const iconMap = this.iconService.getIconMap();
          const { shape } = feature;
          const { x, y } = iconMap[shape as string] || { x: -64, y: -64 };
          return [x, y];
        },
      },
    });

    this.styleAttributeService.registerStyleAttribute({
      name: 'extrude',
      type: AttributeType.Attribute,
      descriptor: {
        name: 'a_Extrude',
        buffer: {
          // give the WebGL driver a hint that this buffer may change
          usage: gl.DYNAMIC_DRAW,
          data: [],
          type: gl.FLOAT,
        },
        size: 3,
        update: (
          feature: IEncodeFeature,
          featureIdx: number,
          vertex: number[],
          attributeIdx: number,
        ) => {
          const extrude = [1, 1, 0, -1, 1, 0, -1, -1, 0, 1, -1, 0];

          const extrudeIndex = (attributeIdx % 4) * 3;
          return [
            extrude[extrudeIndex],
            extrude[extrudeIndex + 1],
            extrude[extrudeIndex + 2],
          ];
        },
      },
    });

    // point layer size;
    this.styleAttributeService.registerStyleAttribute({
      name: 'size',
      type: AttributeType.Attribute,
      descriptor: {
        name: 'a_Size',
        buffer: {
          // give the WebGL driver a hint that this buffer may change
          usage: gl.DYNAMIC_DRAW,
          data: [],
          type: gl.FLOAT,
        },
        size: 1,
        update: (feature: IEncodeFeature) => {
          const { size = 5 } = feature;
          return Array.isArray(size) ? [size[0]] : [size as number];
        },
      },
    });
  }

  private updateTexture = () => {
    const { createTexture2D } = this.rendererService;
    if (this.texture) {
      this.texture.update({
        data: this.iconService.getCanvas(),
        mag: 'linear',
        min: 'linear mipmap nearest',
        mipmap: true,
      });
      // 更新完纹理后在更新的图层的时候需要更新所有的图层
      this.layerService.throttleRenderLayers();
      return;
    }
    this.texture = createTexture2D({
      data: this.iconService.getCanvas(),
      mag: gl.LINEAR,
      min: gl.LINEAR_MIPMAP_LINEAR,
      premultiplyAlpha: false,
      width: 1024,
      height: this.iconService.canvasHeight || 128,
      mipmap: true,
    });
  };
}
