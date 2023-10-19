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
import { getCullFace } from '@antv/l7-utils';
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
    const attributes = this.getStyleAttribute();

    // FIXME: No need to update each frame
    this.uniformBuffers[0].subData({
      offset: 0,
      data: new Uint8Array(
        new Float32Array([
          ...attributes.u_stroke,
          ...attributes.u_offsets,
          attributes.u_opacity,
          attributes.u_rotation,
        ]).buffer,
      ),
    });

    const u_raisingHeight = Number(raisingHeight);
    const u_heightfixed = Number(heightfixed);
    const u_size_unit = SizeUnitType[unit] as SizeUnitType;
    const u_textSize = [1024, this.iconService.canvasHeight || 128];

    this.uniformBuffers[1].subData({
      offset: 0,
      data: new Uint8Array(
        new Float32Array([
          // vec2 u_textSize;
          // float u_raisingHeight;
          // float u_heightfixed;
          // float u_size_unit;
          ...u_textSize,
          u_raisingHeight,
          u_heightfixed,
          u_size_unit,
        ]).buffer,
      ),
    });

    return {
      u_raisingHeight,
      u_heightfixed,
      u_size_unit,
      u_textSize,
      ...attributes,
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
    this.uniformBuffers.push(
      this.rendererService.createBuffer({
        data: new Float32Array(4 + 2 + 1 + 1),
        isUBO: true,
      }),
    );
    this.uniformBuffers.push(
      this.rendererService.createBuffer({
        data: new Float32Array(2 + 1 + 1 + 1),
        isUBO: true,
      }),
    );

    const model = await this.layer.buildLayerModel({
      moduleName: 'pointFillImage',
      vertexShader: pointFillVert,
      fragmentShader: pointFillFrag,
      triangulation: PointFillTriangulation,
      depth: { enable: false },
      inject: this.getInject(),
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
  }

  // overwrite baseModel func
  protected registerBuiltinAttributes() {
    this.styleAttributeService.registerStyleAttribute({
      name: 'uv',
      type: AttributeType.Attribute,
      descriptor: {
        name: 'a_Uv',
        shaderLocation: 9,
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
        shaderLocation: 7,
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
        shaderLocation: 8,
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
    this.textures[0] = this.texture;
  };
}
