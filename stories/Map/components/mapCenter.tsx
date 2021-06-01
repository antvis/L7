// @ts-ignore
import { ILngLat, PointLayer, PolygonLayer, Scene } from '@antv/l7';
import { GaodeMap, GaodeMapV1 } from '@antv/l7-maps';
import * as React from 'react';

export default class GaodeMapComponent extends React.Component {
  // @ts-ignore
  private scene: Scene;

  public componentWillUnmount() {
    this.scene.destroy();
  }

  public async componentDidMount() {
    const scene = new Scene({
      id: 'map',
      map: new GaodeMapV1({
        center: [121.107846, 30.267069],
        pitch: 0,
        style: 'normal',
        zoom: 20,
        animateEnable: false,
      }),
    });

    const layer = new PointLayer()
      .source(
        [
          {
            lng: 121.107846,
            lat: 30.267069,
          },
          {
            lng: 121.107,
            lat: 30.267069,
          },
          {
            lng: 120.107846,
            lat: 30.267069,
          },
          {
            lng: 38.54,
            lat: 77.02,
          },
        ],
        {
          parser: {
            type: 'json',
            x: 'lng',
            y: 'lat',
          },
        },
      )
      .shape('circle')
      // .shape('normal')
      .color('blue')
      .size(10)
      .style({
        stroke: '#fff',
        storkeWidth: 2,
      });
    scene.addLayer(layer);
    scene.render();
    this.scene = scene;

    scene.on('loaded', () => {
      // const padding = {
      //   top: 50,
      //   right: 0,
      //   bottom: 200,
      //   left: 800,
      // };
      // const px = scene.lngLatToPixel([center.lng, center.lat]);
      // const offsetPx = [
      //   (padding.right - padding.left) / 2,
      //   (padding.bottom - padding.top) / 2,
      // ];
      // scene.setCenter([121.107846, 30.267069], { padding });
      // const newCenter = scene.pixelToLngLat([
      //   px.x + offsetPx[0],
      //   px.y + offsetPx[1],
      // ]);
      // @ts-ignore
      // scene.setCenter();
      // get originCenter
      // const originCenter = scene.getCenter();
      // const originPx = scene.lngLatToPixel([
      //   originCenter.lng,
      //   originCenter.lat,
      // ]);
      // const offsetPx2 = [
      //   (-padding.right + padding.left) / 2,
      //   (-padding.bottom + padding.top) / 2,
      // ];
      // const newCenter2 = scene.pixelToLngLat([
      //   originPx.x - offsetPx[0],
      //   originPx.y - offsetPx[1],
      // ]);
      // lngLatToContainer
      // 获取当前地图像素坐标
      // console.log(originCenter, center, newCenter2);
      // console.log(w,h);
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
        {/* <div
          style={{
            position: 'absolute',
            bottom: '0px',
            zIndex: 10,
            background: '#fff',
            height: '200px',
            width: '100%',
          }}
        /> */}
        {/* <div
          style={{
            position: 'absolute',
            top: '0px',
            zIndex: 10,
            background: '#f00',
            height: '50px',
            width: '100%',
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: '0px',
            zIndex: 10,
            background: '#ff0',
            height: '100%',
            width: '800px',
          }}
        /> */}
      </>
    );
  }
}
