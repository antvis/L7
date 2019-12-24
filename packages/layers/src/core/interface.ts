export const enum lineStyleType {
  'solid' = 0.0,
  'dash' = 1.0,
}

export interface ILineLayerStyleOptions {
  opacity: number;
  lineType?: keyof typeof lineStyleType;
  dashArray?: [number, number];
  segmentNumber: number;
}

export const lineStyleObj: { [key: string]: number } = {
  solid: 0.0,
  dash: 1.0,
};
