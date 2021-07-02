import { Scene } from '@antv/l7';
import { DrillDownLayer } from '@antv/l7-district';
import { GaodeMap } from '@antv/l7-maps';
import * as React from 'react';

const colors = ['#B8E1FF', '#7DAAFF', '#3D76DD', '#0047A5', '#001D70'];

export default class Amap2demo_drilldown extends React.Component {
  // @ts-ignore
  private scene: Scene;

  public componentWillUnmount() {
    this.scene.destroy();
  }

  public async componentDidMount() {
    const scene = new Scene({
      id: 'map',
      map: new GaodeMap({
        center: [116.2825, 39.9],
        pitch: 0,
        style: 'blank',
        zoom: 3,
        minZoom: 3,
        maxZoom: 10,
        // viewMode: "3D"
      }),
    });
    this.scene = scene;

    scene.on('loaded', () => {
      new DrillDownLayer(scene, {
        data: [],
        viewStart: 'Country',
        viewEnd: 'City',
        fill: {
          color: {
            field: 'NAME_CHN',
            values: colors,
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
