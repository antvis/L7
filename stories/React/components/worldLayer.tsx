import { Scene } from '@antv/l7';
import { WorldLayer } from '@antv/l7-district';
import { GaodeMap, GaodeMapV2, Mapbox } from '@antv/l7-maps';
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
      map: new GaodeMapV2({
        pitch: 0,
        style: 'dark',
        center: [116.2825, 39.9],
        // zoom: 0,
        zoom: 3,
        // minZoom: 0,
        maxZoom: 24,
      }),
    });
    scene.on('loaded', () => {
      const Layer = new WorldLayer(scene, {
        autoFit: false,
        data: [],
        geoDataLevel: 2,
        joinBy: ['SOC', 'SOC'],
        fill: {
          color: {
            field: 'NAME_CHN',
            values: ['rgba(1.0, 0.0, 0.0, 0.5)'],
          },
        },
        stroke: '#ccc',
        label: {
          enable: true,
          textAllowOverlap: false,
          field: 'NAME_ENG',
          padding: [5, 5],
        },
        popup: {
          // enable: true,
          enable: false,
          Html: (props) => {
            return `<span>${props.NAME_CHN}</span>`;
          },
        },
      });
      // @ts-ignore
      // window.onresize = () => Layer.fillLayer.fitBounds()

      // scene.setZoom(4)
      // console.log(scene.getZoom())
      setTimeout(() => {
        console.log('***', scene.getZoom());
      }, 1500);
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
