import { Scene } from '@antv/l7';
import { CountryLayer } from '@antv/l7-district';
import { GaodeMap, Mapbox } from '@antv/l7-maps';
import * as React from 'react';

export default class Country extends React.Component {
  // @ts-ignore
  private scene: Scene;

  public componentWillUnmount() {
    this.scene.destroy();
  }

  public async componentDidMount() {
    const scene = new Scene({
      id: 'map',
      map: new Mapbox({
        center: [116.2825, 39.9],
        pitch: 0,
        style: 'blank',
        zoom: 3,
        minZoom: 3,
        maxZoom: 10,
      }),
    });
    scene.on('loaded', () => {
      const Layer = new CountryLayer(scene, {
        data: [],
        geoDataLevel: 2,
        depth: 2,
        showBorder: false,
        provinceStroke: '#783D2D',
        cityStroke: '#EBCCB4',
        coastlineWidth: 0.5,
        nationalWidth: 0.5,
        fill: {
          color: {
            field: 'NAME_CHN',
            values: ['#D92568', '#E3507E', '#FC7AAB', '#F1D3E5', '#F2EEFF'],
          },
        },
        popup: {
          enable: true,
          Html: (props: any) => {
            return `<span>${props.NAME_CHN}</span>`;
          },
        },
      });
    });
    this.scene = scene;
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
