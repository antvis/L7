declare module '@mapbox/tiny-sdf' {
  export default class TinySDF {
    fontSize: number;
    buffer: number;
    radius: number;
    cutoff: number;
    fontFamily: string;
    fontWeight: string;
    size: number;
    constructor(
      fontSize?: number,
      buffer?: number,
      radius?: number,
      cutoff?: number,
      fontFamily?: string,
      fontWeight?: string,
    );
    draw(char: string): number[];
  }
}
