// @ts-nocheck
import {
  Scene,
  PolygonLayer,
  ImageLayer,
  PointLayer,
  Map,
} from '@antv/l7-mini';
import * as React from 'react';

export default class Demo extends React.Component {
  public async componentDidMount() {
    const scene = new Scene({
      id: 'map',
      map: new Map({
        center: [500, 500],
        pitch: 0,
        zoom: 3,
        version: 'SIMPLE',
        mapSize: 1000,
        maxZoom: 5,
        minZoom: 2,
        pitchEnabled: false,
        rotateEnabled: false,
      }),
    });
    scene.setBgColor('rgb(94, 182, 140)');

    const textlayer = new PointLayer({ zIndex: 2 })
      .source(
        [
          {
            x: 515,
            y: 575,
            t: '小屋',
          },
          {
            x: 507,
            y: 560,
            t: '小屋',
          },
          {
            x: 495,
            y: 553,
            t: '别墅',
          },
          {
            x: 499,
            y: 547,
            t: '住宅',
          },
          {
            x: 480,
            y: 544,
            t: '住宅',
          },
          {
            x: 471,
            y: 539,
            t: '住宅',
          },
          {
            x: 485,
            y: 527,
            t: '住宅',
          },
          {
            x: 463,
            y: 533,
            t: '住宅',
          },
          {
            x: 477,
            y: 523,
            t: '住宅',
          },
          {
            x: 473,
            y: 517,
            t: '住宅',
          },
          {
            x: 535,
            y: 535,
            t: '住宅小区',
          },
          {
            x: 550,
            y: 545,
            t: '住宅小区',
          },
          {
            x: 578,
            y: 559,
            t: '别墅',
          },
          {
            x: 583,
            y: 554,
            t: '别墅',
          },
          {
            x: 590,
            y: 538,
            t: '别墅',
          },
          {
            x: 599,
            y: 537,
            t: '住宅',
          },
          {
            x: 567,
            y: 526,
            t: '住宅',
          },
          {
            x: 564,
            y: 519,
            t: '住宅',
          },
          {
            x: 553.5,
            y: 483,
            t: '住宅',
          },
          {
            x: 554,
            y: 479,
            t: '住宅',
          },
          {
            x: 547,
            y: 478.5,
            t: '住宅',
          },
          {
            x: 533.5,
            y: 475,
            t: '住宅',
          },
          {
            x: 516,
            y: 463,
            t: '住宅',
          },
          {
            x: 538,
            y: 453,
            t: '住宅',
          },
          {
            x: 510.5,
            y: 444,
            t: '别墅',
          },
          {
            x: 488,
            y: 440.5,
            t: '住宅',
          },
          {
            x: 476.5,
            y: 438.5,
            t: '别墅',
          },
          {
            x: 474.5,
            y: 431,
            t: '别墅',
          },
          {
            x: 462,
            y: 434.5,
            t: '别墅',
          },
          {
            x: 431,
            y: 436,
            t: '住宅',
          },
          {
            x: 428,
            y: 430,
            t: '住宅',
          },
          {
            x: 402.5,
            y: 448.5,
            t: '别墅',
          },
          {
            x: 393.5,
            y: 456,
            t: '别墅',
          },
        ],
        {
          parser: {
            type: 'json',
            x: 'x',
            y: 'y',
          },
        },
      )
      .shape('t', 'text')
      .size(12)
      .active({
        color: '#00f',
        mix: 0.9,
      })
      // .color('#0e0030')
      .color('rgb(86, 156, 214)')
      .style({
        textAnchor: 'center', // 文本相对锚点的位置 center|left|right|top|bottom|top-left
        spacing: 2, // 字符间距
        fontWeight: '800',
        padding: [1, 1], // 文本包围盒 padding [水平，垂直]，影响碰撞检测结果，避免相邻文本靠的太近
        stroke: '#ffffff', // 描边颜色
        strokeWidth: 2, // 描边宽度
        textAllowOverlap: true,
      });

    const imagelayer = new ImageLayer({}).source(
      'https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*I0X5R4jAUQ4AAAAAAAAAAAAAARQnAQ',
      {
        parser: {
          type: 'image',
          extent: [360, 400, 640, 600],
        },
      },
    );

    scene.on('loaded', () => {
      scene.addLayer(imagelayer);

      scene.addLayer(textlayer);
      // console.log(scene.mapService.getSize())
      // setTimeout(() => {
      //   console.log(scene.mapService.getSize())
      // }, 2000 )
      // console.log(scene.mapService.getCenter());
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
      ></div>
    );
  }
}
