import type { IEncodeFeature, IModel, IModelUniform } from '@antv/l7-core';
import { AttributeType, gl } from '@antv/l7-core';
import BaseModel from '../../core/BaseModel';
import type { IHeatMapLayerStyleOptions } from '../../core/interface';
import { HeatmapGridTriangulation } from '../../core/triangulation';
import hexagon_frag from '../shaders/hexagon/hexagon_frag.glsl';
import hexagon_vert from '../shaders/hexagon/hexagon_vert.glsl';

export default class HexagonModel extends BaseModel {
  protected get attributeLocation() {
    return Object.assign(super.attributeLocation, {
      MAX: super.attributeLocation.MAX,
      POS: 9,
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
      moduleName: 'heatmapHexagon',
      vertexShader: hexagon_vert,
      fragmentShader: hexagon_frag,
      defines: this.getDefines(),
      triangulation: HeatmapGridTriangulation,
      depth: { enable: false },
      primitive: gl.TRIANGLES,
    });
    return [model];
  }
  protected registerBuiltinAttributes() {
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
