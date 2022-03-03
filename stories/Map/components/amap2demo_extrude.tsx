import { PointLayer, Scene } from '@antv/l7';
import { GaodeMap, GaodeMapV2, Mapbox, Map } from '@antv/l7-maps';
import * as React from 'react';

export default class Amapdemo_extrude extends React.Component {
  // @ts-ignore
  private scene: Scene;

  public componentWillUnmount() {
    this.scene.destroy();
  }

  public async componentDidMount() {
    const scene = new Scene({
      id: 'map',
      map: new GaodeMap({
        center: [121.107846, 30.267069],
        pitch: 40,
        style: 'normal',
        zoom: 8,
      }),
    });

    this.scene = scene;

    scene.on('loaded', () => {
      fetch(
        'https://gw.alipayobjects.com/os/rmsportal/oVTMqfzuuRFKiDwhPSFL.json',
      )
        .then((res) => res.json())
        .then((data) => {
          const pointLayer = new PointLayer({})
            .source(data.list, {
              parser: {
                type: 'json',
                x: 'j',
                y: 'w',
              },
            })
            .shape('cylinder')
            .size('t', function(level) {
              // return [4000, 4000, level * 4000 + 20];
              return [4, 4, level * 4 + 20];
              // return [4000, 4000, level * 4000 + 20];
            })
            .active(true)
            .color('t', [
              '#094D4A',
              '#146968',
              '#1D7F7E',
              '#289899',
              '#34B6B7',
              '#4AC5AF',
              '#5FD3A6',
              '#7BE39E',
              '#A1EDB8',
              '#CEF8D6',
            ])
            // .animate(true)
            // .animate({
            //   enable: false,
            //   // speed: 0.1,
            //   // repeat: Infinity
            // })
            .style({
              opacity: 1.0,
              // heightfixed: true
            });
          scene.addLayer(pointLayer);
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
