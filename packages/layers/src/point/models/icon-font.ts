import {
  AttributeType,
  gl,
  IEncodeFeature,
  IModel,
  IModelUniform,
  ITexture2D,
} from '@antv/l7-core';

import BaseModel from '../../core/BaseModel';
import { PointImageTriangulation } from '../../core/triangulation';
import pointImageFrag from '../shaders/image_frag.glsl';
import pointImageVert from '../shaders/image_vert.glsl';
interface IIconIFontStyleOptions {
  opacity: number;
  fontWeight: string;
  fontFamily: string;
}

export default class IconeModel extends BaseModel {
  private texture: ITexture2D;

  public getUninforms(): IModelUniform {
    const { opacity } = this.layer.getLayerConfig() as IIconIFontStyleOptions;
    return {
      u_opacity: opacity || 1.0,
      u_texture: this.texture,
      u_textSize: [1024, this.iconService.canvasHeight || 128],
    };
  }

  public initModels(): IModel[] {
    this.initIconFontGlyphs();
    this.registerBuiltinAttributes();
    this.updateTexture();
    this.iconService.on('imageUpdate', () => {
      this.updateTexture();
      this.layer.render(); // TODO 调用全局render
    });
    return [
      this.layer.buildLayerModel({
        moduleName: 'pointiconImage',
        vertexShader: pointImageVert,
        fragmentShader: pointImageFrag,
        triangulation: PointImageTriangulation,
        primitive: gl.POINTS,
        depth: { enable: false },
        blend: this.getBlend(),
      }),
    ];
  }

  public clearModels() {
    this.dataTexture?.destroy();
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
          const { mapping } = this.fontService;
          const { shape } = feature;
          const icon = this.fontService.getGlyph(shape as string);
          const { x, y } = mapping[icon];
          return [x, y];
        },
      },
    });
  }

  private updateTexture() {
    const { createTexture2D } = this.rendererService;
    const { canvas } = this.fontService;
    this.texture = createTexture2D({
      data: canvas,
      mag: gl.LINEAR,
      min: gl.LINEAR,
      width: canvas.width,
      height: canvas.height,
    });
  }

  private initIconFontGlyphs() {
    const {
      fontWeight = 'normal',
      fontFamily = 'sans-serif',
    } = this.layer.getLayerConfig() as IIconIFontStyleOptions;
    const data = this.layer.getEncodedData();
    const characterSet: string[] = [];
    data.forEach((item: IEncodeFeature) => {
      let { shape = '' } = item;
      shape = shape.toString();
      const icon = this.fontService.getGlyph(shape);
      if (characterSet.indexOf(icon) === -1) {
        characterSet.push(icon);
      }
    });
    this.fontService.setFontOptions({
      characterSet,
      fontWeight,
      fontFamily,
      fontSize: 48,
    });
  }
}
