import type { ITileSource } from '../interface';
export default abstract class BaseSource implements ITileSource {
  protected x: number;
  protected y: number;
  protected z: number;
  constructor(data: any, x: number, y: number, z: number) {
    this.x = x;
    this.y = y;
    this.z = z;
  }
  public abstract getTileData(layer: string): any;
}
