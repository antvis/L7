import { LineLayer, Scene } from '@antv/l7';
import { GaodeMap, GaodeMapV2, Mapbox } from '@antv/l7-maps';
import * as React from 'react';

export default class Amap2demo_lineHeight extends React.Component {
  // @ts-ignore
  private scene: Scene;

  public componentWillUnmount() {
    this.scene.destroy();
  }

  public async componentDidMount() {
    const scene = new Scene({
      id: 'map',
      map: new GaodeMap({
        pitch: 40,
        style: 'light',
        center: [120, 23.114887],
        zoom: 8,
      }),
    });
    this.scene = scene;

    scene.on('loaded', () => {
      fetch(
        // 'https://gw.alipayobjects.com/os/rmsportal/ZVfOvhVCzwBkISNsuKCc.json',
        'https://gw.alipayobjects.com/os/bmw-prod/65589ef3-7f1d-440f-ba5d-86b03ee6ba7e.json'
      )
        .then((res) => res.json())
        .then((data) => {
          const layer = new LineLayer({})
            .source(data)
            .size(1)
            .shape('line')
            .color('#ccc');
        
          scene.addLayer(layer);
        });
    });
  }

  public render() {
    return (
      <>
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
      </>
    );
  }
}
