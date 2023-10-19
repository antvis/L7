import {
  AttributeType,
  gl,
  IAnimateOption,
  IEncodeFeature,
  ILayerConfig,
  IModel,
  IModelUniform,
  ITexture2D,
} from '@antv/l7-core';
import { Version } from '@antv/l7-maps';
import { lodashUtil, rgb2arr } from '@antv/l7-utils';
import BaseModel from '../../core/BaseModel';
import { IPolygonLayerStyleOptions } from '../../core/interface';
import { polygonTriangulation } from '../../core/triangulation';
import ocean_frag from '../shaders/water/polygon_ocean_frag.glsl';
import ocean_vert from '../shaders/water/polygon_ocean_vert.glsl';
const { isNumber } = lodashUtil;
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

    const u_watercolor = rgb2arr(watercolor);
    const u_watercolor2 = rgb2arr(watercolor2);
    const u_opacity = isNumber(opacity) ? opacity : 1.0;

    this.uniformBuffers[0].subData({
      offset: 0,
      data: new Uint8Array(
        new Float32Array([...u_watercolor, ...u_watercolor2, u_opacity]).buffer,
      ),
    });

    return {
      u_watercolor,
      u_watercolor2,
      u_opacity,
    };
  }

  public getAnimateUniforms(): IModelUniform {
    const { animateOption } = this.layer.getLayerConfig() as ILayerConfig;

    return {
      u_animate: this.animateOption2Array(animateOption as IAnimateOption),
      u_time: this.layer.getLayerAnimateTime(),
    };
  }

  public async initModels(): Promise<IModel[]> {
    this.loadTexture();
    return this.buildModels();
  }

  public async buildModels(): Promise<IModel[]> {
    this.uniformBuffers.push(
      this.rendererService.createBuffer({
        data: new Float32Array(4 + 4 + 1),
        isUBO: true,
      }),
    );

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
        shaderLocation: 7,
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
    this.textures[0] = this.texture1;
    this.textures[1] = this.texture2;
    this.textures[2] = this.texture3;

    // 加载完 image 后单独给 texture f赋值
    initImage((images: HTMLImageElement[]) => {
      this.texture1 = initTex(images[0]);
      this.texture2 = initTex(images[1]);
      this.texture3 = initTex(images[2]);
      this.textures[0] = this.texture1;
      this.textures[1] = this.texture2;
      this.textures[2] = this.texture3;
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
