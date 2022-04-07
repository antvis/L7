// @ts-ignore
import { PointLayer, Scene, LineLayer, PolygonLayer, ILayer } from '@antv/l7';
import { GaodeMap, GaodeMapV2, Mapbox, Map } from '@antv/l7-maps';
import * as React from 'react';
import * as turf from '@turf/turf';

const aspaceLnglat = [120.11, 30.264701434772807] as [number, number];
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
        // pitch: 40,
        style: 'dark',
        zoom: 17,
        // dragEnable: false
      }),
    });
    // normal = 'normal',
    // additive = 'additive',
    // cylinder circle
    // blend: 'additive'
    // let line = new LineLayer({ zIndex: 3 })
    //   .source(
    //     [
    //       {
    //         lng: aspaceLnglat[0],
    //         lat: aspaceLnglat[1],
    //         lng2: aspaceLnglat[0] + 0.00104,
    //         lat2: aspaceLnglat[1],
    //       },
    //     ],
    //     {
    //       parser: {
    //         type: 'json',
    //         x: 'lng',
    //         y: 'lat',
    //         x1: 'lng2',
    //         y1: 'lat2',
    //       },
    //     },
    //   )
    //   .shape('line')
    //   .size(2)
    //   .color('#000');

    let layer = new PointLayer({}) // blend: 'additive'
      .source(
        [
          {
            lng: 120.11,
            lat: 30.264701434772807,
            name: 'n3',
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
      // - cylinder
      // - triangleColumn
      // - hexagonColumn
      // - squareColumn,
      .shape('circle')
      // .shape('cylinder')
      // .color('#0f9')
      // .color('#4169E1')
      .color('#4cfd47')
      // .color('name', ['#f00', '#ff0'])
      // .size([100, 100, 1000])
      // .size([20, 20, 200])
      .size(20)
      // .size('name', [20, 40])
      // .animate({
      //   // enable: true,
      //   enable: false,
      //   // type: 'www'
      // })
      // .animate(true)
      .select(true)
      // .active({ color: '#ff0' })
      .style({
        // heightfixed: true,
        // pickLight: false,
        // pickLight: true,
        // lightEnable: true,
        // opacity: 0.5,
        // stroke: '#f00',
        // strokeWidth: 10,
        // strokeWidth: 0,
        // strokeOpacity: 1,
        // unit: 'meter',
      });
    // .animate(true)
    // .animate({
    //   enable: true,
    //   speed: 0.02,
    //   repeat: 1
    // })
    // .active({ color: '#00f' });

    setTimeout(() => {
      layer.shape('triangleColumn')
      scene.render();
    }, 2000)

    this.scene = scene;

    // console.log('layer', layer)

    // let layer2 = new PointLayer({})
    // .source([
    //   {
    //     lng: 120.1025,
    //     lat: 30.264701434772807,
    //     name: 'n2'
    //   }
    // ], {
    //   parser: {
    //     type: 'json',
    //     x: 'lng',
    //     y: 'lat',
    //   },
    // })
    // .shape('circle')
    // .size(10)
    // .color('#00f')
    // .style({
    //   opacity: 0.5
    // })

    // scene.addImage(
    //   '00',
    //   'https://gw.alipayobjects.com/zos/basement_prod/604b5e7f-309e-40db-b95b-4fac746c5153.svg',
    // );

    scene.on('loaded', () => {
      scene.addLayer(layer);

      // let scale = layer.getScale('size');
      // console.log('scale n2', scale('n2'));
      // console.log('scale n3', scale('n3'));

      // let text = new PointLayer({ zIndex: 2 })
      //   .source(
      //     [
      //       {
      //         lng: aspaceLnglat[0] + 0.0002,
      //         lat: aspaceLnglat[1],
      //         name: '00',
      //       },
      //     ],
      //     {
      //       parser: {
      //         type: 'json',
      //         x: 'lng',
      //         y: 'lat',
      //       },
      //     },
      //   )
      //   // .shape('100m', 'text')
      //   // .shape('circle')
      //   .shape('name', ['00'])
      //   .size(25)
      //   // .color('#0f0')
      //   // .select(true)
      //   .style({
      //     // textOffset: [50, 20],
      //   });

      // text.on('click', () => {
      //   alert('***');
      // });

      // scene.addLayer(text);
      // scene.addLayer(line);

      // scene.addLayer(layer2);
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

    // layer.on('unclick', (e) => {
    //   console.log('unclick');
    // });

    // layer.on('dbclick', () => {
    //   console.log('dbclick')
    // })

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
