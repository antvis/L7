import {
  AttributeType,
  gl,
  IEncodeFeature,
  IModel,
  IModelUniform,
  ITexture2D,
} from '@antv/l7-core';
import BaseModel from '../../core/BaseModel';
import { IPointLayerStyleOptions } from '../../core/interface';
import { PointImageTriangulation } from '../../core/triangulation';
import pointImageFrag from '../shaders/image_frag.glsl';
import pointImageVert from '../shaders/image_vert.glsl';
export default class ImageModel extends BaseModel {
  private texture: ITexture2D;
  public getUninforms(): IModelUniform {
    const {
      opacity = 1,
      offsets = [0, 0],
      raisingHeight = 0,
      heightfixed = false,
    } = this.layer.getLayerConfig() as IPointLayerStyleOptions;

    // ThreeJS 图层兼容
    if (this.rendererService.getDirty()) {
      this.texture.bind();
    }

    return {
      u_raisingHeight: Number(raisingHeight),
      u_heightfixed: Number(heightfixed),
      u_texture: this.texture,
      u_textSize: [1024, this.iconService.canvasHeight || 128],
      u_opacity: opacity,
      u_offsets: offsets,
    };
  }

  public async initModels(): Promise<IModel[]> {
    this.iconService.on('imageUpdate', this.updateTexture);
    this.updateTexture();
    return this.buildModels();
  }

  public clearModels() {
    this.texture?.destroy();
    this.iconService.off('imageUpdate', this.updateTexture);
  }

  public async buildModels(): Promise<IModel[]> {
    const model = await this.layer.buildLayerModel({
      moduleName: 'pointImage',
      vertexShader: pointImageVert,
      fragmentShader: pointImageFrag,
      triangulation: PointImageTriangulation,
      depth: { enable: false },
      primitive: gl.POINTS,
    });

    return [model];
  }
  protected registerBuiltinAttributes() {
    // point layer size;
    this.styleAttributeService.registerStyleAttribute({
      name: 'size',
      type: AttributeType.Attribute,
      descriptor: {
        name: 'a_Size',
        buffer: {
          // give the WebGL driver a hint that this buffer may change
          usage: gl.DYNAMIC_DRAW,
          data: [],
          type: gl.FLOAT,
        },
        size: 1,
        update: (feature: IEncodeFeature) => {
          const { size = 5 } = feature;
          return Array.isArray(size) ? [size[0]] : [size as number];
        },
      },
    });

    // point layer size;
    this.styleAttributeService.registerStyleAttribute({
      name: 'uv',
      type: AttributeType.Attribute,
      descriptor: {
        name: 'a_Uv',
        buffer: {
          // give the WebGL driver a hint that this buffer may change
          usage: gl.DYNAMIC_DRAW,
          data: [],
          type: gl.FLOAT,
        },
        size: 2,
        update: (feature: IEncodeFeature) => {
          const iconMap = this.iconService.getIconMap();
          const { shape } = feature;
          const { x, y } = iconMap[shape as string] || { x: -64, y: -64 }; // 非画布区域，默认的图标改为透明
          return [x, y];
        },
      },
    });
  }

  private updateTexture = () => {
    const { createTexture2D } = this.rendererService;
    if (this.texture) {
      this.texture.update({
        data: this.iconService.getCanvas(),
        mag: 'linear',
        min: 'linear mipmap nearest',
        mipmap: true,
      });
      // 更新完纹理后在更新的图层的时候需要更新所有的图层
      // this.layer.layerModelNeedUpdate = true;
      setTimeout(() => {
        // 延迟渲染
        this.layerService.throttleRenderLayers();
      });

      return;
    }
    this.texture = createTexture2D({
      data: this.iconService.getCanvas(),
      mag: gl.LINEAR,
      min: gl.LINEAR_MIPMAP_LINEAR,
      premultiplyAlpha: false,
      width: 1024,
      height: this.iconService.canvasHeight || 128,
      mipmap: true,
    });
  };
}
