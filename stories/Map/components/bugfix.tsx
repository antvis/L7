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
      // var xyzTileLayer = new window.AMap.TileLayer({
      //   // 图块取图地址
      //   getTileUrl:
      //     'https://wprd0{1,2,3,4}.is.autonavi.com/appmaptile?x=[x]&y=[y]&z=[z]&size=1&scl=1&style=8&ltype=11',
      //   zIndex: 100,
      // });
      // scene.getMapService().map.add(xyzTileLayer);

      addMarkers();
      scene.render();
    });

    function addMarkers() {
      fetch(
        'https://gw.alipayobjects.com/os/basement_prod/d3564b06-670f-46ea-8edb-842f7010a7c6.json',
      )
        .then((res) => res.json())
        .then((nodes) => {
          const markerLayer = new MarkerLayer({
            cluster: true,
          });
          for (let i = 0; i < nodes.features.length; i++) {
            const { coordinates } = nodes.features[i].geometry;
            const marker = new Marker().setLnglat({
              lng: coordinates[0],
              lat: coordinates[1],
            });
            markerLayer.addMarker(marker);
          }
          scene.addMarkerLayer(markerLayer);
          // 模拟第二次查询（8条数据，坐标点是兰州）
          // 注意看地图上兰州的位置，原本是3，放大后会变成11
          const data = [
            { coordinates: [103.823305441, 36.064225525] },
            { coordinates: [103.823305441, 36.064225525] },
            { coordinates: [103.823305441, 36.064225525] },
            { coordinates: [103.823305441, 36.064225525] },
            { coordinates: [103.823305441, 36.064225525] },
            { coordinates: [103.823305441, 36.064225525] },
            { coordinates: [103.823305441, 36.064225525] },
            { coordinates: [103.823305441, 36.064225525] },
          ];
          for (let i = 0; i < data.length; i++) {
            const { coordinates } = data[i];
            const marker = new Marker().setLnglat({
              lng: coordinates[0],
              lat: coordinates[1],
            });
            markerLayer.addMarker(marker);
          }
        });
    }
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
