import type {
  IEncodeFeature,
  IFontMapping,
  IModel,
  IModelUniform,
  ITexture2D,
} from '@antv/l7-core';
import { AttributeType, gl } from '@antv/l7-core';
import { boundsContains, calculateCentroid, lodashUtil, padBounds, rgb2arr } from '@antv/l7-utils';
import BaseModel from '../../core/BaseModel';
import type { IPointLayerStyleOptions } from '../../core/interface';
import CollisionIndex from '../../utils/collision-index';
import type { IGlyphQuad } from '../../utils/symbol-layout';
import { getGlyphQuads, shapeText } from '../../utils/symbol-layout';
import textFrag from '../shaders/text/text_frag.glsl';
import textVert from '../shaders/text/text_vert.glsl';
const { isEqual } = lodashUtil;

const TEXT_BACKGROUND_SHAPE: Record<string, number> = {
  rect: 0,
  circle: 1,
  'circle-rect': 2,
};

interface ITextBackgroundQuad {
  tl: { x: number; y: number };
  tr: { x: number; y: number };
  br: { x: number; y: number };
  bl: { x: number; y: number };
  size: [number, number];
}

interface ITextRenderInfo {
  shaping: any;
  glyphQuads: IGlyphQuad[];
  backgroundQuad?: ITextBackgroundQuad;
  centroid: number[];
}

function normalizePadding(padding: number | [number, number] = [0, 0]): [number, number] {
  return Array.isArray(padding) ? padding : [padding, padding];
}

function hasBackground(backgroundColor?: string) {
  return rgb2arr(backgroundColor || '')[3] > 0;
}

function getBackgroundQuad(
  glyphQuads: IGlyphQuad[],
  backgroundPadding: [number, number],
  backgroundShape: 'rect' | 'circle' | 'circle-rect',
): ITextBackgroundQuad {
  const x1Bounds = Math.min(...glyphQuads.map((quad) => Math.min(quad.tl.x, quad.bl.x)));
  const y1Bounds = Math.min(...glyphQuads.map((quad) => Math.min(quad.tl.y, quad.tr.y)));
  const x2Bounds = Math.max(...glyphQuads.map((quad) => Math.max(quad.tr.x, quad.br.x)));
  const y2Bounds = Math.max(...glyphQuads.map((quad) => Math.max(quad.bl.y, quad.br.y)));

  let x1 = x1Bounds - backgroundPadding[0];
  let y1 = y1Bounds - backgroundPadding[1];
  let x2 = x2Bounds + backgroundPadding[0];
  let y2 = y2Bounds + backgroundPadding[1];

  if (backgroundShape === 'circle') {
    const centerX = (x1 + x2) / 2;
    const centerY = (y1 + y2) / 2;
    const diameter = Math.max(x2 - x1, y2 - y1);
    x1 = centerX - diameter / 2;
    x2 = centerX + diameter / 2;
    y1 = centerY - diameter / 2;
    y2 = centerY + diameter / 2;
  }

  return {
    tl: { x: x1, y: y1 },
    tr: { x: x2, y: y1 },
    br: { x: x2, y: y2 },
    bl: { x: x1, y: y2 },
    size: [x2 - x1, y2 - y1],
  };
}

export function TextTrianglation(this: TextModel, feature: IEncodeFeature) {
  return buildTextTriangles.call(this, feature, 'all');
}

export function TextBackgroundTrianglation(this: TextModel, feature: IEncodeFeature) {
  return buildTextTriangles.call(this, feature, 'background');
}

export function TextGlyphTrianglation(this: TextModel, feature: IEncodeFeature) {
  return buildTextTriangles.call(this, feature, 'glyph');
}

function buildTextTriangles(
  this: TextModel,
  feature: IEncodeFeature,
  mode: 'all' | 'background' | 'glyph',
) {
  // @ts-ignore
  const that = this as TextModel;
  const id = feature.id as number;
  const vertices: number[] = [];
  const indices: number[] = [];
  const pushQuad = (
    quad:
      | IGlyphQuad
      | (ITextBackgroundQuad & {
          tex?: { x: number; y: number; width: number; height: number };
          quadType: number;
        }),
    index: number,
    coord: number[],
  ) => {
    const baseIndex = index * 4;
    const tex = 'tex' in quad && quad.tex ? quad.tex : { x: 0, y: 0, width: 0, height: 0 };
    const bgUV =
      'quadType' in quad && quad.quadType > 0
        ? [
            [0, 0],
            [1, 0],
            [1, 1],
            [0, 1],
          ]
        : [
            [0, 0],
            [0, 0],
            [0, 0],
            [0, 0],
          ];
    const bgSize = 'size' in quad ? quad.size : [0, 0];
    const quadType = 'quadType' in quad ? quad.quadType : 0;

    vertices.push(
      ...coord,
      tex.x,
      tex.y + tex.height,
      quad.tl.x,
      quad.tl.y,
      quadType,
      bgUV[0][0],
      bgUV[0][1],
      bgSize[0],
      bgSize[1],
      ...coord,
      tex.x + tex.width,
      tex.y + tex.height,
      quad.tr.x,
      quad.tr.y,
      quadType,
      bgUV[1][0],
      bgUV[1][1],
      bgSize[0],
      bgSize[1],
      ...coord,
      tex.x + tex.width,
      tex.y,
      quad.br.x,
      quad.br.y,
      quadType,
      bgUV[2][0],
      bgUV[2][1],
      bgSize[0],
      bgSize[1],
      ...coord,
      tex.x,
      tex.y,
      quad.bl.x,
      quad.bl.y,
      quadType,
      bgUV[3][0],
      bgUV[3][1],
      bgSize[0],
      bgSize[1],
    );
    indices.push(baseIndex, baseIndex + 1, baseIndex + 2, baseIndex + 2, baseIndex + 3, baseIndex);
  };

  if (!that.glyphInfoMap || !that.glyphInfoMap[id]) {
    return {
      vertices: [], // [ x, y, z, tex.x,tex.y, offset.x. offset.y]
      indices: [],
      size: 12,
    };
  }
  const textRenderInfo = that.glyphInfoMap[id] as ITextRenderInfo;
  const centroid = textRenderInfo.centroid as number[]; // 计算中心点
  const coord = centroid.length === 2 ? [centroid[0], centroid[1], 0] : centroid;
  let quadIndex = 0;
  if (mode !== 'glyph' && textRenderInfo.backgroundQuad) {
    pushQuad({ ...textRenderInfo.backgroundQuad, quadType: 1 }, quadIndex, coord);
    quadIndex += 1;
  }

  if (mode !== 'background') {
    textRenderInfo.glyphQuads.forEach((quad: IGlyphQuad) => {
      pushQuad(quad, quadIndex, coord);
      quadIndex += 1;
    });
  }
  return {
    vertices, // [ x, y, z, tex.x,tex.y, offset.x. offset.y]
    indices,
    size: 12,
  };
}

export default class TextModel extends BaseModel {
  protected get attributeLocation() {
    return Object.assign(super.attributeLocation, {
      MAX: super.attributeLocation.MAX,
      SIZE: 9,
      TEXT_OFFSETS: 10,
      UV: 11,
      TEXT_QUAD_TYPE: 12,
      TEXT_BACKGROUND_UV: 13,
      TEXT_BACKGROUND_SIZE: 14,
    });
  }

  public glyphInfo: IEncodeFeature[];
  public glyphInfoMap: {
    [key: string]: ITextRenderInfo;
  } = {};
  private rawEncodeData: IEncodeFeature[];
  private texture: ITexture2D;
  private currentZoom: number = -1;
  private extent: [[number, number], [number, number]];
  private textureHeight: number = 0;
  private textCount: number = 0;
  private preTextStyle: Partial<IPointLayerStyleOptions> = {};
  public getUninforms(): IModelUniform {
    const commoninfo = this.getCommonUniformsInfo();
    const attributeInfo = this.getUniformsBufferInfo(this.getStyleAttribute());
    this.updateStyleUnifoms();
    return {
      ...commoninfo.uniformsOption,
      ...attributeInfo.uniformsOption,
      ...{ u_sdf_map: this.textures[0] },
    };
  }
  protected getCommonUniformsInfo(): {
    uniformsArray: number[];
    uniformsLength: number;
    uniformsOption: { [key: string]: any };
  } {
    const {
      stroke = '#fff',
      strokeOpacity = 1,
      strokeWidth = 0,
      backgroundColor = 'rgba(0, 0, 0, 0)',
      backgroundRadius = 0,
      backgroundShape = 'rect',
      halo = 0.5,
      gamma = 2.0,
      raisingHeight = 0,
    } = this.layer.getLayerConfig() as IPointLayerStyleOptions;
    const mapping = this.getFontServiceMapping();
    const canvas = this.getFontServiceCanvas();
    if (mapping && Object.keys(mapping).length !== this.textCount && canvas) {
      this.updateTexture();
      this.textCount = Object.keys(mapping).length;
    }

    this.preTextStyle = this.getTextStyle();

    const strokeColor = rgb2arr(stroke);
    const bgColor = rgb2arr(backgroundColor);
    const commonOptions = {
      u_stroke_color: [
        strokeColor[0],
        strokeColor[1],
        strokeColor[2],
        strokeColor[3] * strokeOpacity,
      ],
      u_background_color: bgColor,
      u_sdf_map_size: [canvas?.width || 1, canvas?.height || 1],
      u_raisingHeight: Number(raisingHeight),
      u_stroke_width: strokeWidth,
      u_background_radius: backgroundRadius,
      u_background_shape: TEXT_BACKGROUND_SHAPE[backgroundShape] ?? TEXT_BACKGROUND_SHAPE.rect,
      u_gamma_scale: gamma,
      u_halo_blur: halo,
    };
    const commonBufferInfo = this.getUniformsBufferInfo(commonOptions);
    return commonBufferInfo;
  }

  public async initModels(): Promise<IModel[]> {
    // 绑定事件
    this.bindEvent();
    this.extent = this.textExtent();
    this.rawEncodeData = this.layer.getEncodedData();
    this.preTextStyle = this.getTextStyle();
    this.initUniformsBuffer();
    return this.buildModels();
  }

  public async buildModels(): Promise<IModel[]> {
    const { textAllowOverlap = false, backgroundColor } =
      this.layer.getLayerConfig() as IPointLayerStyleOptions;

    //  this.mapping(); 重复调用
    this.initGlyph(); //
    this.updateTexture();
    if (!textAllowOverlap) {
      this.filterGlyphs();
    }
    const textModel = await this.layer.buildLayerModel({
      moduleName: 'pointText',
      vertexShader: textVert,
      fragmentShader: textFrag,
      defines: this.getDefines(),
      inject: this.getInject(),
      triangulation: TextGlyphTrianglation.bind(this),
      depth: { enable: false },
    });

    if (!hasBackground(backgroundColor)) {
      return [textModel];
    }

    const backgroundModel = await this.layer.buildLayerModel({
      moduleName: 'pointText',
      vertexShader: textVert,
      fragmentShader: textFrag,
      defines: this.getDefines(),
      inject: this.getInject(),
      triangulation: TextBackgroundTrianglation.bind(this),
      depth: { enable: false },
    });

    return [backgroundModel, textModel];
  }
  // 需要更新的场景
  // 1. 文本偏移量发生改变
  // 2. 文本锚点发生改变
  // 3. 文本允许重叠发生改变
  // 4. 文本字体发生改变
  // 5. 文本字体粗细发生改变
  public async needUpdate(): Promise<boolean> {
    const {
      textAllowOverlap = false,
      textAnchor = 'center',
      textOffset,
      padding,
      backgroundColor,
      backgroundPadding,
      backgroundShape,
      fontFamily,
      fontWeight,
    } = this.getTextStyle() as IPointLayerStyleOptions;
    if (
      !isEqual(padding, this.preTextStyle.padding) ||
      backgroundColor !== this.preTextStyle.backgroundColor ||
      !isEqual(backgroundPadding, this.preTextStyle.backgroundPadding) ||
      backgroundShape !== this.preTextStyle.backgroundShape ||
      !isEqual(textOffset, this.preTextStyle.textOffset) ||
      !isEqual(textAnchor, this.preTextStyle.textAnchor) ||
      !isEqual(fontFamily, this.preTextStyle.fontFamily) ||
      !isEqual(fontWeight, this.preTextStyle.fontWeight)
    ) {
      await this.mapping();
      return true;
    }
    if (textAllowOverlap) {
      // 小于不做避让
      return false;
    }

    // textAllowOverlap 发生改变
    const zoom = this.mapService.getZoom();
    const extent = this.mapService.getBounds();
    const flag = boundsContains(this.extent, extent);
    // 文本不能压盖则进行过滤
    if (
      Math.abs(this.currentZoom - zoom) > 0.5 ||
      !flag ||
      textAllowOverlap !== this.preTextStyle.textAllowOverlap
    ) {
      // TODO this.mapping 数据未变化，避让
      await this.reBuildModel();
      return true;
    }

    return false;
  }

  public clearModels() {
    this.texture?.destroy();
    // TODO this.mapping
    this.layer.off('remapping', this.mapping);
  }

  protected registerBuiltinAttributes() {
    // 注册 Position 属性 64 位地位部分，经纬度数据开启双精度，避免大于 20层级以上出现数据偏移
    this.registerPosition64LowAttribute();

    this.styleAttributeService.registerStyleAttribute({
      name: 'textOffsets',
      type: AttributeType.Attribute,
      descriptor: {
        shaderLocation: this.attributeLocation.TEXT_OFFSETS,
        name: 'a_textOffsets', // 文字偏移量
        buffer: {
          // give the WebGL driver a hint that this buffer may change
          usage: gl.STATIC_DRAW,
          data: [],
          type: gl.FLOAT,
        },
        size: 2,
        update: (feature: IEncodeFeature, featureIdx: number, vertex: number[]) => {
          return [vertex[5], vertex[6]];
        },
      },
    });

    this.styleAttributeService.registerStyleAttribute({
      name: 'textUv',
      type: AttributeType.Attribute,
      descriptor: {
        name: 'a_tex',
        shaderLocation: this.attributeLocation.UV,
        buffer: {
          usage: gl.DYNAMIC_DRAW,
          data: [],
          type: gl.FLOAT,
        },
        size: 2,
        update: (feature: IEncodeFeature, featureIdx: number, vertex: number[]) => {
          return [vertex[3], vertex[4]];
        },
      },
    });

    this.styleAttributeService.registerStyleAttribute({
      name: 'textQuadType',
      type: AttributeType.Attribute,
      descriptor: {
        name: 'a_textQuadType',
        shaderLocation: this.attributeLocation.TEXT_QUAD_TYPE,
        buffer: {
          usage: gl.DYNAMIC_DRAW,
          data: [],
          type: gl.FLOAT,
        },
        size: 1,
        update: (feature: IEncodeFeature, featureIdx: number, vertex: number[]) => {
          return [vertex[7]];
        },
      },
    });

    this.styleAttributeService.registerStyleAttribute({
      name: 'textBackgroundUv',
      type: AttributeType.Attribute,
      descriptor: {
        name: 'a_backgroundUV',
        shaderLocation: this.attributeLocation.TEXT_BACKGROUND_UV,
        buffer: {
          usage: gl.DYNAMIC_DRAW,
          data: [],
          type: gl.FLOAT,
        },
        size: 2,
        update: (feature: IEncodeFeature, featureIdx: number, vertex: number[]) => {
          return [vertex[8], vertex[9]];
        },
      },
    });

    this.styleAttributeService.registerStyleAttribute({
      name: 'textBackgroundSize',
      type: AttributeType.Attribute,
      descriptor: {
        name: 'a_backgroundSize',
        shaderLocation: this.attributeLocation.TEXT_BACKGROUND_SIZE,
        buffer: {
          usage: gl.DYNAMIC_DRAW,
          data: [],
          type: gl.FLOAT,
        },
        size: 2,
        update: (feature: IEncodeFeature, featureIdx: number, vertex: number[]) => {
          return [vertex[10], vertex[11]];
        },
      },
    });

    // point layer size;
    this.styleAttributeService.registerStyleAttribute({
      name: 'size',
      type: AttributeType.Attribute,
      descriptor: {
        name: 'a_Size',
        shaderLocation: this.attributeLocation.SIZE,
        buffer: {
          // give the WebGL driver a hint that this buffer may change
          usage: gl.DYNAMIC_DRAW,
          data: [],
          type: gl.FLOAT,
        },
        size: 1,
        update: (feature: IEncodeFeature) => {
          const { size = 12 } = feature;
          return Array.isArray(size) ? [size[0]] : [size as number];
        },
      },
    });
  }

  private bindEvent() {
    if (!this.layer.isTileLayer) {
      // 重新绑定
      this.layer.on('remapping', this.mapping);
    }
  }

  private mapping = async (): Promise<void> => {
    this.rawEncodeData = this.layer.getEncodedData();
    this.initGlyph(); //
    this.updateTexture();
    await this.reBuildModel();
    this.layer.renderLayers();
  };

  private textExtent(): [[number, number], [number, number]] {
    const bounds = this.mapService.getBounds();
    return padBounds(bounds, 0.5);
  }
  /**
   * 生成文字纹理（生成文字纹理字典）
   */
  private initTextFont() {
    const { fontWeight, fontFamily } = this.getTextStyle();
    const data = this.rawEncodeData;
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
   * 生成 iconfont 纹理字典
   */
  private initIconFontTex() {
    const { fontWeight, fontFamily } = this.getTextStyle();
    const data = this.rawEncodeData;
    const characterSet: string[] = [];
    data.forEach((item: IEncodeFeature) => {
      let { shape = '' } = item;
      shape = `${shape}`;
      if (characterSet.indexOf(shape) === -1) {
        characterSet.push(shape);
      }
    });
    this.fontService.setFontOptions({
      characterSet,
      fontWeight,
      fontFamily,
      iconfont: true,
    });
  }

  private getTextStyle() {
    const {
      fontWeight = '400',
      fontFamily = 'sans-serif',
      textAllowOverlap = false,
      padding = [0, 0],
      textAnchor = 'center',
      textOffset = [0, 0],
      backgroundColor = 'rgba(0, 0, 0, 0)',
      backgroundPadding = [0, 0],
      backgroundRadius = 0,
      backgroundShape = 'rect',
      opacity = 1,
      strokeOpacity = 1,
      strokeWidth = 0,
      stroke = '#000',
    } = this.layer.getLayerConfig() as IPointLayerStyleOptions;
    return {
      fontWeight,
      fontFamily,
      textAllowOverlap,
      padding,
      backgroundColor,
      backgroundPadding: normalizePadding(backgroundPadding),
      backgroundRadius,
      backgroundShape,
      textAnchor,
      textOffset,
      opacity,
      strokeOpacity,
      strokeWidth,
      stroke,
    };
  }

  /**
   * 生成文字布局（对照文字纹理字典提取对应文字的位置很好信息）
   */
  private generateGlyphLayout(iconfont: boolean) {
    const mapping = this.getFontServiceMapping();
    const {
      spacing = 2,
      textAnchor = 'center',
      textOffset,
      backgroundColor,
      backgroundPadding = [0, 0],
      backgroundShape = 'rect',
    } = this.layer.getLayerConfig() as IPointLayerStyleOptions;
    const data = this.rawEncodeData;
    this.glyphInfo = data.map((feature: IEncodeFeature) => {
      const { shape = '', id, size = 1 } = feature;
      const offset = feature.textOffset ? feature.textOffset : textOffset || [0, 0];
      const anchor = feature.textAnchor ? feature.textAnchor : textAnchor || 'center';

      const shaping = shapeText(
        shape.toString(),
        mapping,
        // @ts-ignore
        size,
        anchor,
        'left',
        spacing,
        offset, //
        iconfont,
      );

      const glyphQuads = getGlyphQuads(shaping, offset, false);
      const backgroundQuad = hasBackground(backgroundColor)
        ? getBackgroundQuad(glyphQuads, normalizePadding(backgroundPadding), backgroundShape)
        : undefined;
      feature.shaping = shaping;
      feature.glyphQuads = glyphQuads;
      // feature.centroid = calculteCentroid(coordinates);

      feature.centroid = calculateCentroid(feature.coordinates);

      this.glyphInfoMap[id as number] = {
        shaping,
        glyphQuads,
        backgroundQuad,
        centroid: calculateCentroid(feature.coordinates),
      };
      return feature;
    });
  }

  private getFontServiceMapping(): IFontMapping {
    const { fontWeight = '400', fontFamily = 'sans-serif' } =
      this.layer.getLayerConfig() as IPointLayerStyleOptions;
    return this.fontService.getMappingByKey(`${fontFamily}_${fontWeight}`);
  }

  private getFontServiceCanvas(): HTMLCanvasElement {
    const { fontWeight = '400', fontFamily = 'sans-serif' } =
      this.layer.getLayerConfig() as IPointLayerStyleOptions;
    // 更新文字布局
    return this.fontService.getCanvasByKey(`${fontFamily}_${fontWeight}`);
  }

  /**
   * 文字避让 depend on originCentorid
   */
  private filterGlyphs() {
    const {
      padding = [0, 0],
      backgroundColor,
      backgroundPadding = [0, 0],
      textAllowOverlap = false,
    } = this.layer.getLayerConfig() as IPointLayerStyleOptions;
    if (textAllowOverlap) {
      // 如果允许文本覆盖
      return;
    }
    const collisionPadding = normalizePadding(backgroundPadding);
    const extraPadding = hasBackground(backgroundColor) ? collisionPadding : [0, 0];
    this.glyphInfoMap = {};
    this.currentZoom = this.mapService.getZoom();
    this.extent = this.textExtent();
    const { width, height } = this.rendererService.getViewportSize();
    const collisionIndex = new CollisionIndex(width, height);
    const filterData = this.glyphInfo.filter((feature: IEncodeFeature) => {
      const { shaping, id = 0 } = feature;
      const centroid = feature.centroid as [number, number];
      const size = feature.size as number;
      const fontScale: number = size / 16;
      const pixels = this.mapService.lngLatToContainer(centroid);
      const { box } = collisionIndex.placeCollisionBox({
        x1: shaping.left * fontScale - padding[0] - extraPadding[0],
        x2: shaping.right * fontScale + padding[0] + extraPadding[0],
        y1: shaping.top * fontScale - padding[1] - extraPadding[1],
        y2: shaping.bottom * fontScale + padding[1] + extraPadding[1],
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
    // this.layer.setEncodedData(filterData);
  }
  /**
   * 初始化文字布局
   */
  private initGlyph() {
    const { iconfont = false } = this.layer.getLayerConfig();
    // 1.生成文字纹理（或是生成 iconfont）
    iconfont ? this.initIconFontTex() : this.initTextFont();
    // 2.生成文字布局
    this.generateGlyphLayout(iconfont);
  }
  /**
   * 更新文字纹理
   */
  private updateTexture() {
    const { createTexture2D } = this.rendererService;
    const canvas = this.getFontServiceCanvas();
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
    this.textures = [this.texture];
  }

  private async reBuildModel() {
    const { backgroundColor } = this.layer.getLayerConfig() as IPointLayerStyleOptions;
    this.rawEncodeData = this.layer.getEncodedData();
    this.filterGlyphs();
    const textModel = await this.layer.buildLayerModel({
      moduleName: 'pointText',
      vertexShader: textVert,
      fragmentShader: textFrag,
      triangulation: TextGlyphTrianglation.bind(this),
      defines: this.getDefines(),
      inject: this.getInject(),
      depth: { enable: false },
    });

    if (!hasBackground(backgroundColor)) {
      this.layer.models = [textModel];
      return;
    }

    const backgroundModel = await this.layer.buildLayerModel({
      moduleName: 'pointText',
      vertexShader: textVert,
      fragmentShader: textFrag,
      triangulation: TextBackgroundTrianglation.bind(this),
      defines: this.getDefines(),
      inject: this.getInject(),
      depth: { enable: false },
    });
    // TODO 渲染流程待修改
    this.layer.models = [backgroundModel, textModel];
  }
}
