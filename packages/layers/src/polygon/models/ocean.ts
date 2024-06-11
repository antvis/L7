import type { IEncodeFeature, IModel, IModelUniform, ITexture2D } from '@antv/l7-core';
import { AttributeType, gl } from '@antv/l7-core';
import { rgb2arr } from '@antv/l7-utils';
import BaseModel from '../../core/BaseModel';
import type { IPolygonLayerStyleOptions } from '../../core/interface';
import { polygonTriangulation } from '../../core/triangulation';
import ocean_frag from '../shaders/ocean/ocean_frag.glsl';
import ocean_vert from '../shaders/ocean/ocean_vert.glsl';
export default class OceanModel extends BaseModel {
  protected get attributeLocation() {
    return Object.assign(super.attributeLocation, {
      MAX: super.attributeLocation.MAX,
      UV: 9,
    });
  }

  private texture1: ITexture2D;
  private texture2: ITexture2D;
  private texture3: ITexture2D;
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
    const { watercolor = '#6D99A8', watercolor2 = '#0F121C' } =
      this.layer.getLayerConfig() as IPolygonLayerStyleOptions;
    const commonOptions = {
      u_watercolor: rgb2arr(watercolor),
      u_watercolor2: rgb2arr(watercolor2),
      u_time: this.layer.getLayerAnimateTime(),
      u_texture1: this.texture1,
      u_texture2: this.texture2,
      u_texture3: this.texture3,
    };

    // u_opacity: isNumber(opacity) ? opacity : 1.0,
    this.textures = [this.texture1, this.texture2, this.texture3];
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
      moduleName: 'polygonOcean',
      vertexShader: ocean_vert,
      fragmentShader: ocean_frag,
      defines: this.getDefines(),
      inject: this.getInject(),
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
        shaderLocation: this.attributeLocation.UV,
        buffer: {
          // give the WebGL driver a hint that this buffer may change
          usage: gl.STATIC_DRAW,
          data: [],
          type: gl.FLOAT,
        },
        size: 2,
        update: (feature: IEncodeFeature, featureIdx: number, vertex: number[]) => {
          const [lng, lat] = vertex;
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
