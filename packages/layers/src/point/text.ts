import { AttributeType, gl, IEncodeFeature } from '@antv/l7-core';
import BaseLayer from '../core/BaseLayer';
import { getGlyphQuads, shapeText } from '../utils/symbol-layout';
import textFrag from './shaders/text_frag.glsl';
import textVert from './shaders/text_vert.glsl';
interface IPointTextLayerStyleOptions {
  opacity: number;
  textAnchor: string;
  textOffset: [number, number];
  spacing: number;
  padding: [number, number];
  stroke: string;
  strokeWidth: number;
  strokeOpacity: number;
  fontWeight: string;
  fontFamily: string;

  textAllowOverlap: boolean;
}
export function PointTriangulation(feature: IEncodeFeature) {
  const coordinates = feature.coordinates as number[];
  return {
    vertices: [...coordinates, ...coordinates, ...coordinates, ...coordinates],
    indices: [0, 1, 2, 2, 3, 0],
    size: coordinates.length,
  };
}
export default class TextLayer extends BaseLayer<IPointTextLayerStyleOptions> {
  public name: string = 'PointLayer';

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
    this.models.forEach((model) =>
      model.draw({
        uniforms: {
          u_opacity: opacity || 1.0,
        },
      }),
    );
    return this;
  }

  protected buildModels() {
    this.registerBuiltinAttributes();
    this.models = [
      this.buildLayerModel({
        moduleName: 'pointText',
        vertexShader: textVert,
        fragmentShader: textFrag,
        triangulation: PointTriangulation,
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
          const extrude = [-1, -1, 1, -1, 1, 1, -1, 1];
          const extrudeIndex = (attributeIdx % 4) * 2;
          return [extrude[extrudeIndex], extrude[extrudeIndex + 1]];
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
      name: 'shape',
      type: AttributeType.Attribute,
      descriptor: {
        name: 'a_Shape',
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
          const { shape = 2 } = feature;
          const shape2d = this.configService.getConfig().shape2d as string[];
          const shapeIndex = shape2d.indexOf(shape as string);
          return [shapeIndex];
        },
      },
    });
  }

  private initTextFont() {
    const { fontWeight = 'normal', fontFamily } = this.getStyleOptions();
    const data = this.getEncodedData();
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
}
