import type { ILegend, ScaleTypeName } from '@antv/l7-core';
export function rampColor2legend(
  rampColors: { type: ScaleTypeName; colors: string[]; positions: number[] },
  name: string,
): ILegend {
  return {
    type: rampColors.type,
    field: 'value',
    items: rampColors.positions.map((value: number, index: number) => {
      return {
        [name]: index >= rampColors.colors.length ? null : rampColors.colors[index],
        value,
      };
    }),
  };
}
