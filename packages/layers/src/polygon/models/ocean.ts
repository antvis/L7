import {
  AttributeType,
  gl,
  IEncodeFeature,
  IModel,
  IModelUniform,
  ITexture2D,
} from '@antv/l7-core';
import { Version } from '@antv/l7-maps';
import { rgb2arr } from '@antv/l7-utils';
import { isNumber } from 'lodash';
import BaseModel from '../../core/BaseModel';
import { IPolygonLayerStyleOptions } from '../../core/interface';
import { polygonTriangulation } from '../../core/triangulation';
import ocean_frag from '../shaders/water/polygon_ocean_frag.glsl';
import ocean_vert from '../shaders/water/polygon_ocean_vert.glsl';
export default class OceanModel extends BaseModel {
  private texture1: ITexture2D;
  private texture2: ITexture2D;
  private texture3: ITexture2D;
  public getUninforms() {
    const {
      opacity = 1,
      watercolor = '#6D99A8',
      watercolor2 = '#0F121C',
    } = this.layer.getLayerConfig() as IPolygonLayerStyleOptions;

    return {
      u_texture1: this.texture1,
      u_texture2: this.texture2,
      u_texture3: this.texture3,
      u_watercolor: rgb2arr(watercolor),
      u_watercolor2: rgb2arr(watercolor2),
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
      moduleName: 'polygonOcean',
      vertexShader: ocean_vert,
      fragmentShader: ocean_frag,
      triangulation: polygonTriangulation,
      primitive: gl.TRIANGLES,
      depth: { enable: false },
    });
    return [model];
  }

  public clearModels() {
    this.texture1?.destroy();
    this.texture2?.destroy();
    this.texture3?.destroy();
  }

  protected registerBuiltinAttributes() {
    const bbox = this.layer.getSource().extent;
    const [minLng, minLat, maxLng, maxLat] = bbox;
    const lngLen = maxLng - minLng;
    const latLen = maxLat - minLat;

    this.styleAttributeService.registerStyleAttribute({
      name: 'oceanUv',
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
    const { createTexture2D } = this.rendererService;
    const defaultTextureOptions = { height: 0, width: 0 };
    // 默认索引为 undefined，所以单独赋值
    this.texture1 = createTexture2D(defaultTextureOptions);
    this.texture2 = createTexture2D(defaultTextureOptions);
    this.texture3 = createTexture2D(defaultTextureOptions);

    // 加载完 image 后单独给 texture f赋值
    initImage((images: HTMLImageElement[]) => {
      this.texture1 = initTex(images[0]);
      this.texture2 = initTex(images[1]);
      this.texture3 = initTex(images[2]);
      this.layerService.reRender();
    });

    function initImage(callback: (loadedImages: HTMLImageElement[]) => void) {
      let loadedCount = 0;
      const loadedImages: HTMLImageElement[] = [];
      const images = [
        'https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*EojwT4VzSiYAAAAAAAAAAAAAARQnAQ',
        'https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*MJ22QbpuCzIAAAAAAAAAAAAAARQnAQ',
        'https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*-z2HSIVDsHIAAAAAAAAAAAAAARQnAQ',
      ];
      images.map((imgSrc: string) => {
        const image = new Image();
        image.crossOrigin = '';
        image.src = imgSrc;
        loadedImages.push(image);
        image.onload = () => {
          loadedCount++;
          if (loadedCount === 3) {
            callback(loadedImages);
          }
        };
      });
    }

    function initTex(image: HTMLImageElement) {
      return createTexture2D({
        data: image,
        width: image.width,
        height: image.height,
        wrapS: gl.MIRRORED_REPEAT,
        wrapT: gl.MIRRORED_REPEAT,
        min: gl.LINEAR,
        mag: gl.LINEAR,
      });
    }
  }
}
