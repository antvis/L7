import BaseBuffer, { IEncodeFeature, Position } from '../../core/BaseBuffer';
interface IImageFeature extends IEncodeFeature {
  images: any[];
}
export default class ImageBuffer extends BaseBuffer {
  protected calculateFeatures() {
    const layerData = this.data as IImageFeature[];
    this.verticesCount = 4;
    this.indexCount = 6;
  }
  protected buildFeatures() {
    const layerData = this.data as IImageFeature[];
    const coordinates = layerData[0].coordinates as Position[];
    const images = layerData[0].images;
    const positions: number[] = [
      ...coordinates[0],
      0,
      coordinates[1][0],
      coordinates[0][1],
      0,
      ...coordinates[1],
      0,
      ...coordinates[0],
      0,
      ...coordinates[1],
      0,
      coordinates[0][0],
      coordinates[1][1],
      0,
    ];
    this.attributes.positions.set(positions, 0);
    this.attributes.uv.set([0, 1, 1, 1, 1, 0, 0, 1, 1, 0, 0, 0], 0);
  }
}
