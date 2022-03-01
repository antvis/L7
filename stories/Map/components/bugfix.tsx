// @ts-nocheck
import React from 'react';
import { Scene, GaodeMap, GaodeMapV2, PointLayer } from '@antv/l7';
const data = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: {
        w: 19.1,
        t: 24.6,
        s: "海南",
        l: 11,
        m: "东方",
        j: 108.6167,
        h: "59838",
        id: 1
      },
      geometry: {
        type: "Point",
        coordinates: [108.6167, 19.1]
      }
    },
    {
      type: "Feature",
      properties: {
        w: 20,
        t: 23.8,
        s: "海南",
        l: 11,
        m: "海口",
        j: 110.25,
        h: "59758",
        id: 2
      },
      geometry: {
        type: "Point",
        coordinates: [110.25, 20]
      }
    },
    {
      type: "Feature",
      properties: {
        w: 22.275,
        t: 23.6,
        s: "广东",
        l: 12,
        m: "珠海",
        j: 113.5669,
        h: "59488",
        id: 3
      },
      geometry: {
        type: "Point",
        coordinates: [113.5669, 22.275]
      }
    },
    {
      type: "Feature",
      properties: {
        w: 20.3372,
        t: 23.4,
        s: "广东",
        l: 12,
        m: "徐闻",
        j: 110.1794,
        h: "59754",
        id: 4
      },
      geometry: {
        type: "Point",
        coordinates: [110.1794, 20.3372]
      }
    },
    {
      type: "Feature",
      properties: {
        w: 19.2089,
        t: 23.2,
        s: "海南",
        l: 12,
        m: "琼海",
        j: 110.4819,
        h: "59855",
        id: 5
      },
      geometry: {
        type: "Point",
        coordinates: [110.4819, 19.2089]
      }
    }
  ]
};

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
        // center: [121.434765, 31.256735],
        // zoom: 14.83,
        pitch: 0,
        style: "light",
        center: [121.434765, 31.256735],
        zoom: 14.83
      }),
    });
    this.scene = scene;

    scene.addImage(
      '00',
      'https://gw.alipayobjects.com/zos/basement_prod/604b5e7f-309e-40db-b95b-4fac746c5153.svg',
    );

    scene.addImage(
      "广东",
      "https://gw.alipayobjects.com/zos/basement_prod/604b5e7f-309e-40db-b95b-4fac746c5153.svg"
    );
    scene.addImage(
      "海南",
      "https://gw.alipayobjects.com/zos/basement_prod/30580bc9-506f-4438-8c1a-744e082054ec.svg"
    );

    scene.on('loaded', () => {
      // fetch(
      //   'https://gw.alipayobjects.com/os/basement_prod/893d1d5f-11d9-45f3-8322-ee9140d288ae.json',
      // )
      //   .then((res) => res.json())
      //   .then((data) => {
      //     const imageLayer = new PointLayer()
      //       .source(data, {
      //         parser: {
      //           type: 'json',
      //           x: 'longitude',
      //           y: 'latitude',
      //         },
      //       })
      //       .shape('name', ['00'])
      //       .size(10);

      //     let d = {
      //       coordinates: (2)[(121.4318415, 31.25682515)],
      //       count: 2,
      //       id: '5011000005647',
      //       latitude: 31.25682515,
      //       longitude: 121.4318415,
      //       name: '石泉路140弄',
      //       unit_price: 52256.3,
      //     };
      //     const imageLayer1 = new PointLayer()
      //       .source([], {
      //         parser: {
      //           type: 'json',
      //           x: 'longitude',
      //           y: 'latitude',
      //         },
      //       })
      //       .shape('name', ['00'])
      //       .size(25);

      //     scene.addLayer(imageLayer);
      //     scene.addLayer(imageLayer1);

      //     imageLayer.on('click', (e) => {
      //       // console.log(e);
      //       // imageLayer1.setBlend('normal')
      //       imageLayer1.setData([e.feature]);
      //     });
      //   });

      const imageLayer = new PointLayer()
      .source(data)
      .shape("s", (s) => s)
      .size(10)
      .fitBounds();

    const imageLayer1 = new PointLayer({layerType: 'image'})
      .source({
        features: [],
        type: "FeatureCollection"
      })
      .shape("s", (s) => s)
      .size(20);

    scene.addLayer(imageLayer);
    scene.addLayer(imageLayer1);

    imageLayer.on("click", (e) => {
      console.log(e.feature);

      imageLayer1.setData({
        features: [e.feature],
        type: "FeatureCollection"
      });
    });

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
