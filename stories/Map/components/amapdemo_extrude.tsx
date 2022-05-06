import { PointLayer, Scene } from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';
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
        pitch: 35.210526315789465,
        style: 'dark',
        zoom: 8,
        animateEnable: false,
      }),
    });

    this.scene = scene;

    scene.on('loaded', () => {
      fetch(
        'https://gw.alipayobjects.com/os/rmsportal/oVTMqfzuuRFKiDwhPSFL.json',
      )
        .then((res) => res.json())
        .then((data) => {
          const pointLayer = new PointLayer({ depth: false })
            .source(data.list, {
              parser: {
                type: 'json',
                x: 'j',
                y: 'w',
              },
            })
            // .shape('squareColumn') // cylinder triangleColumn hexagonColumn squareColumn
            .shape('cylinder') // cylinder triangleColumn hexagonColumn squareColumn
            .size('t', function(level) {
              return [1, 1, level * 2 + 20];
              // return [10, 10, level * 2 + 20];
            })
            .active(true)
            .color('#0ff')
            .style({
              // opacity: 0.8,
              opacityLinear: {
                enable: true, // true - false
                dir: 'up', // up - down
              },
              lightEnable: false,
              // sourceColor: '#f00',
              // targetColor: "#0f0"
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
