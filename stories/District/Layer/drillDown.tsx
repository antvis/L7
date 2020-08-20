import { Scene } from '@antv/l7';
import { DrillDownLayer } from '@antv/l7-district';
import { GaodeMap, Mapbox } from '@antv/l7-maps';
import * as React from 'react';

export default class Country extends React.Component {
  public state = {
    options: [],
  };
  // @ts-ignore
  private scene: Scene;
  private drillDown: DrillDownLayer;

  public componentWillUnmount() {
    this.scene.destroy();
  }

  public async componentDidMount() {
    const scene = new Scene({
      id: 'map',
      map: new Mapbox({
        center: [116.2825, 39.9],
        pitch: 0,
        style: 'dark',
        zoom: 3,
        minZoom: 3,
        maxZoom: 10,
      }),
    });
    scene.on('loaded', () => {
      this.scene = scene;
      this.drillDown = new DrillDownLayer(scene, {
        drillDepth: 2,
        geoDataLevel: 2,
        joinBy: ['NAME_CHN', 'name'],
        provinceData: [
          {
            name: '青海省',
            value: '1223',
          },
        ],
        cityData: [
          {
            name: '海东市',
            value: '1223e',
          },
        ],
        countyData: [
          {
            name: '平安区',
            value: '456',
          },
        ],
        fill: {
          color: {
            field: 'NAME_CHN',
            values: [
              '#f7fbff',
              '#deebf7',
              '#c6dbef',
              '#9ecae1',
              '#6baed6',
              '#4292c6',
              '#2171b5',
              '#08519c',
              '#08306b',
            ],
          },
        },
        popup: {
          enable: true,
          Html: (props) => {
            return `<span>${props.NAME_CHN} ${props.value}</span>`;
          },
        },
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
