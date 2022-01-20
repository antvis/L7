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
import { cloneDeep } from 'lodash';

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
        object[key] = str;
        return '';
      });
      return object;
    });
    return json;
  }
  return [];
}

function getLngLat2(data: any) {
  let res = [];
  for (let i = 0; i < data.length - 1; i++) {
    let start = data[i];
    let end = data[i + 1];
    res.push({
      lng1: start.lng,
      lat1: start.lat,
      lng2: end.lng,
      lat2: end.lat,
      opacity: 0.4,
    });
  }
  return res;
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
        zoom: 3,
        style: 'dark',
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
          jsonData.map((d: any, i: number) => (d.index = i + 1));

          const lnglatData2 = getLngLat2(jsonData);

          const pointLayers = new PointLayer()
            .source([jsonData[0]], {
              parser: {
                type: 'json',
                x: 'lng',
                y: 'lat',
              },
            })
            .shape('circle')
            .size(5)
            .color('#DC143C')
            .style({
              opacity: 0.5,
            });
          scene.addLayer(pointLayers);

          const pointLayer2 = new PointLayer()
            .source([jsonData[0]], {
              parser: {
                type: 'json',
                x: 'lng',
                y: 'lat',
              },
            })
            .shape('circle')
            .size(14)
            .color('rgba(255, 0, 0, 0.01)')
            // .color('')
            .style({
              strokeWidth: 2,
              stroke: '#f00',
              opacity: 1,
              offsets: [21, 2],
            });
          scene.addLayer(pointLayer2);

          const pointText = new PointLayer()
            .source([jsonData[0]], {
              parser: {
                type: 'json',
                x: 'lng',
                y: 'lat',
              },
            })
            .shape('index', 'text')
            .size(18)
            .color('#f00')
            .style({
              textAnchor: 'center',
              textOffset: [28, 0],
              textAllowOverlap: true,
            });

          scene.addLayer(pointText);

          const linelayer = new LineLayer({ blend: 'normal', autoFit: true })
            .source(lnglatData2, {
              parser: {
                type: 'json',
                x: 'lng1',
                y: 'lat1',
                x1: 'lng2',
                y1: 'lat2',
              },
            })
            .size(2)
            .shape('arc')
            .color('#DC143C')
            .animate({
              interval: 1, // 间隔
              duration: 1, // 持续时间，延时
              trailLength: 2, // 流线长度
            })
            .style({
              opacity: 'opacity',
            });
          scene.addLayer(linelayer);
          setTimeout(() => {
            addPoint(0);
          }, 600);
          function addPoint(index: number) {
            let d = data[index];
            if (!d) {
              return;
            }
            setTimeout(() => {
              let pointData = cloneDeep(jsonData);

              pointLayers.setData(pointData.slice(0, index + 1));
              pointLayer2.setData(pointData.slice(0, index + 1));
              pointText.setData(pointData.slice(0, index + 1));

              let lineData = cloneDeep(lnglatData2);
              if (lineData[index]) {
                lineData[index].opacity = 1;
                linelayer.setData(lineData);
              }

              addPoint(index + 1);
            }, 400);
          }
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
