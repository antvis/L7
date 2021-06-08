export enum lineStyleType {
  'solid' = 0.0,
  'dash' = 1.0,
}

export interface ILineLayerStyleOptions {
  opacity: number;
  lineType?: keyof typeof lineStyleType;
  dashArray?: [number, number];
  segmentNumber: number;
  forward?: boolean;
  lineTexture?: boolean;
  iconStep?: number;
  textureBlend?: string; // 可选参数、供给纹理贴图使用
}
