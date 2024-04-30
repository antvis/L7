import type { IEncodeFeature, IModel, ITexture2D } from '@antv/l7-core';
import { AttributeType, gl } from '@antv/l7-core';
import BaseModel from '../../core/BaseModel';
import { PolygonExtrudeTriangulation } from '../../core/triangulation';
import polygonExtrudeFrag from '../shaders/extrusion/polygon_extrusion_frag.glsl';
import polygonExtrudeVert from '../shaders/extrusion/polygon_extrusion_vert.glsl';

export default class ExtrusionModel extends BaseModel {
  protected get attributeLocation() {
    return Object.assign(super.attributeLocation, {
      MAX: super.attributeLocation.MAX,
      SIZE: 9,
      NORMAL: 10,
      EXTRUSION_BASE: 11,
    });
  }

  protected texture: ITexture2D;

  public getUninforms() {
    const commoninfo = this.getCommonUniformsInfo();
    const attributeInfo = this.getUniformsBufferInfo(this.getStyleAttribute());
    this.updateStyleUnifoms();
    return {
      ...commoninfo.uniformsOption,
      ...attributeInfo.uniformsOption,
    };
  }

  protected getCommonUniformsInfo(): {
    uniformsArray: number[];
    uniformsLength: number;
    uniformsOption: { [key: string]: any };
  } {
    const commonOptions = {};
    const commonBufferInfo = this.getUniformsBufferInfo(commonOptions);
    return commonBufferInfo;
  }

  public async initModels(): Promise<IModel[]> {
    return this.buildModels();
  }

  public async buildModels(): Promise<IModel[]> {
    const { frag, vert, type } = this.getShaders();
    this.initUniformsBuffer();
    const model = await this.layer.buildLayerModel({
      moduleName: type,
      vertexShader: vert,
      fragmentShader: frag,
      defines: this.getDefines(),
      inject: this.getInject(),
      triangulation: PolygonExtrudeTriangulation,
      depth: { enable: true },
    });
    return [model];
  }

  public getShaders() {
    return {
      frag: polygonExtrudeFrag,
      vert: polygonExtrudeVert,
      type: 'polygonExtrude',
    };
  }

  public clearModels() {
    this.texture?.destroy();
  }

  protected registerBuiltinAttributes() {
    // 注册 Position 属性 64 位地位部分，经纬度数据开启双精度，避免大于 22 层级以上出现数据偏移
    this.registerPosition64LowAttribute();

    this.styleAttributeService.registerStyleAttribute({
      name: 'normal',
      type: AttributeType.Attribute,
      descriptor: {
        name: 'a_Normal',
        shaderLocation: this.attributeLocation.NORMAL,
        buffer: {
          // give the WebGL driver a hint that this buffer may change
          usage: gl.STATIC_DRAW,
          data: [],
          type: gl.FLOAT,
        },
        size: 3,
        update: (
          feature: IEncodeFeature,
          featureIdx: number,
          vertex: number[],
          attributeIdx: number,
          normal: number[],
        ) => {
          return normal;
        },
      },
    });

    this.styleAttributeService.registerStyleAttribute({
      name: 'size',
      type: AttributeType.Attribute,
      descriptor: {
        name: 'a_Size',
        shaderLocation: this.attributeLocation.SIZE,
        buffer: {
          usage: gl.DYNAMIC_DRAW,
          data: [],
          type: gl.FLOAT,
        },
        size: 1,
        update: (feature: IEncodeFeature) => {
          const { size = 10 } = feature;
          return Array.isArray(size) ? [size[0]] : [size as number];
        },
      },
    });

    this.styleAttributeService.registerStyleAttribute({
      name: 'extrusionBase',
      type: AttributeType.Attribute,
      descriptor: {
        name: 'a_ExtrusionBase',
        shaderLocation: this.attributeLocation.EXTRUSION_BASE,
        buffer: {
          usage: gl.STATIC_DRAW,
          data: [],
          type: gl.FLOAT,
        },
        size: 1,
        update: (feature: IEncodeFeature) => {
          const { extrusionBase: op = 0 } = feature;
          return [op];
        },
      },
    });
  }
}
