import Tile from './Tile';
import { LineLayer,PointLayer } from '@antv/l7-layers';
export default class DebugTile extends Tile {
  public async initTileLayer(): Promise<void> {
    const sourceOptions = this.getSourceOption();
    const pointData = sourceOptions.data.features[0].properties;

    const lineLayer = new LineLayer()
      .source(sourceOptions.data, sourceOptions.options)
      .size(1)
      .shape('line')
      .color('red');
      console.log(lineLayer)
      const pointLayer = new PointLayer()
      .source([pointData],{
        parser: {
          type: 'json',
          x: 'textLng',
          y: 'textLat',
        }
  
      })
      .size(20)
      .color('red')
      .shape(this.key)
      .style({
        stroke: '#fff',
        strokeWidth: 2
      });
    
    await this.addLayer(lineLayer);
    await this.addLayer(pointLayer);
    
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
        },
        transforms: rawSource.transforms,
      },
    };
  }
}
