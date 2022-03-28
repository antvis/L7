import { PolygonLayer, Scene, LineLayer, PointLayer } from '@antv/l7';
import { GaodeMap, GaodeMapV2, Mapbox } from '@antv/l7-maps';
import * as React from 'react';

export default class Amap2demo_polygon_extrude extends React.Component {
  private gui: dat.GUI;
  private $stats: Node;
  // @ts-ignore
  private scene: Scene;

  public componentWillUnmount() {
    this.scene.destroy();
  }

  public async componentDidMount() {
    // const response = await fetch(
    //   // 'https://gw.alipayobjects.com/os/basement_prod/f79485d8-d86f-4bb3-856d-537b586be06e.json',
    //   // 'https://gw.alipayobjects.com/os/basement_prod/619a6f16-ecb0-4fca-9f9a-b06b67f6f02b.json',
    //   'https://gw.alipayobjects.com/os/bmw-prod/93a55259-328e-4e8b-8dc2-35e05844ed31.json'
    // );
    const scene = new Scene({
      id: 'map',
      map: new GaodeMap({
        // map: new GaodeMapV2({
        // map: new Mapbox({
        // pitch: 0,
        style: 'dark',
        // center: [-44.40673828125, -18.375379094031825],
        // zoom: 13,
        center: [120, 29.732983],
        zoom: 6.2,
        pitch: 60,
      }),
    });
    this.scene = scene;
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
        {
          type: 'Feature',
          properties: {
            testOpacity: 1,
          },
          geometry: {
            type: 'Polygon',
            coordinates: [
              [
                [113.8623046875, 30.031055426540206],
                [116.3232421875, 30.031055426540206],
                [116.3232421875, 31.090574094954192],
                [113.8623046875, 31.090574094954192],
                [113.8623046875, 30.031055426540206],
              ],
              [
                [117.26806640625, 32.13840869677249],
                [118.36669921875, 32.13840869677249],
                [118.36669921875, 32.47269502206151],
                [117.26806640625, 32.47269502206151],
                [117.26806640625, 32.13840869677249],
              ],
            ],
          },
        },
      ],
    };

    // const layer = new PolygonLayer({
    //   autoFit: true,
    // })
    //   .source(data)
    //   // .shape('fill')
    //   .shape('extrude')
    //   .color('red')
    //   .size(600000)
    //   .style({
    //     // pickLight: true,
    //     heightfixed: true,
    //     // heightfixed: false,
    //     opacity: 'testOpacity',
    //   })
    //   .active(true);
    // scene.addLayer(layer);

    // @ts-ignore
    let lineDown, lineUp, textLayer;

    fetch('https://geo.datav.aliyun.com/areas_v3/bound/330000_full.json')
      .then((res) => res.json())
      .then((data) => {
        let texts: any[] = [];

        data.features.map((option: any) => {
          const { name, center } = option.properties;
          const [lng, lat] = center;
          texts.push({ name, lng, lat });
        });

        textLayer = new PointLayer({ zIndex: 2 })
          .source(texts, {
            parser: {
              type: 'json',
              x: 'lng',
              y: 'lat',
            },
          })
          .shape('name', 'text')
          .size(14)
          .color('#0ff')
          .style({
            textAnchor: 'center', // 文本相对锚点的位置 center|left|right|top|bottom|top-left
            spacing: 2, // 字符间距
            padding: [1, 1], // 文本包围盒 padding [水平，垂直]，影响碰撞检测结果，避免相邻文本靠的太近
            stroke: '#0ff', // 描边颜色
            strokeWidth: 0.2, // 描边宽度
            raisingHeight: 200000 + 150000 + 10000,
            textAllowOverlap: true,
          });
        scene.addLayer(textLayer);

        lineDown = new LineLayer()
          .source(data)
          .shape('line')
          .color('#0DCCFF')
          .size(1)
          .style({
            raisingHeight: 200000,
          });

        lineUp = new LineLayer({ zIndex: 1 })
          .source(data)
          .shape('line')
          .color('#0DCCFF')
          .size(1)
          .style({
            raisingHeight: 200000 + 150000,
          });

        scene.addLayer(lineDown);
        scene.addLayer(lineUp);
      });

    fetch('https://geo.datav.aliyun.com/areas_v3/bound/330000.json')
      .then((res) => res.json())
      .then((data) => {
        const lineLayer = new LineLayer()
          .source(data)
          .shape('wall')
          .size(150000)
          .style({
            heightfixed: true,
            opacity: 0.6,
            sourceColor: '#0DCCFF',
            targetColor: 'rbga(255,255,255, 0)',
          });
        scene.addLayer(lineLayer);

        const provincelayer = new PolygonLayer({})
          .source(data)
          .size(150000)
          .shape('extrude')
          .color('#0DCCFF')
          .active({
            color: 'rgb(100,230,255)',
          })
          .style({
            heightfixed: true,
            pickLight: true,
            raisingHeight: 200000,
            opacity: 0.8,
          });

        scene.addLayer(provincelayer);

        provincelayer.on('mousemove', () => {
          provincelayer.style({
            raisingHeight: 200000 + 100000,
          });
          // @ts-ignore
          lineDown.style({
            raisingHeight: 200000 + 100000,
          });
          // @ts-ignore
          lineUp.style({
            raisingHeight: 200000 + 150000 + 100000,
          });
          // @ts-ignore
          textLayer.style({
            raisingHeight: 200000 + 150000 + 10000 + 100000,
          });
        });

        provincelayer.on('unmousemove', () => {
          provincelayer.style({
            raisingHeight: 200000,
          });
          // @ts-ignore
          lineDown.style({
            raisingHeight: 200000,
          });
          // @ts-ignore
          lineUp.style({
            raisingHeight: 200000 + 150000,
          });
          // @ts-ignore
          textLayer.style({
            raisingHeight: 200000 + 150000 + 10000,
          });
        });
      });
  }

  public render() {
    return (
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
    );
  }
}
