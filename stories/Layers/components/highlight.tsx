import { LineLayer, PolygonLayer, Scene } from '@antv/l7';
import { Mapbox } from '@antv/l7-maps';
import * as React from 'react';

export default class LineDemo extends React.Component {
  // @ts-ignore
  private scene: Scene;

  public componentWillUnmount() {
    this.scene.destroy();
  }

  public async componentDidMount() {
    const scene = new Scene({
      id: 'map',
      map: new Mapbox({
        style: 'light',
        pitch: 0,
        center: [118.7368, 32.056],
        zoom: 9,
      }),
    });
    scene.on('loaded', () => {
      fetch(
        'https://gw.alipayobjects.com/os/basement_prod/91247d10-585b-4406-b1e2-93b001e3a0e4.json',
      )
        .then((res) => res.json())
        .then((data) => {
          const filllayer = new PolygonLayer({
            name: 'fill',
            zIndex: 3,
          })
            .source(data)
            .shape('fill')
            .color('unit_price', [
              '#f0f9e8',
              '#ccebc5',
              '#a8ddb5',
              '#7bccc4',
              '#43a2ca',
              '#0868ac',
            ])
            .style({
              opacity: 1,
            });

          const filllayer2 = new PolygonLayer({
            name: 'fill',
            zIndex: 1,
          })
            .source(data)
            .shape('fill')
            .color('red')
            .style({
              opacity: 1,
            });
          const linelayer = new LineLayer({
            zIndex: 5,
            name: 'line2',
          })
            .source(data)
            .shape('line')
            .size(2)
            .color('#fff')
            .style({
              opacity: 1,
            });
          const hightLayer = new LineLayer({
            zIndex: 4, // 设置显示层级
            name: 'line1',
          })
            .source(data)
            .shape('line')
            .size(3)
            .color('#f00')
            .style({
              opacity: 1,
            });
          const hightLayer2 = new LineLayer({
            zIndex: 6, // 设置显示层级
            name: 'line3',
          })
            .source(data)
            .shape('line')
            .size(0.6)
            .color('#000')
            .style({
              opacity: 1,
            });
          scene.addLayer(filllayer);
          scene.addLayer(filllayer2);
          scene.addLayer(linelayer);
          scene.addLayer(hightLayer);
          scene.addLayer(hightLayer2);
          this.scene = scene;

          // filllayer.on('click', (feature) => {
          //   hightLayer.setData({
          //     type: 'FeatureCollection',
          //     features: [feature.feature],
          //   });
          //   hightLayer2.setData({
          //     type: 'FeatureCollection',
          //     features: [feature.feature],
          //   });
          // });
          // scene.render();
        });
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
