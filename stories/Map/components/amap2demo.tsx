import { PointLayer, Scene } from '@antv/l7';
import { GaodeMapV2 } from '@antv/l7-maps';
import * as React from 'react';
export default class Amap2demo extends React.Component {
  // @ts-ignore
  private scene: Scene;

  public componentWillUnmount() {
    this.scene.destroy();
  }

  public async componentDidMount() {
    const scene = new Scene({
      id: 'map',
      map: new GaodeMapV2({
        center: [121.107846, 30.267069],
        pitch: 0,
        style: 'normal',
        zoom: 20,
        animateEnable: false,
      }),
    });
    let originData = [
      {
        lng: 121.107846,
        lat: 30.267069,
        opacity2: 0.2,
        strokeOpacity2: 0.4,
        strokeColor: '#000',
        strokeWidth: 0.5,
        // offsets2: [0, 0]
        offsets2: [100, 100],
      },
      {
        lng: 121.107,
        lat: 30.267069,
        opacity2: 0.4,
        strokeOpacity2: 0.6,
        strokeColor: '#0f0',
        strokeWidth: 2,
        offsets2: [100, 100],
      },
      {
        lng: 121.107846,
        lat: 30.26718,
        opacity2: 0.6,
        strokeOpacity2: 0.8,
        strokeColor: '#f00',
        strokeWidth: 4,
        // offsets2: [200, 200]
        offsets2: [100, 100],
      },
      // {
      //   lng: 38.54,
      //   lat: 77.02,
      //   opacity: 0.5
      //   strokeColor: "#ff0"
      // },
    ];
    this.scene = scene;
    // https://gw-office.alipayobjects.com/bmw-prod/61c3fca0-2991-48b4-bb6d-ecc2cbd682dd.json // 100 * 100
    let hunredMhunred =
      'https://gw-office.alipayobjects.com/bmw-prod/61c3fca0-2991-48b4-bb6d-ecc2cbd682dd.json';
    // https://gw-office.alipayobjects.com/bmw-prod/ccc91465-d3ea-4eda-a178-7c1815dac32b.json // 1000 * 100
    let thousandMhundred =
      'https://gw-office.alipayobjects.com/bmw-prod/ccc91465-d3ea-4eda-a178-7c1815dac32b.json';
    scene.on('loaded', () => {
      for (let i = 0; i < 1; i++) {
        // fetch(thousandMhundred)
        //   .then((res) => res.text())
        //   .then((data) => {
        //     // console.log('data', data)
        //     // lng: Math.random() * 180,       // 0 ~ 180
        //     // lat: Math.random() * 100 - 50,  // -50 ~ 50
        //     // customOpacity: Math.random(),
        //     // customStroke: `rgb(${Math.random()*255}, ${Math.random()*255}, ${Math.random()*255}, 1)`,
        //     // customStrokeOpacity: Math.random(),
        //     // customStrokeWidth: Math.random() * 5,
        //     let layer = new PointLayer()
        //       .source(JSON.parse(data), {
        //         parser: {
        //           type: 'json',
        //           x: 'lng',
        //           y: 'lat',
        //         },
        //       })
        //       .shape('circle')
        //       .color('rgba(255, 0, 0, 1.0)')
        //       .size(10)
        //       .style({
        //         opacity: 'customOpacity',
        //         // strokeOpacity: 'customStrokeOpacity',
        //         // strokeWidth: 'customStrokeWidth',
        //         // stroke: 'customStroke',
        //       });
        //     scene.addLayer(layer);
        //   });
        let layer = new PointLayer()
          .source(originData, {
            parser: {
              type: 'json',
              x: 'lng',
              y: 'lat',
            },
          })
          .shape('circle')
          // .shape('normal')
          // .color('rgba(255, 0, 0, 0.9)')
          // .shape('cylinder')
          .color('rgba(255, 0, 0, 1.0)')
          // .size(10)
          .size([10, 10, 100])
          // .offsets('123')
          .style({
            // stroke: '#000',
            // stroke: 'rgba(0, 255, 0, 1)',
            // stroke: 'strokeColor',
            // stroke: ['strokeColor', (d: any) => {
            //   return d
            // }],
            // stroke: ['strokeColor', ["#f00", "#ff0"]],

            strokeWidth: 4,
            // strokeWidth: "strokeWidth",
            // strokeWidth: ["strokeWidth", [1, 2]],
            // strokeWidth: ["strokeWidth", (d: any) => {
            //   return d * 2
            // }],

            // strokeOpacity: 0.5,
            // strokeOpacity: 'strokeOpacity2',
            // strokeOpacity: 1.0,
            // strokeOpacity: [
            //   'strokeOpacity2',
            //   (d: any) => {
            //     // console.log('strokeOpacity2', d)
            //     return d*2;
            //   },
            // ],
            // strokeOpacity: ['opacity2', [0.2, 0.6]],

            // offsets: [100, 100],
            // offsets: 'offsets2',
            // offsets: ['offsets2', (d: any) => d],

            opacity: 'opacity2',
            // opacity: 0.2
            // opacity: 0,
            // opacity: ['opacity2', (d: any) => {
            //   return d
            // }]
            // opacity: ['opacity2', [0.2, 0.6]],
          })
          .active(true);
        scene.addLayer(layer);
      }
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
