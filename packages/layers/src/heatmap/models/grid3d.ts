import type { IEncodeFeature, IModel, IModelUniform } from '@antv/l7-core';
import { AttributeType, gl } from '@antv/l7-core';
import BaseModel from '../../core/BaseModel';
import type { IHeatMapLayerStyleOptions } from '../../core/interface';
import { PointExtrudeTriangulation } from '../../core/triangulation';
import grid_3d_frag from '../shaders/grid3d/grid_3d_frag.glsl';
import grid_3d_vert from '../shaders/grid3d/grid_3d_vert.glsl';
export default class Grid3DModel extends BaseModel {
  protected get attributeLocation() {
    return Object.assign(super.attributeLocation, {
      MAX: super.attributeLocation.MAX,
      SIZE: 9,
      POS: 10,
      NORMAL: 11,
    });
  }

  public getUninforms(): IModelUniform {
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
    const { opacity, coverage, angle } = this.layer.getLayerConfig() as IHeatMapLayerStyleOptions;
    const commonOptions = {
      u_radius: [this.layer.getSource().data.xOffset, this.layer.getSource().data.yOffset],
      u_opacity: opacity || 1.0,
      u_coverage: coverage || 0.9,
      u_angle: angle || 0,
    };

    const commonBufferInfo = this.getUniformsBufferInfo(commonOptions);
    return commonBufferInfo;
  }

  public async initModels(): Promise<IModel[]> {
    return this.buildModels();
  }

  public async buildModels(): Promise<IModel[]> {
    this.initUniformsBuffer();
    const model = await this.layer.buildLayerModel({
      moduleName: 'heatmapGrid3d',
      vertexShader: grid_3d_vert,
      fragmentShader: grid_3d_frag,
      defines: this.getDefines(),
      triangulation: PointExtrudeTriangulation,
      primitive: gl.TRIANGLES,
      depth: { enable: true },
    });
    return [model];
  }
  protected registerBuiltinAttributes() {
    this.styleAttributeService.registerStyleAttribute({
      name: 'size',
      type: AttributeType.Attribute,
      descriptor: {
        shaderLocation: this.attributeLocation.SIZE,
        name: 'a_Size',
        buffer: {
          usage: gl.DYNAMIC_DRAW,
          data: [],
          type: gl.FLOAT,
        },
        size: 1,
        update: (feature: IEncodeFeature) => {
          const { size } = feature;
          return Array.isArray(size) ? [size[0]] : [size as number];
        },
      },
    });

    this.styleAttributeService.registerStyleAttribute({
      name: 'normal',
      type: AttributeType.Attribute,
      descriptor: {
        name: 'a_Normal',
        shaderLocation: this.attributeLocation.NORMAL,
        buffer: {
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
      name: 'pos', // 顶点经纬度位置
      type: AttributeType.Attribute,
      descriptor: {
        name: 'a_Pos',
        shaderLocation: this.attributeLocation.POS,
        buffer: {
          usage: gl.DYNAMIC_DRAW,
          data: [],
          type: gl.FLOAT,
        },
        size: 3,
        update: (feature: IEncodeFeature) => {
          const coordinates = feature.coordinates as number[];
          return [coordinates[0], coordinates[1], 0];
        },
      },
    });
  }
}
