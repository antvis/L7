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
      opacity: 0.6,
    });
  }
  return res;
}

function createMarker(
  lng: number,
  lat: number,
  time: string,
  loc: string,
  event: string,
) {
  const dom = document.createElement('div');
  dom.innerHTML = `
    <div class="infoPlane" style="
    zIndex: 99;
    padding: 5px;
    border-radius: 6px;
    background: rgba(173,216,230, 0.8);
    color: #DC143C;
    ">
    <div style="
    
    font-size: 12px;
    font-weight: 800;
    border-bottom: 1px #DC143C;
    ">${time}</div>

    <div style="
    height: 1px;
    width: 95%;
    margin: 0 auto;
    background: #DC143C;
    "></div>

    <div style="
    font-size: 12px;
    ">${loc}</div>

    <div style="
    font-size: 12px;
    ">${event}</div>
    
    </div>
    `;
  const marker = new Marker().setLnglat({ lng, lat }).setElement(dom);
  return marker;
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
          const lnglatData2 = getLngLat2(jsonData);

          const pointLayers = new PointLayer()
            .source(jsonData, {
              parser: {
                type: 'json',
                x: 'lng',
                y: 'lat',
              },
            })
            .shape('circle')
            .size(5)
            .color('#DC143C');

          scene.addLayer(pointLayers);

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
            addMarker(jsonData, 0);
          }, 600);

          function addMarker(data: any[], index: number) {
            let d = data[index];
            if (!d) {
              return;
            }
            setTimeout(() => {
              let m = createMarker(d.lng, d.lat, d.time, d.loc, d.do);
              scene.addMarker(m);

              let lineData = cloneDeep(lnglatData2);
              if (lineData[index]) {
                lineData[index].opacity = 1;
                linelayer.setData(lineData);
              }

              addMarker(data, index + 1);
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
