// @ts-ignore
import { PolygonLayer, Scene } from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';
import * as React from 'react';

export default class GaodeMapComponent extends React.Component {
  // @ts-ignore
  private scene: Scene;

  public componentWillUnmount() {
    this.scene.destroy();
  }

  public async componentDidMount() {
    const response = await fetch(
      'https://gw.alipayobjects.com/os/basement_prod/d2e0e930-fd44-4fca-8872-c1037b0fee7b.json',
    );
    const data = await response.json();
    // @ts-ignore
    window.initAMap = () => {
      const map = new AMap.Map('map', {
        viewMode: '3D',
        resizeEnable: true, // 是否监控地图容器尺寸变化
        zoom: 11, // 初始化地图层级
        center: [116.397428, 39.90923], // 初始化地图中心点
      });
      const scene = new Scene({
        id: 'map',
        map: new GaodeMap({
          mapInstance: map,
        }),
      });
      const layer = new PolygonLayer({
        enablePicking: false,
      });
      layer
        .source(data)
        .size('name', [0, 10000, 50000, 30000, 100000])
        .color('name', [
          '#2E8AE6',
          '#69D1AB',
          '#DAF291',
          '#FFD591',
          '#FF7A45',
          '#CF1D49',
        ])
        .shape('fill')
        .style({
          opacity: 0.8,
        });
      scene.addLayer(layer);
      scene.render();
      this.scene = scene;
    };
    const url: string =
      'https://webapi.amap.com/maps?v=1.4.15&key=15cd8a57710d40c9b7c0e3cc120f1200&plugin=Map3D&callback=initAMap';
    const $jsapi = document.createElement('script');
    $jsapi.id = 'amap-script';
    $jsapi.charset = 'utf-8';
    $jsapi.src = url;
    document.head.appendChild($jsapi);
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
