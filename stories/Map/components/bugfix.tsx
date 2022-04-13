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
        'https://gw.alipayobjects.com/os/basement_prod/67f47049-8787-45fc-acfe-e19924afe032.json',
      )
        .then((res) => res.json())
        .then((nodes) => {
          const markerLayer = new MarkerLayer();
          for (let i = 0; i < nodes.length; i++) {
            if (nodes[i].g !== '1' || nodes[i].v === '') {
              continue;
            }
            const el = document.createElement('label');
            el.className = 'labelclass';
            el.textContent = nodes[i].v + '℃';
            el.style.background = '#ff0';
            el.style.borderColor = '#f00';

            const popup = new Popup({
              offsets: [0, 20],
            }).setText('hello');

            const marker = new Marker({
              element: el,
            })
              .setLnglat({ lng: nodes[i].x * 1, lat: nodes[i].y })
              .setPopup(popup);

            markerLayer.addMarker(marker);
          }
          scene.addMarkerLayer(markerLayer);
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
