import { PointLayer, Scene, LineLayer, PolygonLayer } from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';
import * as React from 'react';
const data = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: {
        testOpacity: 0.4,
      },
      geometry: {
        type: 'MultiPolygon',
        coordinates: [
          [
            [
              [110.5224609375, 32.731840896865684],
              [113.0712890625, 32.731840896865684],
              [113.0712890625, 34.56085936708384],
              [110.5224609375, 34.56085936708384],
              [110.5224609375, 32.731840896865684],
            ],
            [
              [111.26953125, 33.52307880890422],
              [111.26953125, 34.03445260967645],
              [112.03857421875, 34.03445260967645],
              [112.03857421875, 33.52307880890422],
              [111.26953125, 33.52307880890422],
            ],
          ],
          [
            [
              [115.04882812499999, 34.379712580462204],
              [114.9609375, 33.46810795527896],
              [115.8837890625, 33.50475906922609],
              [115.86181640625001, 34.379712580462204],
              [115.04882812499999, 34.379712580462204],
            ],
          ],
        ],
      },
    },
  ],
};
export default class Amap2demo_image extends React.Component {
  // @ts-ignore
  private scene: Scene;
  private imageLayer: any;
  private imageLayer2: any;
  private imageLayer3: any;
  private lineLayer: any;
  private polygonLayer: any;
  private polygonLine: any;

  public componentWillUnmount() {
    this.scene.destroy();
  }

  public async componentDidMount() {
    const scene = new Scene({
      id: 'map',
      map: new GaodeMap({
        pitch: 0,
        style: 'light',
        center: [121.434765, 31.256735],
        zoom: 12,
        viewMode: '3D',
      }),
    });
    this.scene = scene;
    let originData = [
      {
        id: '5011000000404',
        name: '铁路新村(华池路)',
        longitude: 121.4316962,
        latitude: 31.26082325,
        unit_price: 71469.4,
        count: 2,
        opacity: 0.5,
        offsets: [0, 0],
      },
      {
        id: '5011000002716',
        name: '金元坊',
        longitude: 121.3810096,
        latitude: 31.25302026,
        unit_price: 47480.5,
        count: 2,
        opacity: 0.5,
        offsets: [100, 0],
      },
      {
        id: '5011000003403',
        name: '兰溪路231弄',
        longitude: 121.4086229,
        latitude: 31.25291206,
        unit_price: 55218.4,
        count: 2,
        opacity: 0.8,
      },
      {
        id: '5011000003652',
        name: '兰溪公寓',
        longitude: 121.409227,
        latitude: 31.251014,
        unit_price: 55577.8,
        count: 2,
        opacity: 0.8,
      },
      {
        id: '5011000004139',
        name: '梅岭新村',
        longitude: 121.400946,
        latitude: 31.24946565,
        unit_price: 63028.1,
        count: 2,
        opacity: 1.0,
      },
    ];
    scene.addImage(
      '00',
      'https://gw.alipayobjects.com/zos/basement_prod/604b5e7f-309e-40db-b95b-4fac746c5153.svg',
      // "https://gw-office.alipayobjects.com/bmw-prod/ae2a8580-da3d-43ff-add4-ae9c1bfc75bb.svg"
    );
    scene.addImage(
      '01',
      'https://gw.alipayobjects.com/zos/basement_prod/30580bc9-506f-4438-8c1a-744e082054ec.svg',
    );
    scene.addImage(
      '02',
      'https://gw.alipayobjects.com/zos/basement_prod/7aa1f460-9f9f-499f-afdf-13424aa26bbf.svg',
    );

    scene.on('loaded', () => {
      // this.polygonLayer = new PolygonLayer({
      // })
      // this.polygonLayer.source({
      //     type: 'FeatureCollection',
      //     features: [],
      //   })
      //   .shape('fill')
      //   .color('red')
      //   .style({
      //     opacity: 0.5
      //   });
      // scene.addLayer(this.polygonLayer);

      // this.polygonLine = new PolygonLayer({
      // })

      //   this.polygonLine.source({
      //     type: 'FeatureCollection',
      //     features: [],
      //   })
      //   .shape('line')
      //   .color('#00f')
      //   .style({
      //     opacity: 0.8
      //   });
      // scene.addLayer(this.polygonLine);

      // this.lineLayer = new LineLayer({
      //   zIndex: 7,
      //   pickingBuffer: 4,
      // });
      // this.lineLayer
      //   .source({
      //     type: 'FeatureCollection',
      //     features: [],
      //   })
      //   .shape('line')
      //   .size(10)
      //   .color('#f00')
      //   scene.addLayer(this.lineLayer)
      // this.imageLayer = new PointLayer({
      //   blend: "normal"
      // })
      // this.imageLayer.source([], {
      //     parser: {
      //       type: 'json',
      //       x: 'longitude',
      //       y: 'latitude',
      //     },
      //   })
      //   .shape('name', ['00'])
      //   .size(20)
      //   .style({
      //     opacity: 0.5
      //   });
      // scene.addLayer(this.imageLayer);
      // this.imageLayer2 = new PointLayer({
      //   blend: "normal"
      // })
      // this.imageLayer2.source([], {
      //     parser: {
      //       type: 'json',
      //       x: 'longitude',
      //       y: 'latitude',
      //     },
      //   })
      //   .shape('name', ['02'])
      //   .size(20)
      //   .style({
      //     opacity: 0.5
      //   });
      // scene.addLayer(this.imageLayer2);
      // this.imageLayer3 = new PointLayer({
      //   blend: "normal"
      // })
      // this.imageLayer3.source([], {
      //     parser: {
      //       type: 'json',
      //       x: 'longitude',
      //       y: 'latitude',
      //     },
      //   })
      //   .shape('name', ['00'])
      //   .size(20)
      //   .style({
      //     opacity: 0.5
      //   });
      // scene.addLayer(this.imageLayer3);

      for (let i = 0; i < 17; i++) {
        // > 16 * 2
        // var testdata = [{
        //   longitude: 121.43 + Math.random() * -0.2 + 0.1,
        //   latitude: 31.26 + Math.random() + -0.2 + 0.1,
        // }]
        var testdata: any[] = [];
        let layer = new PointLayer({
          blend: 'normal',
        });
        layer
          .source(testdata, {
            parser: {
              type: 'json',
              x: 'longitude',
              y: 'latitude',
            },
          })
          .color('#ff0')
          // .shape('name', ['00'])
          .size(20);
        scene.addLayer(layer);

        // let layer = new PolygonLayer({
        // })
        // layer.source({
        //     type: 'FeatureCollection',
        //     features: [],
        //   })
        //   .shape('fill')
        //   .color('red')
        //   .style({
        //     opacity: 0.5
        //   });
        // scene.addLayer(layer);
      }
      console.log(scene.getLayers());
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
