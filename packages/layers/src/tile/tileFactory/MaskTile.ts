import { ILayerAttributesOption } from '@antv/l7-core';
import MaskLayer from '../../mask';
import Tile from './Tile';
export default class MaskTile extends Tile {
  public async initTileLayer(): Promise<void> {
    const attributes = this.parent.getLayerAttributeConfig();
    const layerOptions = this.parent.getLayerConfig();
    
    const sourceOptions = this.getSourceOption();
    const layer = new MaskLayer({ ...layerOptions})
    .source(sourceOptions.data, sourceOptions.options);

    // 初始化数据映射
    attributes && Object.keys(attributes).forEach((type) => {
      const attr = type as keyof ILayerAttributesOption;
      // @ts-ignore
      layer[attr](attributes[attr]?.field, attributes[attr]?.values);
    });

    await this.addLayer(layer);
    this.isLoaded = true;
  }
  protected getSourceOption() {
    const rawSource = this.parent.getSource();
    const { sourceLayer, featureId } = this.parent.getLayerConfig<{
      featureId: string;
    }>();
    const features = this.sourceTile.data.layers[sourceLayer as string]
      .features;
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
