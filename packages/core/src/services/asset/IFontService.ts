import type EventEmitter from 'eventemitter3';
export interface IFontOptions {
  fontFamily: string;
  fontWeight: string;
  characterSet: string[];
  fontSize: number;
  buffer: number;
  sdf: boolean;
  cutoff: number;
  radius: number;
  iconfont: boolean;
}
export interface IFontMappingOption {
  characterSet: string[];
  getFontWidth: (char: string, i: number) => number;
  fontHeight: number;
  buffer: number;
  maxCanvasWidth: number;
  mapping: IFontMapping;
  xOffset: number;
  yOffset: number;
}
export interface IFontMappingItem {
  x: number;
  y: number;
  width: number;
  height: number;
  advance: number;
}
export interface IFontMapping {
  [key: string]: IFontMappingItem;
  [key: number]: IFontMappingItem;
}

export interface IFontIconFontMapItem {
  [key: string]: string;
}
export interface IFontAtlas {
  xOffset: number;
  yOffset: number;
  mapping: IFontMapping;
  data: HTMLCanvasElement;
  width: number;
  height: number;
}
export interface IIconFontGlyph {
  name: string;
  unicode: string;
  [key: string]: any;
}
export interface IFontService extends EventEmitter {
  // on(event: string, fn: EventEmitter.ListenerFn, context?: any): this;
  // off(event: string, fn: EventEmitter.ListenerFn, context?: any): this;
  mapping: IFontMapping;
  iconFontMap: Map<string, string>;
  fontAtlas: IFontAtlas;
  canvas: HTMLCanvasElement;
  scale: number;
  init(): void;
  addIconGlyphs(glyphs: IIconFontGlyph[]): void;
  addIconFont(name: string, fontUnicode: string): void;
  addFontFace(fontname: string, fontpath: string): void;
  getIconFontKey(name: string): string;
  getCanvasByKey(key: string): HTMLCanvasElement;
  getMappingByKey(key: string): IFontMapping;
  getGlyph(name: string): string;
  setFontOptions(option: Partial<IFontOptions>): void;
  destroy(): void;
}
