import { ILayerAttributesOption } from '@antv/l7-core';
import Tile from './Tile';
import { getTileLayer, getMaskLayer } from './util';

export default class VectorTile extends Tile {
  public async initTileLayer(): Promise<void> {
    const attributes = this.parent.getLayerAttributeConfig();
    const layerOptions = this.parent.getLayerConfig();
    const vectorLayer = getTileLayer(this.parent.type);
    const maskLayer = getMaskLayer(this.parent.type);
    layerOptions.mask = !!maskLayer;
    
    const sourceOptions = this.getSourceOption();
    const layer = new vectorLayer({...layerOptions}).source(
      sourceOptions.data,
      sourceOptions.options,
    );
   
    // 初始化数据映射
    Object.keys(attributes).forEach((type) => {
      const attr = type as keyof ILayerAttributesOption;
      // @ts-ignore
      layer[attr](attributes[attr]?.field, attributes[attr]?.values);
    });
    if (maskLayer) {
      const mask = new maskLayer({layerType: "MaskLayer"})
        .source({
          type: 'FeatureCollection',
          features: [
            this.sourceTile.bboxPolygon
          ],
        }, {
          parser: {
            type: 'geojson',
          }
        })
        // .style({
          // opacity: 0.6
        // });
      await this.addMask(layer, mask)
    }

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
          cancelExtent: true,
        },
        transforms: rawSource.transforms,
      },
    };
  }
}
