// @ts-ignore
import { LineLayer, Scene } from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';
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
        center: [102.600579, 23.114887],
        zoom: 14.66,
        viewMode: '3D',
      }),
    });
    this.scene = scene;

    scene.on('loaded', () => {
      fetch(
        'https://gw.alipayobjects.com/os/rmsportal/ZVfOvhVCzwBkISNsuKCc.json',
      )
        .then((res) => res.json())
        .then((data) => {
          const layer = new LineLayer({})
            .source(data)
            .size('ELEV', (h) => {
              return [h % 50 === 0 ? 1.0 : 0.5, (h - 1500) * 2];
            })
            .shape('line')
            .scale('ELEV', {
              type: 'quantize',
            })
            .color(
              'ELEV',
              [
                '#E4682F',
                '#FF8752',
                '#FFA783',
                '#FFBEA8',
                '#FFDCD6',
                '#EEF3FF',
                '#C8D7F5',
                '#A5C1FC',
                '#7FA7F9',
                '#5F8AE5',
              ].reverse(),
            );
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
