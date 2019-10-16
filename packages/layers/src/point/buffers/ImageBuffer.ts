import BaseBuffer, { IEncodeFeature, Position } from '../../core/BaseBuffer';
export default class ImageBuffer extends BaseBuffer {
  protected calculateFeatures() {
    const layerData = this.data as IEncodeFeature[];
    this.verticesCount = layerData.length;
    this.indexCount = layerData.length;
  }
  protected buildFeatures() {
    const layerData = this.data as IEncodeFeature[];
    layerData.forEach((item: IEncodeFeature, index: number) => {
      const { color = [0, 0, 0, 0], size, id, shape, coordinates } = item;
      const { x, y } = this.iconMap[shape as string];
      const coor = coordinates as Position;
      this.attributes.vertices.set([coor[0], coor[1], coor[2] || 0], index * 3);
      this.attributes.colors.set(color, index * 4);
      this.attributes.pickingIds.set([id as number], index);
      this.attributes.sizes.set([size as number], index); //
      this.attributes.uv.set([x, y], index * 2);
    });
  }
}
