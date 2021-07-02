import { PointLayer, Scene } from '@antv/l7';
import { GaodeMap, GaodeMapV2 } from '@antv/l7-maps';
import AMapLoader from '@amap/amap-jsapi-loader';
import * as React from 'react';
export default class Amap2demo_instance extends React.Component {
  // @ts-ignore
  private scene: Scene;

  public componentWillUnmount() {
    this.scene.destroy();
  }

  public async componentDidMount() {
    const AMAP_API_KEY: string = '15cd8a57710d40c9b7c0e3cc120f1200';
    const AMAP_VERSION: string = '1.4.15';
    // const AMAP_API_KEY: string = 'ff533602d57df6f8ab3b0fea226ae52f';
    // const AMAP_VERSION: string = '2.0';

    AMapLoader.load({
      key: AMAP_API_KEY, // 申请好的Web端开发者Key，首次调用 load 时必填
      version: AMAP_VERSION, // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
      // plugins: plugin, // 需要使用的的插件列表，如比例尺'AMap.Scale'等
    }).then((AMap) => {
      const map = new AMap.Map('map', {
        viewMode: '3D',
        pitch: 0,
        mapStyle: 'amap://styles/darkblue',
        center: [121.435159, 31.256971],
        zoom: 14.89,
        minZoom: 10,
      });

      const scene = new Scene({
        id: 'map',
        map: new GaodeMap({
          mapInstance: map,
        }),
      });

      this.scene = scene;

      scene.on('loaded', () => {
        fetch(
          'https://gw.alipayobjects.com/os/basement_prod/893d1d5f-11d9-45f3-8322-ee9140d288ae.json',
        )
          .then((res) => res.json())
          .then((data) => {
            const pointLayer = new PointLayer()
              .source(data, {
                parser: {
                  type: 'json',
                  x: 'longitude',
                  y: 'latitude',
                },
              })
              .shape('name', [
                'circle',
                'triangle',
                'square',
                'pentagon',
                'hexagon',
                'octogon',
                'hexagram',
                'rhombus',
                'vesica',
              ])
              .size('unit_price', [10, 25])
              .color('name', [
                '#5B8FF9',
                '#5CCEA1',
                '#5D7092',
                '#F6BD16',
                '#E86452',
              ])
              .style({
                opacity: 0.3,
                strokeWidth: 2,
              });
            scene.addLayer(pointLayer);
          });
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
