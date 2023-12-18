import type {
  IEncodeFeature,
  IModel,
  IModelUniform,
  ITexture2D} from '@antv/l7-core';
import {
  AttributeType,
  gl
} from '@antv/l7-core';
import { lodashUtil } from '@antv/l7-utils';
import BaseModel from '../../core/BaseModel';
import type { IPolygonLayerStyleOptions } from '../../core/interface';
import { polygonTriangulation } from '../../core/triangulation';
import water_frag from '../shaders/water/polygon_water_frag.glsl';
import water_vert from '../shaders/water/polygon_water_vert.glsl';
import { ShaderLocation } from '../../core/CommonStyleAttribute';
const { isNumber } = lodashUtil;
export default class WaterModel extends BaseModel {
  private texture: ITexture2D;
  public getUninforms() {
    const commoninfo = this.getCommonUniformsInfo();
    const attributeInfo = this.getUniformsBufferInfo(this.getStyleAttribute());
    this.updateStyleUnifoms();
    return {
      ...commoninfo.uniformsOption,
      ...attributeInfo.uniformsOption,
    }
  }
  
  protected getCommonUniformsInfo(): { uniformsArray: number[]; uniformsLength: number; uniformsOption: { [key: string]: any; }; } {
    const { speed = 0.5 } =
      this.layer.getLayerConfig() as IPolygonLayerStyleOptions;
    const commonOptions = {
      u_speed: speed,
      u_time: this.layer.getLayerAnimateTime(),
      u_texture: this.texture,
    };

      // u_opacity: isNumber(opacity) ? opacity : 1.0,
     this.textures=[this.texture]
     const commonBufferInfo = this.getUniformsBufferInfo(commonOptions);
     return commonBufferInfo;
     
  }
 


  public getAnimateUniforms(): IModelUniform {
    return {
      u_time: this.layer.getLayerAnimateTime(),
    };
  }

  public async initModels(): Promise<IModel[]> {
    this.loadTexture();
    return this.buildModels();
  }

  public async buildModels(): Promise<IModel[]> {
    this.initUniformsBuffer();
    const model = await this.layer.buildLayerModel({
      moduleName: 'polygonWater',
      vertexShader: water_vert,
      fragmentShader: water_frag,
      triangulation: polygonTriangulation,
      inject:this.getInject(),
      primitive: gl.TRIANGLES,
      depth: { enable: false },
    });
    return [model];
  }

  public clearModels() {
    this.texture?.destroy();
  }

  protected registerBuiltinAttributes() {
    const bbox = this.layer.getSource().extent;
    const [minLng, minLat, maxLng, maxLat] = bbox;
    const lngLen = maxLng - minLng;
    const latLen = maxLat - minLat;

    this.styleAttributeService.registerStyleAttribute({
      name: 'waterUv',
      type: AttributeType.Attribute,
      descriptor: {
        name: 'a_uv',
        shaderLocation: ShaderLocation.UV,
        buffer: {
          // give the WebGL driver a hint that this buffer may change
          usage: gl.STATIC_DRAW,
          data: [],
          type: gl.FLOAT,
        },
        size: 2,
        update: (
          feature: IEncodeFeature,
          featureIdx: number,
          vertex: number[],
          attributeIdx: number,
        ) => {
          const v =
            feature.version === 'GAODE2.x'
              ? feature.originCoordinates[0][attributeIdx]
              : vertex;
          const [lng, lat] = v;
          return [(lng - minLng) / lngLen, (lat - minLat) / latLen];
        },
      },
    });
  }

  private loadTexture() {
    const { waterTexture } =
      this.layer.getLayerConfig() as IPolygonLayerStyleOptions;

    const { createTexture2D } = this.rendererService;
    this.texture = createTexture2D({
      height: 0,
      width: 0,
    });
    const image = new Image();
    image.crossOrigin = '';
    if (waterTexture) {
      // custom texture
      console.warn(
        'L7 recommend：https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*EojwT4VzSiYAAAAAAAAAAAAAARQnAQ',
      );
      image.src = waterTexture;
    } else {
      // default texture
      image.src =
        'https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*EojwT4VzSiYAAAAAAAAAAAAAARQnAQ';
    }

    image.onload = () => {
      this.texture = createTexture2D({
        data: image,
        width: image.width,
        height: image.height,
        wrapS: gl.MIRRORED_REPEAT,
        wrapT: gl.MIRRORED_REPEAT,
        min: gl.LINEAR,
        mag: gl.LINEAR,
      });
      this.layerService.reRender();
    };
  }
}
