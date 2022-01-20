import { LineLayer, Scene, PointLayer, flow } from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';
import * as React from 'react';

import { animate, linear } from 'popmotion';
export default class Amap2demo_road extends React.Component {
  // @ts-ignore
  private scene: Scene;

  public componentWillUnmount() {
    this.scene.destroy();
  }

  public async componentDidMount() {
    const scene = new Scene({
      id: 'map',
      map: new GaodeMap({
        center: [120.1145, 30.221],
        // pitch: 50,
        // zoom: 3,
        zoom: 18,
      }),
    });
    this.scene = scene;

    scene.on('loaded', () => {
      fetch(
        'https://gw.alipayobjects.com/os/bmw-prod/91d27a97-869a-459b-a617-498dcc9c3e7f.json',
      )
        .then((res) => res.json())
        .then((data) => {
          scene.addImage(
            'road',
            'https://gw.alipayobjects.com/mdn/rms_23a451/afts/img/A*haGlTpW2BQgAAAAAAAAAAAAAARQnAQ',
          );
          // console.log(JSON.stringify(data))
          const sd = {
            type: 'FeatureCollection',
            name: 'dl2',
            crs: {
              type: 'name',
              properties: { name: 'urn:ogc:def:crs:OGC:1.3:CRS84' },
            },
            features: [
              {
                type: 'Feature',
                properties: {},
                geometry: {
                  type: 'MultiLineString',
                  coordinates: [
                    [
                      // [120.11027762631404,30.220048357654356],[120.11029802795247,30.220031192034003],

                      // [120.11537138928367,30.220576596834615],[120.11542116044198,30.220559410348244],
                      // [120.11546929756481,30.220529965646563],[120.11553130467559,30.220472730362285],
                      // [120.1155957570006,30.22039587970547],[120.1156642867787,30.220299415182613],

                      // [120.1159482136973,30.220123566850905],[120.1159963526167,30.22011536905906],
                      // [120.11605836242249,30.220107164280375],[120.11614974444305,30.220089134723217],

                      // [120.11682112103189,30.218797596765366],[120.11683172384723,30.21875509667716],
                      // [120.11683661697057,30.218722406737285],[120.11684069172867,30.218678275728166],
                      [120.10236740112303, 30.25469303741397],
                      [120.104341506958, 30.252542952311455],
                      [120.10622978210449, 30.250096246503063],
                      [120.10974884033202, 30.248613364842253],
                      [120.11017799377441, 30.24661143909856],
                      [120.11069297790527, 30.244387029323946],
                      [120.11120796203613, 30.24245916678936],
                      [120.11404037475586, 30.24156937132543],
                      [120.11773109436037, 30.24194012041444],
                      [120.12099266052248, 30.241865970708517],
                      [120.12073516845703, 30.24053126643564],
                      [120.12219429016112, 30.238455023761645],
                      [120.12537002563475, 30.240086360983426],
                      [120.12837409973145, 30.242533316047716],
                      [120.12760162353517, 30.24661143909856],
                      [120.12605667114256, 30.249503096524485],
                      [120.12639999389648, 30.2540999151896],
                      [120.12579917907715, 30.25521201642245],
                      [120.12339591979979, 30.25521201642245],
                      [120.12219429016112, 30.253729211980726],
                      [120.11979103088379, 30.253877493432157],
                      [120.11893272399901, 30.251282535717067],
                      [120.11773109436037, 30.249280664359304],
                      [120.11507034301759, 30.249058231690526],

                      // [
                      //   120.11507034301759,
                      //   30.249058231690526
                      // ],
                      // [
                      //   120.12,
                      //   30.249058231690526
                      // ]
                    ],
                  ],
                },
              },
            ],
          };
          // @ts-ignore
          const layer = new LineLayer()
            .source(sd)
            .size(10)
            .shape('line')
            .texture('road')
            .color('rgb(20, 180, 90)')
            // .animate({
            //   interval: 1, // 间隔
            //   duration: 1, // 持续时间，延时
            //   trailLength: 2, // 流线长度
            // })
            .style({
              lineTexture: true, // 开启线的贴图功能
              iconStep: 200, // 设置贴图纹理的间距
            });

          layer.on('inited', () => {
            const source = layer.getSource();
            const coords = source?.data?.dataArray[0]?.coordinates;
            // .slice(0, 40)
            // console.log(source?.data?.dataArray[0]?.coordinates.slice(0, 3))
            // const coords = [
            //   [120, 30.220048357654356],
            //   // [120.2, 30.220048357654356],
            //   [120.5, 30.220031192034003]
            // ]

            // const path = flow(coords, 20000);
            const path = flow(coords, 20000);

            runPath(path, 0);

            // @ts-ignore
            function runPath(pathData: any, startIndex: number) {
              // console.log(startIndex)
              const path = pathData[startIndex];

              if (!path) return;
              const { start, end, duration, rotation } = path;
              // scene.setRotation(rotation)
              let timer0 = animate({
                from: {
                  rotation: 360 - scene.getRotation(),
                },
                to: {
                  rotation: rotation,
                },
                ease: linear,
                duration: 300,
                onUpdate: (o) => {
                  scene.setRotation(o.rotation);
                },
                onComplete: () => {
                  timer0.stop();
                  // @ts-ignore
                  timer0 = null;

                  let timer = animate({
                    from: {
                      lng: start[0],
                      lat: start[1],
                      // rotation: 360 - scene.getRotation(),

                      // rotation: 0,
                    },
                    to: {
                      lng: end[0],
                      lat: end[1],
                      // rotation: rotation,// + 180,
                      // rotation: 270
                    },
                    ease: linear,
                    duration,
                    onUpdate: (o) => {
                      scene.setCenter([o.lng, o.lat]);
                      // scene.setRotation(o.rotation)
                    },
                    onComplete: () => {
                      timer.stop();
                      // @ts-ignore
                      timer = null;
                      runPath(pathData, startIndex + 1);
                    },
                  });

                  // ===
                },
              });
            }
          });

          scene.addLayer(layer);
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
        />
      </>
    );
  }
}
