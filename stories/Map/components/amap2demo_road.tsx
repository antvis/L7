import {
  LineLayer,
  Scene,
  PointLayer,
  flow,
  MarkerLayer,
  Marker,
} from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';
import * as React from 'react';
import { animate, linear } from 'popmotion';

interface IObject {
  [key: string]: any;
}

function parseCSV(data: string) {
  let arr = data.split('\n');
  if (arr && arr[0]) {
    let columns = arr[0].replace('\r', '').split(',');
    let rows = arr.slice(1).map((d: string) => d.split(','));

    let json = rows.map((row: string[]) => {
      let object: IObject = {};
      row.map((e: string, i: number) => {
        let str = e.replace('\r', '');
        let key = columns[i].replace('\n', '');
        // console.log('key', key)
        object[key] = str;
        return '';
      });
      return object;
    });
    return json;
  }
  return [];
}

function getLngLat(data: any) {
  return data.map((d: any) => {
    return [+d.lng, +d.lat];
  });
}
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
        center: [116.35, 40],
        zoom: 12,
        // zoom: 3
      }),
    });
    this.scene = scene;
    scene.on('loaded', () => {
      fetch(
        'https://gw.alipayobjects.com/os/bmw-prod/89aa8682-2245-448b-be0d-710308cd63a6.csv',
      )
        .then((res) => res.text())
        .then((data) => {
          const jsonData = parseCSV(data);
          const lnglatData = getLngLat(jsonData);

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
                      // [120.10236740112303, 30.25469303741397],
                      // [120.104341506958, 30.252542952311455],
                      // [120.10622978210449, 30.250096246503063],
                      // [120.10974884033202, 30.248613364842253],
                      // [120.11017799377441, 30.24661143909856],
                      // [120.11069297790527, 30.244387029323946],
                      // [120.11120796203613, 30.24245916678936],
                      // [120.11404037475586, 30.24156937132543],
                      // [120.11773109436037, 30.24194012041444],
                      // [120.12099266052248, 30.241865970708517],
                      // [120.12073516845703, 30.24053126643564],
                      // [120.12219429016112, 30.238455023761645],
                      // [120.12537002563475, 30.240086360983426],
                      // [120.12837409973145, 30.242533316047716],
                      // [120.12760162353517, 30.24661143909856],
                      // [120.12605667114256, 30.249503096524485],
                      // [120.12639999389648, 30.2540999151896],
                      // [120.12579917907715, 30.25521201642245],
                      // [120.12339591979979, 30.25521201642245],
                      // [120.12219429016112, 30.253729211980726],
                      // [120.11979103088379, 30.253877493432157],
                      // [120.11893272399901, 30.251282535717067],
                      // [120.11773109436037, 30.249280664359304],
                      // [120.11507034301759, 30.249058231690526],

                      ...lnglatData,

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

          const linelayer = new LineLayer({ blend: 'normal' })
            .source(sd)
            .size(2)
            .shape('line')
            .color('#8C1EB2')
            // .animate({
            //   interval: 1, // 间隔
            //   duration: 1, // 持续时间，延时
            //   trailLength: 2, // 流线长度
            // })
            .style({
              // opacity: 'opacity',
              sourceColor: '#f00', // 起点颜色
              targetColor: '#0f0', // 终点颜色
            });

          linelayer.on('inited', () => {
            const source = linelayer.getSource();
            const coords = source?.data?.dataArray[0]?.coordinates;

            const path = flow(coords, 50000);

            runPath(path, 0);

            // @ts-ignore
            function runPath(pathData: any, startIndex: number) {
              const path = pathData[startIndex];

              if (!path) return;
              const { start, end, duration, rotation } = path;
              let startRotation = 360 - scene.getRotation();
              let timer0 = animate({
                from: {
                  rotation: startRotation,
                },
                to: {
                  rotation: rotation,
                },
                ease: linear,
                duration: 600,
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
                    },
                    to: {
                      lng: end[0],
                      lat: end[1],
                    },
                    ease: linear,
                    duration,
                    onUpdate: (o) => {
                      scene.setCenter([o.lng, o.lat]);
                    },
                    onComplete: () => {
                      timer.stop();
                      // @ts-ignore
                      timer = null;
                      setTimeout(() => {
                        runPath(pathData, startIndex + 1);
                      }, 500);
                    },
                  });
                },
              });
            }
          });

          scene.addLayer(linelayer);
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
