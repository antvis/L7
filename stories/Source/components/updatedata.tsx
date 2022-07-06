import { LineLayer, PolygonLayer, Scene } from '@antv/l7';
import { GaodeMapV2 } from '@antv/l7-maps';
import * as React from 'react';

function convertRGB2Hex(rgb: number[]) {
  return (
    '#' + rgb.map((r) => ('0' + Math.floor(r).toString(16)).slice(-2)).join('')
  );
}

export default class UpdatePolygon extends React.Component {
  private gui: dat.GUI;
  private $stats: Node;
  private scene: Scene;

  public componentWillUnmount() {
    this.scene.destroy();
  }

  public async componentDidMount() {
    const scene = new Scene({
      id: 'map',
      map: new GaodeMapV2({
        style: 'dark',
        center: [104.288144, 31.239692],
        zoom: 4.4,
      }),
    });

    scene.on('loaded', async () => {
      // https://gw.alipayobjects.com/os/basement_prod/0d2f0113-f48b-4db9-8adc-a3937243d5a3.json
      const response = await fetch(
        'https://gw.alipayobjects.com/os/rmsportal/JToMOWvicvJOISZFCkEI.json',
      );
      const data = await response.json();
      const highlightLayer = new PolygonLayer({})
        .source({
          type: 'FeatureCollection',
          features: [],
        })
        .shape('fill')
        .color('red'); // 20% 透明度;
      const polygonLayer = new PolygonLayer({})
        .source(data)
        .shape('fill')
        .color('rgba(255,255,255,0.2)') // 20% 透明度
        .select({
          color: 'red', // 选中后的颜色同样会有透明度
        })
        .style({
          opacity: 1,
        });
      // polygonLayer.on('click', (e) => {
      //   highlightLayer.setData({
      //     type: 'FeatureCollection',
      //     features: [e.feature],
      //   });
      // });
      const lineLayer = new LineLayer({})
        .source(data)
        .shape('line')
        .size(1)
        .color('#0ffbc4');

      scene.addLayer(polygonLayer);
      scene.addLayer(highlightLayer);
      scene.addLayer(lineLayer);
      this.scene = scene;
    });
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
