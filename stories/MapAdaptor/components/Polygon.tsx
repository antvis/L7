import { PolygonLayer } from '@l7/layers';
import { Scene } from '@l7/scene';
import * as dat from 'dat.gui';
import * as React from 'react';

export default class Mapbox extends React.Component {
  private gui: dat.GUI;
  private $stats: Node;
  private scene: Scene;

  public componentWillUnmount() {
    if (this.gui) {
      this.gui.destroy();
    }
    if (this.$stats) {
      document.body.removeChild(this.$stats);
    }
    this.scene.destroy();
  }

  public async componentDidMount() {
    const response = await fetch(
      'https://gw.alipayobjects.com/os/basement_prod/d2e0e930-fd44-4fca-8872-c1037b0fee7b.json',
    );
    const data = {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'Polygon',
            coordinates: [
              [
                [108.28125, 40.17887331434696],
                [114.78515624999999, 24.367113562651262],
                [119.88281249999999, 31.952162238024975],
                [108.28125, 40.17887331434696],
              ],
            ],
          },
        },
      ],
    };
    // data.features = data.features.slice(1, 12);
    const scene = new Scene({
      id: 'map',
      type: 'mapbox',
      style: 'mapbox://styles/mapbox/streets-v9',
      center: [110.19382669582967, 50.258134],
      pitch: 0,
      zoom: 3,
    });
    const layer = new PolygonLayer({
      enableMultiPassRenderer: true,
      passes: [
        'blurH',
        [
          'blurV',
          {
            blurRadius: 8,
          },
        ],
      ],
    });

    // TODO: new GeoJSONSource()
    layer
      .source(await response.json())
      .color('name', [
        '#2E8AE6',
        '#69D1AB',
        '#DAF291',
        '#FFD591',
        '#FF7A45',
        '#CF1D49',
      ]);
    scene.addLayer(layer);
    scene.render();

    this.scene = scene;

    /*** 运行时修改样式属性 ***/
  }

  public render() {
    return (
      <div
        id="map"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
      />
    );
  }
}
