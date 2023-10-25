import LineLayer from '../../line';
import PointLayer from '../../point';
import Tile from './Tile';

export default class DebugTile extends Tile {
  public async initTileLayer(): Promise<void> {
    const sourceOptions = this.getSourceOption();
    const pointData = sourceOptions.data.features[0].properties;
    const lineLayer = new LineLayer()
      .source(sourceOptions.data, sourceOptions.options)
      .size(1)
      .shape('line')
      .color('red');
    const pointLayer = new PointLayer({
      minZoom: this.z - 1,
      maxZoom: this.z + 1,
      textAllowOverlap: true,
    })
      .source([pointData], {
        parser: {
          type: 'json',
          x: 'x',
          y: 'y',
        },
      })
      .size(20)
      .color('red')
      .shape(this.key)
      .style({
        stroke: '#fff',
        strokeWidth: 2,
      });

    await this.addLayer(lineLayer);
    await this.addLayer(pointLayer);

    this.isLoaded = true;
  }

  protected getSourceOption() {
    const rawSource = this.parent.getSource();
    const features = this.sourceTile.data.layers.testTile.features;
    return {
      data: {
        type: 'FeatureCollection',
        features,
      },
      options: {
        parser: {
          type: 'geojson',
        },
        transforms: rawSource.transforms,
      },
    };
  }
}
