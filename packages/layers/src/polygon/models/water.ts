import {
  AttributeType,
  gl,
  IEncodeFeature,
  IModel,
  IModelUniform,
  ITexture2D,
} from '@antv/l7-core';
import { Version } from '@antv/l7-maps';
import { isNumber } from 'lodash';
import BaseModel from '../../core/BaseModel';
import { IPolygonLayerStyleOptions } from '../../core/interface';
import { polygonTriangulation } from '../../core/triangulation';
import water_frag from '../shaders/water/polygon_water_frag.glsl';
import water_vert from '../shaders/water/polygon_water_vert.glsl';
export default class WaterModel extends BaseModel {
  private texture: ITexture2D;
  public getUninforms() {
    const { opacity = 1, speed = 0.5 } =
      this.layer.getLayerConfig() as IPolygonLayerStyleOptions;
    return {
      u_texture: this.texture,
      u_speed: speed,
      u_opacity: isNumber(opacity) ? opacity : 1.0,
    };
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
    const model = await this.layer.buildLayerModel({
      moduleName: 'polygonWater',
      vertexShader: water_vert,
      fragmentShader: water_frag,
      triangulation: polygonTriangulation,
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
            feature.version === Version['GAODE2.x']
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
