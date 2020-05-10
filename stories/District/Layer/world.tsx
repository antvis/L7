import { Scene } from '@antv/l7';
import { WorldLayer } from '@antv/l7-district';
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
        zoom: 0,
        minZoom: 0,
        maxZoom: 10,
      }),
    });
    scene.on('loaded', () => {
      const Layer = new WorldLayer(scene, {
        data: [],
        fill: {
          field: 'NAME_CHN',
          values: [
            '#feedde',
            '#fdd0a2',
            '#fdae6b',
            '#fd8d3c',
            '#e6550d',
            '#a63603',
          ],
        },
        stroke: '#ccc',
        label: {
          enable: false,
          textAllowOverlap: false,
          field: 'Short_Name_ZH',
        },
        popup: {
          enable: false,
          Html: (props) => {
            return `<span>${props.Short_Name_ZH}</span>`;
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
