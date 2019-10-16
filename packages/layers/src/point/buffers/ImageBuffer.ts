import BaseBuffer, { IEncodeFeature, Position } from '../../core/BaseBuffer';
export default class ImageBuffer extends BaseBuffer {
  protected calculateFeatures() {
    const layerData = this.data as IEncodeFeature[];
    this.verticesCount = layerData.length;
    this.indexCount = layerData.length;
  }
  protected buildFeatures() {
    const layerData = this.data as IEncodeFeature[];
    this.attributes.uv = new Float32Array(this.verticesCount * 2);
    layerData.forEach((item: IEncodeFeature, index: number) => {
      const { color = [0, 0, 0, 0], size, id, shape, coordinates } = item;
      const { x, y } = this.iconMap[shape as string] || { x: 0, y: 0 };
      const coor = coordinates as Position;
      this.attributes.positions.set(coor, index * 3);
      this.attributes.colors.set(color, index * 4);
      this.attributes.pickingIds.set([id as number], index);
      this.attributes.sizes.set([size as number], index); //
      this.attributes.uv.set([x, y], index * 2);
    });
  }
}
