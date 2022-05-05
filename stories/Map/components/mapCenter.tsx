// @ts-ignore
import { PointLayer, Scene, LineLayer, PolygonLayer, ILayer } from '@antv/l7';
import { GaodeMap, GaodeMapV2, Mapbox, Map } from '@antv/l7-maps';
import * as React from 'react';
import * as turf from '@turf/turf';
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
        center: [120.11, 30.264701434772807],
        zoom: 14,
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

    let layer0 = new PointLayer({ zIndex: 2 })
      .source(
        [
          {
            lng: 120.11,
            lat: 30.27,
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
      .color('#ff0')
      .shape('circle')
      .size(30);

    let layer01 = new PointLayer({ zIndex: 2 })
      .source(
        [
          {
            lng: 120.11,
            lat: 30.27,
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
      .color('#ff0')
      .shape('circle')
      .size(30)
      .style({
        // raisingHeight: 50
        raisingHeight: 5000,
      });

    layer0.on('click', () => {});

    let layer2 = new PointLayer({}) // blend: 'additive'
      .source(
        [
          {
            lng: 120.11,
            lat: 30.264701434772807,
            name: 'n3',
          },
          {
            lng: 120.111,
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
      );

    let layer = new PointLayer({}) // blend: 'additive'
      .source(
        [
          {
            lng: 120.11,
            lat: 30.264701434772807,
            name: 'n3',
          },
          {
            lng: 120.111,
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
      // .color('#66CCFF')
      .color('#f00')
      // .color('name', ['#f00', '#ff0'])
      // .size([100, 100, 1000])
      // .size([20, 20, 200])
      .size(50)
      // .size('name', [20, 40])
      // .animate({
      //   // enable: true,
      //   enable: false,
      //   // type: 'www'
      // })
      .animate(true)
      .active(true)
      // .active({
      //   color: '#f00',
      //   mix: 0
      // })
      .select(true)
      // .active({ color: '#ff0' })
      .style({
        // heightfixed: true,
        // pickLight: false,
        // pickLight: true,
        // lightEnable: true,
        // blur: 0.2,
        // opacity: 0.3,
        stroke: '#ff0',
        strokeWidth: 10,
        // strokeWidth: 0,
        // strokeOpacity: 1,
        // unit: 'meter',
      });

    layer2
      .shape('circle')
      .color('#f00')
      .size(50)
      .animate(true)
      .active(true)
      .style({
        raisingHeight: 5000,
      });

    this.scene = scene;

    scene.on('loaded', () => {
      scene.addLayer(layer0);
      scene.addLayer(layer01);
      scene.addLayer(layer);
      scene.addLayer(layer2);

      scene.on('click', (e) => {
        console.log(scene.getPickedLayer());
      });
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
