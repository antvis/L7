import * as React from 'react';
import { Scene, PolygonLayer, LineLayer, Source } from '@antv/l7';
import { Mapbox } from '@antv/l7-maps';

export default class DataUpdate extends React.Component {
  private scene: Scene | undefined;

  public componentWillUnmount() {
    this.scene?.destroy();
  }

  public componentDidMount() {
    const scene = new Scene({
      id: 'map',
      map: new Mapbox({
        pitch: 0,
        style: 'blank',
        center: [116.368652, 39.93866],
        zoom: 10.07,
      }),
    });

    scene.on('loaded', () => {
      Promise.all([
        fetch(
          'https://gw.alipayobjects.com/os/alisis/geo-data-v0.1.1/choropleth-data/country/100000_country_province.json',
        ).then((res) => res.json()),
        fetch(
          'https://gw.alipayobjects.com/os/alisis/geo-data-v0.1.1/choropleth-data/province/330000_province_city.json',
        ).then((res) => res.json()),
      ]).then(([china, zhejiang]) => {
        const source = new Source(zhejiang);
        const chinaPolygonLayer = new PolygonLayer({
          autoFit: true,
        })
          .color('name', [
            '#B8E1FF',
            '#7DAAFF',
            '#3D76DD',
            '#0047A5',
            '#001D70',
          ])
          .shape('fill');

        const chinaPolygonLineLayer = new LineLayer({}).shape('line');
        chinaPolygonLayer.setSource(source);
        chinaPolygonLineLayer.setSource(chinaPolygonLayer.getSource());

        scene.addLayer(chinaPolygonLayer);
        scene.addLayer(chinaPolygonLineLayer);

        let current = true;

        chinaPolygonLayer.on('unclick', () => {
          console.time('dataUpdate');
          scene.setEnableRender(false);
          source.setData(current ? china : zhejiang);
          current = !current;
          scene.setEnableRender(true);
          scene.render();
          console.timeEnd('dataUpdate');
        });
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
      ></div>
    );
  }
}
