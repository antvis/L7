import {
  AttributeType,
  BlendType,
  gl,
  IEncodeFeature,
  ILayerConfig,
  IModel,
  IModelUniform,
  ITexture2D,
} from '@antv/l7-core';
import { rgb2arr } from '@antv/l7-utils';
import BaseModel from '../../core/BaseModel';
import { PointFillTriangulation } from '../../core/triangulation';
import {
  getGlyphQuads,
  IGlyphQuad,
  shapeText,
} from '../../utils/symbol-layout';
import textFrag from '../shaders/text_frag.glsl';
import textVert from '../shaders/text_vert.glsl';
interface IPointTextLayerStyleOptions {
  opacity: number;
  textAnchor: string;
  spacing: number;
  padding: [number, number];
  stroke: string;
  strokeWidth: number;
  strokeOpacity: number;
  fontWeight: string;
  fontFamily: string;
  textOffset: [number, number];
  textAllowOverlap: boolean;
}
export function TextTriangulation(feature: IEncodeFeature) {
  const coordinates = feature.coordinates as number[];
  const { glyphQuads } = feature;
  const vertices: number[] = [];
  const indices: number[] = [];
  const coord =
    coordinates.length === 2
      ? [coordinates[0], coordinates[1], 0]
      : coordinates;
  glyphQuads.forEach((quad: IGlyphQuad, index: number) => {
    vertices.push(
      ...coord,
      quad.tex.x,
      quad.tex.y + quad.tex.height,
      quad.tl.x,
      quad.tl.y,
      ...coord,
      quad.tex.x + quad.tex.width,
      quad.tex.y + quad.tex.height,
      quad.tr.x,
      quad.tr.y,
      ...coord,
      quad.tex.x + quad.tex.width,
      quad.tex.y,
      quad.br.x,
      quad.br.y,
      ...coord,
      quad.tex.x,
      quad.tex.y,
      quad.bl.x,
      quad.bl.y,
    );
    indices.push(
      0 + index * 4,
      1 + index * 4,
      2 + index * 4,
      2 + index * 4,
      3 + index * 4,
      0 + index * 4,
    );
  });
  return {
    vertices, // [ x, y, z, tex.x,tex.y, offset.x. offset.y]
    indices,
    size: 7,
  };
}

export default class TextModel extends BaseModel {
  private texture: ITexture2D;
  public getUninforms(): IModelUniform {
    const {
      fontWeight = 'normal',
      fontFamily,
      stroke,
      strokeWidth,
    } = this.layer.getLayerConfig() as IPointTextLayerStyleOptions;
    const { canvas, fontAtlas, mapping } = this.fontService;
    return {
      u_opacity: 1.0,
      u_sdf_map: this.texture,
      u_stroke: rgb2arr(stroke),
      u_halo_blur: 0.5,
      u_sdf_map_size: [canvas.width, canvas.height],
      u_strokeWidth: strokeWidth,
    };
  }

  public buildModels(): IModel[] {
    this.initTextFont();
    this.generateGlyphLayout();
    this.registerBuiltinAttributes();
    this.updateTexture();
    return [
      this.layer.buildLayerModel({
        moduleName: 'pointText',
        vertexShader: textVert,
        fragmentShader: textFrag,
        triangulation: TextTriangulation,
        depth: { enable: false },
        blend: this.getBlend(),
      }),
    ];
  }

  protected registerBuiltinAttributes() {
    const viewProjection = this.cameraService.getViewProjectionMatrix();
    this.styleAttributeService.registerStyleAttribute({
      name: 'textOffsets',
      type: AttributeType.Attribute,
      descriptor: {
        name: 'a_textOffsets',
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
          return [vertex[5], vertex[6]];
        },
      },
    });

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
      name: 'textUv',
      type: AttributeType.Attribute,
      descriptor: {
        name: 'a_tex',
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
          return [vertex[3], vertex[4]];
        },
      },
    });
  }
  private initTextFont() {
    const {
      fontWeight = 'normal',
      fontFamily,
    } = this.layer.getLayerConfig() as IPointTextLayerStyleOptions;
    const data = this.layer.getEncodedData();
    const characterSet: string[] = [];
    data.forEach((item: IEncodeFeature) => {
      let { shape = '' } = item;
      shape = shape.toString();
      for (const char of shape) {
        // 去重
        if (characterSet.indexOf(char) === -1) {
          characterSet.push(char);
        }
      }
    });
    this.fontService.setFontOptions({
      characterSet,
      fontWeight,
      fontFamily,
    });
  }
  private generateGlyphLayout() {
    const { canvas, fontAtlas, mapping } = this.fontService;
    const {
      spacing = 2,
      textAnchor = 'center',
      textOffset,
      padding = [4, 4],
      textAllowOverlap,
    } = this.layer.getLayerConfig() as IPointTextLayerStyleOptions;
    const data = this.layer.getEncodedData();
    data.forEach((feature: IEncodeFeature) => {
      const { coordinates, shape = '' } = feature;
      const size = feature.size as number;
      const fontScale = size / 24;
      const shaping = shapeText(
        shape.toString(),
        mapping,
        24,
        textAnchor,
        'center',
        spacing,
        textOffset,
      );
      const glyphQuads = getGlyphQuads(shaping, textOffset, false);
      feature.shaping = shaping;
      feature.glyphQuads = glyphQuads;
    });
  }

  private drawGlyph() {
    const {
      spacing = 2,
      textAnchor = 'center',
      textOffset = [0, 0],
      padding = [4, 4],
      textAllowOverlap,
    } = this.layer.getLayerConfig() as IPointTextLayerStyleOptions;
    const viewProjection = this.cameraService.getViewProjectionMatrix();
  }
  private updateTexture() {
    const { createTexture2D } = this.rendererService;
    const { canvas } = this.fontService;
    this.texture = createTexture2D({
      data: canvas,
      width: canvas.width,
      height: canvas.height,
    });
  }
}
