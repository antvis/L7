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
        style: 'dark',
        center: [120, 29.732983],
        zoom: 6.2,
        pitch: 60,
      }),
    });
    this.scene = scene;

    const wavePoints = new PointLayer({ zIndex: 2 })
      .source(
        [
          {
            lng: 120,
            lat: 30,
          },
          {
            lng: 120,
            lat: 29,
          },
          {
            lng: 120,
            lat: 28,
          },
          {
            lng: 120,
            lat: 27,
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
      .shape('circle')
      .color('#ff0')
      .size(50)
      .animate(true)
      .active(true)
      .style({
        raisingHeight: 200000 + 150000,
      });

    scene.on('loaded', () => {
      scene.addLayer(wavePoints);
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

          const provincelayerSide = new PolygonLayer({})
            .source(data)
            .size(150000)
            .shape('extrude')
            .color('#0DCCFF')
            // .active({
            //   color: 'rgb(100,230,255)',
            // })
            .style({
              heightfixed: true,
              pickLight: true,
              raisingHeight: 200000,
              opacity: 0.8,
              topsurface: false,
            });
          scene.addLayer(provincelayerSide);

          const provincelayerTop = new PolygonLayer({})
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
              sidesurface: false,
            });
          scene.addLayer(provincelayerTop);

          // provincelayer.on('mousemove', () => {
          //   provincelayer.style({
          //     raisingHeight: 200000 + 100000,
          //   });
          //   // @ts-ignore
          //   lineDown.style({
          //     raisingHeight: 200000 + 100000,
          //   });
          //   // @ts-ignore
          //   lineUp.style({
          //     raisingHeight: 200000 + 150000 + 100000,
          //   });
          //   // @ts-ignore
          //   textLayer.style({
          //     raisingHeight: 200000 + 150000 + 10000 + 100000,
          //   });
          // });

          // provincelayer.on('unmousemove', () => {
          //   provincelayer.style({
          //     raisingHeight: 200000,
          //   });
          //   // @ts-ignore
          //   lineDown.style({
          //     raisingHeight: 200000,
          //   });
          //   // @ts-ignore
          //   lineUp.style({
          //     raisingHeight: 200000 + 150000,
          //   });
          //   // @ts-ignore
          //   textLayer.style({
          //     raisingHeight: 200000 + 150000 + 10000,
          //   });
          // });
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
