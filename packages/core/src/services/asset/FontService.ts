import { $window, LRUCache } from '@antv/l7-utils';
import { inject, injectable } from 'inversify';
import TinySDF from 'l7-tiny-sdf';
import 'reflect-metadata';
import { buildMapping } from '../../utils/font_util';
import {
  IFontAtlas,
  IFontMapping,
  IFontMappingItem,
  IFontOptions,
  IFontService,
  IIconFontGlyph,
} from './IFontService';
export const DEFAULT_CHAR_SET = getDefaultCharacterSet();
export const DEFAULT_FONT_FAMILY = 'sans-serif';
export const DEFAULT_FONT_WEIGHT = 'normal';
export const DEFAULT_FONT_SIZE = 24;
export const DEFAULT_BUFFER = 3;
export const DEFAULT_CUTOFF = 0.25;
export const DEFAULT_RADIUS = 8;
const MAX_CANVAS_WIDTH = 1024;
const BASELINE_SCALE = 1.0;
const HEIGHT_SCALE = 1.0;
const CACHE_LIMIT = 3;
const VALID_PROPS = [
  'fontFamily',
  'fontWeight',
  'characterSet',
  'fontSize',
  'sdf',
  'buffer',
  'cutoff',
  'radius',
];

function getDefaultCharacterSet() {
  const charSet = [];
  for (let i = 32; i < 128; i++) {
    charSet.push(String.fromCharCode(i));
  }
  return charSet;
}

function setTextStyle(
  ctx: CanvasRenderingContext2D,
  fontFamily: string,
  fontSize: number,
  fontWeight: string,
) {
  ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
  ctx.fillStyle = 'black';
  ctx.textBaseline = 'middle';
  // ctx.textAlign = 'left';
}

function populateAlphaChannel(alphaChannel: number[], imageData: ImageData) {
  // populate distance value from tinySDF to image alpha channel
  for (let i = 0; i < alphaChannel.length; i++) {
    imageData.data[4 * i + 3] = alphaChannel[i];
  }
}

@injectable()
export default class FontService implements IFontService {
  public get scale() {
    return HEIGHT_SCALE;
  }

  public get canvas(): HTMLCanvasElement {
    const data = this.cache.get(this.key);
    return data && data.data;
  }

  public get mapping(): IFontMapping {
    const data = this.cache.get(this.key);
    return data && data.mapping;
  }
  public fontAtlas: IFontAtlas;

  // iconFontMap 记录用户设置的 iconfont unicode 和名称的键值关系
  public iconFontMap: Map<string, string>;
  private iconFontGlyphs: {
    [key: string]: string;
  } = {};
  private fontOptions: IFontOptions;
  private key: string;
  private cache: LRUCache = new LRUCache(CACHE_LIMIT);

  public init() {
    this.cache.clear();
    this.fontOptions = {
      fontFamily: DEFAULT_FONT_FAMILY,
      fontWeight: DEFAULT_FONT_WEIGHT,
      characterSet: DEFAULT_CHAR_SET,
      fontSize: DEFAULT_FONT_SIZE,
      buffer: DEFAULT_BUFFER,
      sdf: true,
      cutoff: DEFAULT_CUTOFF,
      radius: DEFAULT_RADIUS,
      iconfont: false,
    };
    this.key = '';
    this.iconFontMap = new Map();
  }
  public addIconGlyphs(glyphs: IIconFontGlyph[]): void {
    glyphs.forEach((glyph) => {
      this.iconFontGlyphs[glyph.name] = glyph.unicode;
    });
  }

  /**
   * 添加对 iconfont unicode 的映射
   * @param fontUnicode
   * @param name
   */
  public addIconFont(name: string, fontUnicode: string): void {
    this.iconFontMap.set(name, fontUnicode);
  }

  /**
   * 获取自定义 iconfont 别称对应的 unicode 编码，若是当前的 map 中没有对应的键值对，那么就返回原值
   * @param name
   * @returns
   */
  public getIconFontKey(name: string): string {
    return this.iconFontMap.get(name) || name;
  }

  public getGlyph(name: string): string {
    if (this.iconFontGlyphs[name]) {
      return String.fromCharCode(parseInt(this.iconFontGlyphs[name], 16));
    }
    return '';
  }

  public setFontOptions(option: Partial<IFontOptions>) {
    this.fontOptions = {
      ...this.fontOptions,
      ...option,
    };
    // const oldKey = this.key;
    this.key = this.getKey();

    const charSet = this.getNewChars(this.key, this.fontOptions.characterSet);
    const cachedFontAtlas = this.cache.get(this.key);
    if (cachedFontAtlas && charSet.length === 0) {
      // update texture with cached fontAtlas
      return;
    }
    // update fontAtlas with new settings
    const fontAtlas = this.generateFontAtlas(
      this.key,
      charSet,
      cachedFontAtlas,
    );
    this.fontAtlas = fontAtlas;

    // update cache
    this.cache.set(this.key, fontAtlas);
  }

  public destroy(): void {
    this.cache.clear();
    this.iconFontMap.clear();
  }

  private generateFontAtlas(
    key: string,
    characterSet: string[],
    cachedFontAtlas: IFontAtlas,
  ): IFontAtlas {
    const {
      fontFamily,
      fontWeight,
      fontSize,
      buffer,
      sdf,
      radius,
      cutoff,
      iconfont,
    } = this.fontOptions;
    let canvas = cachedFontAtlas && cachedFontAtlas.data;
    if (!canvas) {
      canvas = $window.document.createElement('canvas');
      canvas.width = MAX_CANVAS_WIDTH;
    }
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    setTextStyle(ctx, fontFamily, fontSize, fontWeight);

    // 1. build mapping
    const { mapping, canvasHeight, xOffset, yOffset } = buildMapping({
      getFontWidth: (char) => ctx.measureText(char).width,
      fontHeight: fontSize * HEIGHT_SCALE,
      buffer,
      characterSet,
      maxCanvasWidth: MAX_CANVAS_WIDTH,
      ...(cachedFontAtlas && {
        mapping: cachedFontAtlas.mapping,
        xOffset: cachedFontAtlas.xOffset,
        yOffset: cachedFontAtlas.yOffset,
      }),
    });

    // 2. update canvas
    // copy old canvas data to new canvas only when height changed
    // TODO safari 不能正常更新
    const copyImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    canvas.height = canvasHeight;
    ctx.putImageData(copyImageData, 0, 0);
    setTextStyle(ctx, fontFamily, fontSize, fontWeight);

    // 3. layout characters
    if (sdf) {
      const tinySDF = new TinySDF(
        fontSize,
        buffer,
        radius,
        cutoff,
        fontFamily,
        fontWeight,
      );
      // used to store distance values from tinySDF
      // tinySDF.size equals `fontSize + buffer * 2`
      const imageData = ctx.getImageData(0, 0, tinySDF.size, tinySDF.size);
      for (const char of characterSet) {
        if (iconfont) {
          // @ts-ignore
          // const icon = eval(
          //   '("' + char.replace('&#x', '\\u').replace(';', '') + '")',
          // );

          const icon = String.fromCharCode(
            parseInt(char.replace('&#x', '').replace(';', ''), 16),
          );
          const iconData = tinySDF.draw(icon);
          populateAlphaChannel(iconData, imageData);
        } else {
          populateAlphaChannel(tinySDF.draw(char), imageData);
        }
        // populateAlphaChannel(tinySDF.draw(char), imageData);

        // 考虑到描边，需要保留 sdf 的 buffer，不能像 deck.gl 一样直接减去
        ctx.putImageData(imageData, mapping[char].x, mapping[char].y);
      }
    } else {
      for (const char of characterSet) {
        ctx.fillText(
          char,
          mapping[char].x,
          mapping[char].y + fontSize * BASELINE_SCALE,
        );
      }
    }
    return {
      xOffset,
      yOffset,
      mapping,
      data: canvas,
      width: canvas.width,
      height: canvas.height,
    };
  }

  private getKey() {
    return 'key';
    const {
      fontFamily,
      fontWeight,
      fontSize,
      buffer,
      sdf,
      radius,
      cutoff,
    } = this.fontOptions;
    if (sdf) {
      return `${fontFamily} ${fontWeight} ${fontSize} ${buffer} ${radius} ${cutoff} `;
    }
    return `${fontFamily} ${fontWeight} ${fontSize} ${buffer}`;
  }

  /**
   *
   * @param key
   * @param characterSet
   * @returns
   * 若是相同的 key，那么将字符存储到同同一个字符列表中
   */
  private getNewChars(key: string, characterSet: string[]): string[] {
    const cachedFontAtlas = this.cache.get(key);
    if (!cachedFontAtlas) {
      return characterSet;
    }

    const newChars: string[] = [];
    const cachedMapping = cachedFontAtlas.mapping;
    const cachedCharSet = new Set(Object.keys(cachedMapping));
    const charSet = new Set(characterSet);
    charSet.forEach((char: string) => {
      if (!cachedCharSet.has(char)) {
        newChars.push(char);
      }
    });

    return newChars;
  }
}
