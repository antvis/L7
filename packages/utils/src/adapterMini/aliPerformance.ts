export default {
  mark: (mark: string) => null,
  clearMeasures: (measure: string) => null,
  clearMarks: (mark: string) => null,
  measure: (mark: string, create: string, load: string) => {
    return {
      duration: 0,
    };
  },
};
