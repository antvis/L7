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
    // scene.setBgColor('#000');
    const layer = new PolygonLayer({
      enableMultiPassRenderer: true,
      passes: [
        [
          'bloom',
          {
            bloomBaseRadio: 0.5,
            bloomRadius: 20,
            bloomIntensity: 1,
          },
        ],
      ],
    })
      .source(data)
      .size('name', [0, 10000, 50000, 30000, 100000])
      .color('name', [
        '#2E8AE6',
        '#69D1AB',
        '#DAF291',
        '#FFD591',
        '#FF7A45',
        '#CF1D49',
      ])
      .shape('fill')
      .active(true)
      .style({
        // opacity: 0.8,
      });

    scene.addLayer(layer);

    // console.log('layer', layer)

    let pointLayer = new PointLayer({
      zIndex: 1,
      enableMultiPassRenderer: false,
      // passes: [
      //   [
      //     'bloom',
      //     {
      //       bloomRadius: 10,
      //       bloomIntensity: 1,
      //     },
      //   ],
      // ],
    })
      .source([{ lng: 122, lat: 30 }], {
        parser: {
          type: 'json',
          x: 'lng',
          y: 'lat',
        },
      })
      .shape('circle')
      .size(20)
      .color('red');
    scene.addLayer(pointLayer);

    // setTimeout(() => {
    //   layer.setMultiPass(false);
    //   pointLayer.setMultiPass(true, [
    //     [
    //       'bloom',
    //       {
    //         bloomRadius: 10,
    //         bloomIntensity: 1,
    //       },
    //     ],
    //   ]);

    //   scene.render();
    // }, 1000);

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
