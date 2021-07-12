import { LineLayer, PolygonLayer, Scene } from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';
import Source from '@antv/l7-source';
import * as React from 'react';

export default class ReuseSource extends React.Component {
  private scene: Scene;

  public componentWillUnmount() {
    this.scene.destroy();
  }

  public async componentDidMount() {
    const scene = new Scene({
      id: 'map',
      map: new GaodeMap({
        style: 'dark',
        center: [104.288144, 31.239692],
        zoom: 4.4,
      }),
    });

    scene.on('loaded', async () => {
      const response = await fetch(
        'https://gw.alipayobjects.com/os/rmsportal/JToMOWvicvJOISZFCkEI.json',
      );
      const data = await response.json();

      const source = new Source(data);

      const polygonLayer = new PolygonLayer({})
        .shape('fill')
        .color('rgba(255,255,255,0.2)')
        .select({
          color: 'red',
        })
        .style({
          opacity: 1,
        });
      polygonLayer.setSource(source);
      polygonLayer.on('click', (e) => {
        source.setData({
          type: 'FeatureCollection',
          features: [e.feature],
        });
      });

      const lineLayer = new LineLayer({}).shape('line').color('#0ffbc4');
      lineLayer.setSource(source);

      scene.addLayer(polygonLayer);
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
