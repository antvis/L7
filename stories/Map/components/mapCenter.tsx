// @ts-ignore
import { PointLayer, Scene, LineLayer, PolygonLayer } from '@antv/l7';
import { GaodeMap, GaodeMapV2, Mapbox } from '@antv/l7-maps';
import * as React from 'react';
import * as turf from '@turf/turf';

const aspaceLnglat = [120.1019811630249, 30.264701434772807] as [
  number,
  number,
];
export default class GaodeMapComponent extends React.Component {
  // @ts-ignore
  private scene: Scene;

  public componentWillUnmount() {
    this.scene.destroy();
  }

  public async componentDidMount() {
    const scene = new Scene({
      id: 'map',
      map: new GaodeMap({
        center: aspaceLnglat,
        // pitch: 0,
        pitch: 40,
        // style: 'dark',
        zoom: 17,
      }),
    });
    // normal = 'normal',
    // additive = 'additive',
    // cylinder circle
    // blend: 'additive'
    let line = new LineLayer({ zIndex: 3 })
      .source(
        [
          {
            lng: aspaceLnglat[0],
            lat: aspaceLnglat[1],
            lng2: aspaceLnglat[0] + 0.00104,
            lat2: aspaceLnglat[1],
          },
        ],
        {
          parser: {
            type: 'json',
            x: 'lng',
            y: 'lat',
            x1: 'lng2',
            y1: 'lat2',
          },
        },
      )
      .shape('line')
      .size(2)
      .color('#000');

    let text = new PointLayer({ zIndex: 2 })
      .source(
        [
          {
            lng: aspaceLnglat[0] + 0.0002,
            lat: aspaceLnglat[1],
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
      .shape('100m', 'text')
      .size(25)
      .color('#000')
      .style({
        textOffset: [50, 20],
      });

    let layer = new PointLayer({  }) // blend: 'additive'
      .source(
        [
          {
            lng: 120,
            lat: 30.267069,
          },
          {
            lng: 120.1025,
            lat: 30.264701434772807,
          },
          {
            lng: 120.1019811630249,
            lat: 30.264701434772807,
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
      // .color('#0f9')
      .color('#4169E1')
      // .size([10, 10, 100])
      .size(100)
      // .animate({
      //   // enable: true,
      //   enable: false,
      //   // type: 'www'
      // })
      // .animate(true)
      .active({ color: '#00f' })
      .style({
        // opacity: 0.5,
        stroke: '#f00',
        // strokeWidth: 10,
        strokeWidth: 0,
        strokeOpacity: 1,
        // unit: 'meter',
      });
    // .animate(true)
    // .animate({
    //   enable: true,
    //   speed: 0.02,
    //   repeat: 1
    // })
    // .active({ color: '#00f' });

    this.scene = scene;

    scene.on('loaded', () => {
      scene.addLayer(layer);
      scene.addLayer(text);
      scene.addLayer(line);
      // scene.addLayer(trufCircle);
      // scene.on('movestart', e => console.log('e', e))
      // scene.on('mapmove', e => console.log('e', e))
      // scene.on('moveend', e => console.log('e', e))

      // scene.on('zoomstart', e => console.log('e', e))
      // scene.on('zoomchange', e => console.log('e', e))
      // scene.on('zoomend', e => console.log('e', e))
      // scene.on('mousedown', e => console.log('e', e))
    });
    // let c = 1;
    // layer.on('click', () => {
    //   // @ts-ignore
    //   c == 1 ? scene.setEnableRender(false) : scene.setEnableRender(true);
    //   c = 0;
    // });
    // layer.on('contextmenu', () => console.log('contextmenu'));
    // layer.on('destroy', (e) => console.log('destroy', e));
    // layer.on('remove', (e) => {
    //   console.log('remove', e);
    //   console.log(scene.getLayers());
    // });

    // setTimeout(() => {
    //   layer.destroy();
    // }, 2000);
    // layer.on('mousemove', (e) => {
    //   console.log(e.feature);
    // });
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
