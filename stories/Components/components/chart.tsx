// @ts-ignore
import * as G2 from '@antv/g2';
import { Marker, Scene } from '@antv/l7';
import { GaodeMap, Mapbox } from '@antv/l7-maps';
import * as React from 'react';

export default class ChartComponent extends React.Component {
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
        center: [52.21496184144132, 24.121126851768906],
        zoom: 3.802,
      }),
    });
    addChart();
    scene.render();
    this.scene = scene;
    function addChart() {
      Promise.all([
        fetch(
          'https://gw.alipayobjects.com/os/basement_prod/5b772136-a1f4-4fc5-9a80-9f9974b4b182.json',
        ).then((d) => d.json()),
        fetch(
          'https://gw.alipayobjects.com/os/basement_prod/f3c467a4-9ae0-4f08-bb5f-11f9c869b2cb.json',
        ).then((d) => d.json()),
      ]).then(function onLoad([center, population]) {
        const popobj: { [key: string]: any } = {};
        population.forEach((element: any) => {
          popobj[element.Code] =
            element['Population, female (% of total) (% of total)'];
        });
        // 数据绑定

        center.features = center.features.map((fe: any) => {
          fe.properties.female = popobj[fe.properties.id] * 1 || 0;
          return fe;
        });
        center.features.forEach((point: any) => {
          const el = document.createElement('div');
          const coord = point.geometry.coordinates;
          const v = (point.properties.female * 1) as number;
          if (v < 1 || (v > 46 && v < 54)) {
            return;
          }
          const size = 60;
          const data = [
            {
              type: '男性',
              value: 100.0 - Number(v.toFixed(2)),
            },
            {
              type: '女性',
              value: v.toFixed(2),
            },
          ];
          const chart = new G2.Chart({
            container: el,
            width: size,
            height: size,
            // render: 'svg',
            padding: 0,
          });
          chart.source(data);
          chart.legend(false);
          chart.tooltip(false);
          chart.coord('theta', {
            radius: 0.9,
            innerRadius: 0.6,
          });
          chart
            .intervalStack()
            .position('value')
            .color('type', ['#5CCEA1', '#5B8FF9'])
            .opacity(1);
          chart.render();
          const marker = new Marker({ element: el }).setLnglat({
            lng: coord[0],
            lat: coord[1],
          });
          scene.addMarker(marker);
        });
      });
    }
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
