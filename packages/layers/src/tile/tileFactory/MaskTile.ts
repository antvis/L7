import { ILayerAttributesOption } from '@antv/l7-core';
import MaskLayer from '../../mask';
import Tile from './Tile';
export default class MaskTile extends Tile {
  public async initTileLayer(): Promise<void> {
    const attributes = this.parent.getLayerAttributeConfig();
    const layerOptions = this.getLayerOptions();

    const sourceOptions = this.getSourceOption();
    const layer = new MaskLayer({ ...layerOptions }).source(
      sourceOptions.data,
      sourceOptions.options,
    );

    // 初始化数据映射
    // tslint:disable-next-line: no-unused-expression
    attributes &&
      Object.keys(attributes).forEach((type) => {
        const attr = type as keyof ILayerAttributesOption;
        // @ts-ignore
        layer[attr](attributes[attr]?.field, attributes[attr]?.values);
      });

    await this.addLayer(layer);
    this.isLoaded = true;
  }

  public getFeatures(sourceLayer: string | undefined) {
    if (!sourceLayer) {
      return [];
    }
    const source = this.sourceTile.data;
    return source.getTileData(sourceLayer);
  }

  protected getSourceOption() {
    const rawSource = this.parent.getSource();
    const { sourceLayer, featureId } = this.parent.getLayerConfig<{
      featureId: string;
    }>();
    const features = this.getFeatures(sourceLayer);
    return {
      data: {
        type: 'FeatureCollection',
        features,
      },
      options: {
        parser: {
          type: 'geojson',
          featureId,
        },
        transforms: rawSource.transforms,
      },
    };
  }
}
