// @ts-ignore
import { PointLayer, Scene, LineLayer, PolygonLayer } from '@antv/l7';
import { GaodeMap, GaodeMapV2, Mapbox } from '@antv/l7-maps';
import * as React from 'react';
import * as turf from '@turf/turf';

const aspaceLnglat = [120.1019811630249, 30.264701434772807] as [
  number,
  number,
];
export default class BusLine extends React.Component {
  // @ts-ignore
  private scene: Scene;

  public componentWillUnmount() {
    this.scene.destroy();
  }

  public async componentDidMount() {
    const scene = new Scene({
      id: 'map',
      map: new Mapbox({
        center: [103.83735604457024, 1.360253881403068],
        pitch: 4.00000000000001,
        zoom: 10.210275860702593,
        rotation: 19.313180925794313,
      }),
    });

    this.scene = scene;

    scene.on('loaded', () => {
      fetch(
        'https://gw.alipayobjects.com/os/basement_prod/ee07641d-5490-4768-9826-25862e8019e1.json',
      )
        .then((res) => res.json())
        .then((data) => {
          const layer = new LineLayer({})
            .source(data, {
              parser: {
                type: 'json',
                coordinates: 'path',
              },
            })
            .size('level', (level) => {
              return [0.8, level * 1];
            })
            .style({
              // vertexHeightScale: 0.01
            })
            .shape('line')
            .active(true)
            .color(
              'level',
              [
                '#0A3663',
                '#1558AC',
                '#3771D9',
                '#4D89E5',
                '#64A5D3',
                '#72BED6',
                '#83CED6',
                '#A6E1E0',
                '#B8EFE2',
                '#D7F9F0',
              ]
                .reverse()
                .slice(0, 8),
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
