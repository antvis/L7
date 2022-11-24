import {
  AttributeType,
  gl,
  IEncodeFeature,
  IModel,
  IModelUniform,
  ITexture2D,
} from '@antv/l7-core';
import {
  calculateCentroid,
  padBounds,
  rgb2arr
} from '@antv/l7-utils';
import { isNumber } from 'lodash';
import BaseModel from '../../core/BaseModel';
import { IPointLayerStyleOptions } from '../../core/interface';
import CollisionIndex from '../../utils/collision-index';
import {
  getGlyphQuads,
  IGlyphQuad,
  shapeText,
} from '../../utils/symbol-layout';
import text_frag from '../shaders/tile/text_frag.glsl';
import text_vert from '../shaders/tile/text_vert.glsl';
import text_map_frag from '../shaders/tile/text_map_frag.glsl';
import text_map_vert from '../shaders/tile/text_map_vert.glsl';

export function TextTriangulation(feature: IEncodeFeature) {
  // @ts-ignore
  const that = this as TextModel;
  const id = feature.id as number;
  const vertices: number[] = [];
  const indices: number[] = [];

  if (!that.glyphInfoMap || !that.glyphInfoMap[id]) {
    return {
      vertices: [], // [ x, y, z, tex.x,tex.y, offset.x. offset.y]
      indices: [],
      size: 7,
    };
  }
  const centroid = that.glyphInfoMap[id].centroid as number[]; // 计算中心点
  const coord =
    centroid.length === 2 ? [centroid[0], centroid[1], 0] : centroid;
  that.glyphInfoMap[id].glyphQuads.forEach(
    (quad: IGlyphQuad, index: number) => {
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
    },
  );
  return {
    vertices, // [ x, y, z, tex.x,tex.y, offset.x. offset.y]
    indices,
    size: 7,
  };
}
export default class TextModel extends BaseModel {
  public glyphInfo: IEncodeFeature[];
  public glyphInfoMap: {
    [key: string]: {
      shaping: any;
      glyphQuads: IGlyphQuad[];
      centroid: number[];
    };
  } = {};
  private texture: ITexture2D;
  private currentZoom: number = -1;
  private extent: [[number, number], [number, number]];
  private textureHeight: number = 0;
  private textCount: number = 0;
  private preTextStyle: Partial<IPointLayerStyleOptions> = {};
  public getUninforms(): IModelUniform {
    const {
      opacity = 1.0,
      stroke = '#fff',
      strokeWidth = 0,
      textAnchor = 'center',
      textAllowOverlap = false,
      halo = 0.5,
      gamma = 2.0,
      usage,
      color = '#fff',
      size = 1
    } = this.layer.getLayerConfig() as IPointLayerStyleOptions;
    const { canvas, mapping } = this.fontService;
    if (Object.keys(mapping).length !== this.textCount) {
      this.updateTexture();
      this.textCount = Object.keys(mapping).length;
    }
    this.preTextStyle = {
      textAnchor,
      textAllowOverlap,
    };

    return {
      u_opacity: isNumber(opacity) ? opacity : 1.0,
      u_stroke_width: isNumber(strokeWidth) ? strokeWidth : 1.0,
      u_stroke_color: this.getStrokeColor(stroke),

      u_sdf_map: this.texture,
      u_halo_blur: halo,
      u_gamma_scale: gamma,
      u_sdf_map_size: [canvas.width, canvas.height],

      u_color: usage === 'basemap' ? rgb2arr(color): [0, 0, 0, 0],
      u_size: usage === 'basemap' ? size : 1
    };
  }

  public async initModels():Promise<IModel[]>  {
    this.extent = this.textExtent();
    const {
      textAnchor = 'center',
      textAllowOverlap = true,
    } = this.layer.getLayerConfig() as IPointLayerStyleOptions;
    this.preTextStyle = {
      textAnchor,
      textAllowOverlap,
    };
    return await this.buildModels();
  }

  public async buildModels ():Promise<IModel[]> {
    this.mapping();
    const { usage } = this.layer.getLayerConfig();
       const model = await this.layer
      .buildLayerModel({
        moduleName: 'pointTileText_' + usage,
        vertexShader: usage === 'basemap' ? text_map_vert : text_vert,
        fragmentShader: usage === 'basemap' ? text_map_frag : text_frag,
        triangulation: TextTriangulation.bind(this),
        depth: { enable: false },
        blend: this.getBlend(),
        pick: usage !== 'basemap'
      })
      return [model]

  }

  public clearModels() {
    this.texture?.destroy();
  }
  protected registerBuiltinAttributes() {
    const { usage } = this.layer.getLayerConfig();
    this.styleAttributeService.registerStyleAttribute({
      name: 'textOffsets',
      type: AttributeType.Attribute,
      descriptor: {
        name: 'a_textOffsets',
        buffer: {
          usage: gl.STATIC_DRAW,
          data: [],
          type: gl.FLOAT,
        },
        size: 2,
        update: (
          feature: IEncodeFeature,
          featureIdx: number,
          vertex: number[],
        ) => {
          return [vertex[5], vertex[6]];
        },
      },
    });

    if(usage !== 'basemap') {
      this.styleAttributeService.registerStyleAttribute({
        name: 'size',
        type: AttributeType.Attribute,
        descriptor: {
          name: 'a_Size',
          buffer: {
            usage: gl.DYNAMIC_DRAW,
            data: [],
            type: gl.FLOAT,
          },
          size: 1,
          update: (
            feature: IEncodeFeature,
          ) => {
            const { size = 12 } = feature;
            return Array.isArray(size) ? [size[0]] : [size as number];
          },
        },
      });
    }
    
    this.styleAttributeService.registerStyleAttribute({
      name: 'textUv',
      type: AttributeType.Attribute,
      descriptor: {
        name: 'a_tex',
        buffer: {
          usage: gl.DYNAMIC_DRAW,
          data: [],
          type: gl.FLOAT,
        },
        size: 2,
        update: (
          feature: IEncodeFeature,
          featureIdx: number,
          vertex: number[],
        ) => {
          return [vertex[3], vertex[4]];
        },
      },
    });
  }

  private mapping = () => {
    this.initGlyph();
    this.updateTexture();
    this.filterGlyphs();
    this.reBuildModel();
  };
  private textExtent(): [[number, number], [number, number]] {
    const bounds = this.mapService.getBounds();
    return padBounds(bounds, 0.5);
  }
  /**
   * 生成文字纹理（生成文字纹理字典）
   */
  private initTextFont() {
    const {
      fontWeight = '400',
      fontFamily = 'sans-serif',
    } = this.layer.getLayerConfig() as IPointLayerStyleOptions;
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
      iconfont: false,
    });
  }

  /**
   * 生成文字布局（对照文字纹理字典提取对应文字的位置很好信息）
   */
  private generateGlyphLayout() {
    const { mapping } = this.fontService;
    const {
      spacing = 2,
      textAnchor = 'center',
    } = this.layer.getLayerConfig() as IPointLayerStyleOptions;
    const data = this.layer.getEncodedData();

    this.glyphInfo = data.map((feature: IEncodeFeature) => {
      const { shape = '', id, size = 1, textOffset = [0, 0] } = feature;

      const shaping = shapeText(
        shape.toString(),
        mapping,
        // @ts-ignore
        size,
        textAnchor,
        'left',
        spacing,
        textOffset,
        false,
      );
      const glyphQuads = getGlyphQuads(shaping, textOffset, false);
      feature.shaping = shaping;
      feature.glyphQuads = glyphQuads;

      feature.centroid = calculateCentroid(feature.coordinates);

      // 此时地图高德2.0 originCentroid == centroid
      feature.originCentroid =
        feature.version === 'GAODE2.x'
          ? calculateCentroid(feature.originCoordinates)
          : (feature.originCentroid = feature.centroid);

      this.glyphInfoMap[id as number] = {
        shaping,
        glyphQuads,
        centroid: calculateCentroid(feature.coordinates),
      };
      return feature;
    });
  }
  /**
   * 文字避让 depend on originCentorid
   */
  private filterGlyphs() {
    const {
      padding = [4, 4],
      textAllowOverlap = false,
    } = this.layer.getLayerConfig() as IPointLayerStyleOptions;
    if (textAllowOverlap) {
      // 如果允许文本覆盖
      return;
    }
    this.glyphInfoMap = {};
    this.currentZoom = this.mapService.getZoom();
    this.extent = this.textExtent();
    const { width, height } = this.rendererService.getViewportSize();
    const collisionIndex = new CollisionIndex(width, height);
    const filterData = this.glyphInfo.filter((feature: IEncodeFeature) => {
      const { shaping, id = 0 } = feature;
      const centroid = (feature.version === 'GAODE2.x'
        ? feature.originCentroid
        : feature.centroid) as [number, number];
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
        collisionIndex.insertCollisionBox(box, id);
        return true;
      } else {
        return false;
      }
    });
    filterData.forEach((item) => {
      // @ts-ignore
      this.glyphInfoMap[item.id as number] = item;
    });
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
    this.textureHeight = canvas.height;
    if (this.texture) {
      this.texture.destroy();
    }

    this.texture = createTexture2D({
      data: canvas,
      mag: gl.LINEAR,
      min: gl.LINEAR,
      width: canvas.width,
      height: canvas.height,
    });
  }

  private async reBuildModel() {
    const { usage } = this.layer.getLayerConfig();
    
    this.filterGlyphs();
       const model = await this.layer
      .buildLayerModel({
        moduleName: 'pointTileText_' + usage,
        vertexShader: usage === 'basemap' ? text_map_vert : text_vert,
        fragmentShader: usage === 'basemap' ? text_map_frag : text_frag,
        triangulation: TextTriangulation.bind(this),
        depth: { enable: false },
        blend: this.getBlend(),
        pick: usage !== 'basemap'
      })
      return [model]
  }
}
