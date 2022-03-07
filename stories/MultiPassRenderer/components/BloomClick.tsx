import { PolygonLayer, PointLayer, Scene } from '@antv/l7';
import { Mapbox } from '@antv/l7-maps';
import * as dat from 'dat.gui';
import * as React from 'react';

export default class Bloom extends React.Component {
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
    const data = await response.json();
    const scene = new Scene({
      id: 'map',
      map: new Mapbox({
        style: 'mapbox://styles/mapbox/streets-v9',
        // style: 'blank',
        center: [122, 30],
        pitch: 0,
        zoom: 3,
      }),
    });
    // @ts-ignore
    let selectLayer = null;
    for (let i = 0; i < 10; i++) {
      let pointLayer = new PointLayer({
        zIndex: 1,
        enableMultiPassRenderer: false,
        passes: [
          [
            'bloom',
            {
              bloomBaseRadio: 0.95,
              bloomRadius: 4,
              bloomIntensity: 1.1,
            },
          ],
        ],
      })
        .source(
          [{ lng: 120 + Math.random() * 10, lat: 20 + Math.random() * 10 }],
          {
            parser: {
              type: 'json',
              x: 'lng',
              y: 'lat',
            },
          },
        )
        .shape('circle')
        .size(20)
        .color('red');
      scene.addLayer(pointLayer);
    }

    scene.on('loaded', () => {
      scene.getLayers().map((layer) => {
        layer.on('click', () => {
          // @ts-ignore
          if (selectLayer) {
            // @ts-ignore
            selectLayer.setMultiPass(false);
          }
          selectLayer = layer;

          layer.setMultiPass(true);
        });
      });
    });

    this.scene = scene;
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
