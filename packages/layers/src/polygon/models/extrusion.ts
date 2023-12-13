import {
  AttributeType,
  gl,
  IEncodeFeature,
  IModel,
  ITexture2D,
} from '@antv/l7-core';
import BaseModel from '../../core/BaseModel';
import { PolygonExtrudeTriangulation } from '../../core/triangulation';
import polygonExtrudeFrag from '../shaders/extrusion/polygon_extrusion_frag.glsl';
import polygonExtrudeVert from '../shaders/extrusion/polygon_extrusion_vert.glsl';
import { ShaderLocation } from '../../core/CommonStyleAttribute';

export default class ExtrusionModel extends BaseModel {
  protected texture: ITexture2D;
  public getUninforms() {
    const commoninfo = this.getCommonUniformsInfo();
    const attributeInfo = this.getUniformsBufferInfo(this.getStyleAttribute());
    this.updateStyleUnifoms();
    return {
      ...commoninfo.uniformsOption,
      ...attributeInfo.uniformsOption,
    }
  }

  protected  getCommonUniformsInfo(): { uniformsArray: number[]; uniformsLength: number; uniformsOption: { [key: string]: any; }; } {
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
    this.styleAttributeService.registerStyleAttribute({
      name: 'normal',
      type: AttributeType.Attribute,
      descriptor: {
        name: 'a_Normal',
        shaderLocation: ShaderLocation.NORMAL,
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
        shaderLocation: ShaderLocation.SIZE,
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
  }
}
