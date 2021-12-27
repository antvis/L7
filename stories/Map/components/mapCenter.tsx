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
    var circleRadius = 100;
    var radius = circleRadius;
    var data = {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'Polygon',
            coordinates: turf.circle(aspaceLnglat, radius, {
              steps: 10,
              units: 'meters',
            }).geometry.coordinates,
          },
        },
      ],
    };
    let trufCircle = new PolygonLayer()
      .size('name', [0, 10000, 50000, 30000, 100000])
      .source(data)
      .color('#f00')
      .shape('fill');

    let layer = new PointLayer({ zIndex: 2, blend: 'additive' })
      .source(
        [
          {
            lng: 121.107846,
            lat: 30.267069,
          },
          {
            lng: aspaceLnglat[0],
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
      .shape('circle')
      // .color('#0f9')
      .color('#f00')
      // .size([10, 10, 100])
      .size(10)
      .style({
        stroke: '#f00',
        // strokeWidth: 10,
        strokeWidth: 0,
        strokeOpacity: 1,
        // unit: 'meter',
      })
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
      // scene.addLayer(trufCircle);
      // scene.on('movestart', e => console.log('e', e))
      // scene.on('mapmove', e => console.log('e', e))
      // scene.on('moveend', e => console.log('e', e))

      // scene.on('zoomstart', e => console.log('e', e))
      // scene.on('zoomchange', e => console.log('e', e))
      // scene.on('zoomend', e => console.log('e', e))
      // scene.on('mousedown', e => console.log('e', e))
    });
    let c = 1;
    layer.on('click', () => {
      // @ts-ignore
      c == 1 ? scene.setEnableRender(false) : scene.setEnableRender(true);
      c = 0;
    });
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
