import {
  AttributeType,
  BlendType,
  gl,
  IEncodeFeature,
  ILayer,
  ILayerConfig,
  IModel,
  IModelUniform,
  ITexture2D,
} from '@antv/l7-core';
import { rgb2arr } from '@antv/l7-utils';
import BaseModel from '../../core/BaseModel';
import CollisionIndex from '../../utils/collision-index';
import { calculteCentroid } from '../../utils/geo';
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
  const centroid = feature.centroid as number[]; // 计算中心点
  const { glyphQuads } = feature;
  const vertices: number[] = [];
  const indices: number[] = [];
  const coord =
    centroid.length === 2 ? [centroid[0], centroid[1], 0] : centroid;
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
  private glyphInfo: IEncodeFeature[];
  private currentZoom: number = -1;
  private extent: [[number, number], [number, number]];

  public getUninforms(): IModelUniform {
    const {
      fontWeight = 800,
      fontFamily = 'sans-serif',
      stroke = '#fff',
      strokeWidth = 0,
    } = this.layer.getLayerConfig() as IPointTextLayerStyleOptions;
    const { canvas } = this.fontService;
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
    this.extent = this.textExtent();
    this.initGlyph();
    this.updateTexture();
    this.filterGlyphs();
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
  public needUpdate() {
    const {
      textAllowOverlap = false,
    } = this.layer.getLayerConfig() as IPointTextLayerStyleOptions;
    const zoom = this.mapService.getZoom();
    const extent = this.mapService.getBounds();
    const flag =
      extent[0][0] < this.extent[0][0] ||
      extent[0][1] < this.extent[0][1] ||
      extent[1][0] > this.extent[1][0] ||
      extent[1][1] < this.extent[1][1];

    if (!textAllowOverlap && (Math.abs(this.currentZoom - zoom) > 1 || flag)) {
      this.filterGlyphs();
      this.layer.models = [
        this.layer.buildLayerModel({
          moduleName: 'pointText',
          vertexShader: textVert,
          fragmentShader: textFrag,
          triangulation: TextTriangulation,
          depth: { enable: false },
          blend: this.getBlend(),
        }),
      ];
      return true;
    }
    return false;
  }

  protected registerBuiltinAttributes() {
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
  private textExtent(): [[number, number], [number, number]] {
    const bounds = this.mapService.getBounds();
    const step =
      Math.min(bounds[1][0] - bounds[0][0], bounds[1][1] - bounds[1][0]) / 2;
    return [
      [bounds[0][0] - step, bounds[0][1] - step],
      [bounds[1][0] + step, bounds[1][1] + step],
    ];
  }
  /**
   * 生成文字纹理
   */
  private initTextFont() {
    const {
      fontWeight = '800',
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
  /**
   * 生成文字布局
   */
  private generateGlyphLayout() {
    const { mapping } = this.fontService;
    const {
      spacing = 2,
      textAnchor = 'center',
      textOffset,
    } = this.layer.getLayerConfig() as IPointTextLayerStyleOptions;
    const data = this.layer.getEncodedData();
    this.glyphInfo = data.map((feature: IEncodeFeature) => {
      const { shape = '', coordinates } = feature;
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
      feature.centroid = calculteCentroid(coordinates);
      return feature;
    });
  }
  /**
   * 文字避让
   */
  private filterGlyphs() {
    const {
      padding = [4, 4],
      textAllowOverlap = false,
    } = this.layer.getLayerConfig() as IPointTextLayerStyleOptions;
    if (textAllowOverlap) {
      return;
    }
    this.currentZoom = this.mapService.getZoom();
    this.extent = this.textExtent();
    const { width, height } = this.rendererService.getViewportSize();
    const collisionIndex = new CollisionIndex(width, height);
    const filterData = this.glyphInfo.filter((feature: IEncodeFeature) => {
      const { shaping, id = 0 } = feature;
      const centroid = feature.centroid as [number, number];
      const size = feature.size as number;
      const fontScale: number = size / 24;
      const pixels = this.mapService.lngLatToContainer(centroid);
      const { box } = collisionIndex.placeCollisionBox({
        x1: shaping.left * fontScale - padding[0],
        x2: shaping.right * fontScale + padding[0],
        y1: shaping.top * fontScale - padding[1],
        y2: shaping.bottom * fontScale + padding[1],
        anchorPointX: pixels.x,
        anchorPointY: pixels.y,
      });
      if (box && box.length) {
        // TODO：featureIndex
        collisionIndex.insertCollisionBox(box, id);
        return true;
      } else {
        return false;
      }
    });
    this.layer.setEncodedData(filterData);
  }
  /**
   * 初始化文字布局
   */
  private initGlyph() {
    // 1.生成文字纹理
    this.initTextFont();
    // 2.生成文字布局
    this.generateGlyphLayout();
  }
  /**
   * 更新文字纹理
   */
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
