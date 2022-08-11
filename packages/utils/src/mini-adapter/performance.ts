// @ts-nocheck
// tslint:disable
// 暂不支持
export const performance = {
  mark: (mark: string) => null,
  clearMeasures: (measure: string) => null,
  clearMarks: (mark: string) => null,
  measure: (mark: string, create: string, load: string) => {
    return {
      duration: 0,
    };
  },
  now: () => {},
};
