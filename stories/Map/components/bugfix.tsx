// @ts-nocheck
import React from 'react';
import {
  Scene,
  GaodeMap,
  GaodeMapV2,
  Mapbox,
  Map,
  PointLayer,
  Marker,
  MarkerLayer,
  Popup,
} from '@antv/l7';

export default class Amap2demo extends React.Component {
  // @ts-ignore
  private scene: Scene;

  public componentWillUnmount() {
    this.scene.destroy();
  }

  public async componentDidMount() {
    const scene = new Scene({
      id: 'map',
      map: new GaodeMap({
        pitch: 0,
        style: 'dark',
        // center: [115, 30],

        center: [105.790327, 36.495636],

        zoom: 0,
        // layers: [new window.AMap.TileLayer.Satellite()]
      }),
    });

    this.scene = scene;

    scene.on('loaded', () => {
      fetch(
        'https://gw.alipayobjects.com/os/basement_prod/337ddbb7-aa3f-4679-ab60-d64359241955.json',
      )
        .then((res) => res.json())
        .then((data) => {
          data.features = data.features.filter((item) => {
            return item.properties.capacity > 800;
          });
          data.features.forEach((item) => {
            // console.log(item.properties.capacity);
          });
          const pointLayer = new PointLayer({})
            .source(data)
            .shape('capacity', (capacity) =>
              capacity < 5000 ? 'circle' : 'triangle',
            )
            .size('capacity', [0, 16])
            .color('capacity', [
              '#34B6B7',
              '#4AC5AF',
              '#5FD3A6',
              '#7BE39E',
              '#A1EDB8',
              '#CEF8D6',
            ])
            .active(true)
            .style({
              opacity: 0.5,
              // strokeWidth: ["capacity", (capacity) => (capacity < 5000 ? 2 : 4)],
              strokeWidth: ['capacity', [1, 2]],
              stroke: [
                'capacity',
                (capacity) => (capacity < 5000 ? '#ff0000' : '#0000ff'),
              ],
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
        ></div>
      </>
    );
  }
}
