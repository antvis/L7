// @ts-nocheck
import React from 'react';
import { Scene, GaodeMap, GaodeMapV2, Mapbox, Map, PointLayer } from '@antv/l7';

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
        center: [115, 30],
        zoom: 5,
        // layers: [new window.AMap.TileLayer.Satellite()]
      }),
    });
    this.scene = scene;

    scene.on('loaded', () => {

      var xyzTileLayer = new window.AMap.TileLayer({
        // 图块取图地址
        getTileUrl: 'https://wprd0{1,2,3,4}.is.autonavi.com/appmaptile?x=[x]&y=[y]&z=[z]&size=1&scl=1&style=8&ltype=11',
        zIndex: 100
      });
      scene.getMapService().map.add(xyzTileLayer)
     
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
        ></div>
      </>
    );
  }
}
