import { AttributeType, gl, IEncodeFeature, ITexture2D } from '@l7/core';
import BaseLayer from '../core/BaseLayer';
import pointImageFrag from './shaders/image_frag.glsl';
import pointImageVert from './shaders/image_vert.glsl';
interface IPointLayerStyleOptions {
  opacity: number;
}
export function PointTriangulation(feature: IEncodeFeature) {
  const coordinates = feature.coordinates as number[];
  return {
    vertices: [...coordinates, ...coordinates, ...coordinates, ...coordinates],
    extrude: [-1, -1, 1, -1, 1, 1, -1, 1],
    indices: [0, 1, 2, 2, 3, 0],
    size: coordinates.length,
  };
}
export default class PointLayer extends BaseLayer<IPointLayerStyleOptions> {
  public name: string = 'PointLayer';
  private texture: ITexture2D;
  protected getConfigSchema() {
    return {
      properties: {
        opacity: {
          type: 'number',
          minimum: 0,
          maximum: 1,
        },
      },
    };
  }

  protected renderModels() {
    const { opacity } = this.getStyleOptions();
    const { createTexture2D } = this.rendererService;
    this.models.forEach((model) =>
      model.draw({
        uniforms: {
          u_opacity: opacity || 1.0,
          u_texture: this.texture,
          u_textSize: [1024, this.iconService.canvasHeight || 128],
        },
      }),
    );

    return this;
  }

  protected buildModels() {
    this.registerBuiltinAttributes();
    this.updateTexture();
    this.iconService.on('imageUpdate', () => {
      this.updateTexture();
      this.renderModels();
    });
    this.models = [
      this.buildLayerModel({
        moduleName: 'pointImage',
        vertexShader: pointImageVert,
        fragmentShader: pointImageFrag,
        triangulation: PointTriangulation,
        primitive: gl.POINTS,
        depth: { enable: false },
        blend: {
          enable: true,
          func: {
            srcRGB: gl.SRC_ALPHA,
            srcAlpha: 1,
            dstRGB: gl.ONE_MINUS_SRC_ALPHA,
            dstAlpha: 1,
          },
        },
      }),
    ];
  }

  private registerBuiltinAttributes() {
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
        update: (
          feature: IEncodeFeature,
          featureIdx: number,
          vertex: number[],
          attributeIdx: number,
        ) => {
          const { size } = feature;
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
        update: (
          feature: IEncodeFeature,
          featureIdx: number,
          vertex: number[],
          attributeIdx: number,
        ) => {
          const iconMap = this.iconService.getIconMap();

          const { shape } = feature;
          const { x, y } = iconMap[shape as string] || { x: 0, y: 0 };
          return [x, y];
        },
      },
    });
  }
  private updateTexture() {
    const { createTexture2D } = this.rendererService;
    this.texture = createTexture2D({
      data: this.iconService.getCanvas(),
      width: 1024,
      height: this.iconService.canvasHeight || 128,
    });
  }
}
