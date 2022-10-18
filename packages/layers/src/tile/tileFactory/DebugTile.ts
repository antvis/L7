import Tile from './Tile';
import { LineLayer } from '@antv/l7-layers';
export default class DebugTile extends Tile {
  public async initTileLayer(): Promise<void> {
    const sourceOptions = this.getSourceOption();
    const lineLayer = new LineLayer()
      .source(sourceOptions.data, sourceOptions.options)
      .size(1)
      .shape('line')
      .color('red');
    await this.addLayer(lineLayer);
    this.isLoaded = true;
  }

  protected getSourceOption() {
    const rawSource = this.parent.getSource();
    const features = this.sourceTile.data.layers['testTile']
      .features;
    return {
      data: {
        type: 'FeatureCollection',
        features,
      },
      options: {
        parser: {
          type: 'geojson',
          cancelExtent: true,
        },
        transforms: rawSource.transforms,
      },
    };
  }
}
