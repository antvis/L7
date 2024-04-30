import type { IModel } from '@antv/l7-core';
import { rgb2arr } from '@antv/l7-utils';
import BaseModel from '../../core/BaseModel';
import { polygonTriangulation } from '../../core/triangulation';
import mask_frag from '../../shader/minify_frag.glsl';
import mask_vert from '../shaders/mask_vert.glsl';
export default class MaskModel extends BaseModel {
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
    const { opacity = 1, color = '#000' } = this.layer.getLayerConfig() as any;
    const commonOptions = {
      u_color: rgb2arr(color),
      u_opacity: opacity || 1,
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
      moduleName: 'mask',
      vertexShader: mask_vert,
      fragmentShader: mask_frag,
      defines: this.getDefines(),
      triangulation: polygonTriangulation,
      depth: { enable: false },
      pick: false,
    });
    return [model];
  }

  public clearModels(refresh = true) {
    if (refresh) {
      this.layerService.clear();
    }
  }

  protected registerBuiltinAttributes() {
    return '';
  }
}
