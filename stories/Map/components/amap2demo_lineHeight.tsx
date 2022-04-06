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
      map: new Mapbox({
        pitch: 40,
        style: 'light',
        // center: [120, 23.114887],
        center: [102.600579, 23.114887],
        // zoom: 8,
        zoom: 14.66,
      }),
    });
    this.scene = scene;

    scene.on('loaded', () => {
      fetch(
        'https://gw.alipayobjects.com/os/rmsportal/ZVfOvhVCzwBkISNsuKCc.json',
        // 'https://gw.alipayobjects.com/os/bmw-prod/65589ef3-7f1d-440f-ba5d-86b03ee6ba7e.json',
      )
        .then((res) => res.json())
        .then((data) => {
          // const layer = new LineLayer({})
          //   .source(data)
          //   .size(1)
          //   .shape('line')
          //   .style({
          //     vertexHeightScale: 30,
          //   })
          //   .color('#ccc');

          // scene.addLayer(layer);
          // -----
          const layer = new LineLayer({})
            .source(data)
            .size('ELEV', (h) => {
              return [h % 50 === 0 ? 1.0 : 0.5, (h - 1400) * 20]; // amap
            })
            .shape('line')
            .scale('ELEV', {
              type: 'quantize',
            })
            .style({
              heightfixed: true,
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
