import { GeometryLayer, Scene, IMapService, PointLayer } from '@antv/l7';
import { GaodeMap, GaodeMapV2, Mapbox } from '@antv/l7-maps';
import * as React from 'react';

export default class Demo extends React.Component {
  // @ts-ignore
  private scene: Scene;

  public componentWillUnmount() {
    this.scene.destroy();
  }

  public async componentDidMount() {
    const scene = new Scene({
      id: 'map',
      map: new GaodeMap({
        // map: new GaodeMapV2({
        // map: new Mapbox({
        pitch: 70,
        style: 'dark',
        center: [117.05374047387, 36.692219],
        zoom: 13.5,
      }),
    });
    this.scene = scene;
    let data = [
      {
        n: '花园路',
        p: '17880元/平米',
        t: '商品房',
        lng: 117.057231,
        lat: 36.692219,
      },
      {
        n: '文化东路',
        p: '24170元/平米',
        t: '商品房',
        lng: 117.05374047387,
        lat: 36.659859151524,
      },
      {
        n: '文化东路',
        p: '24189元/平米',
        t: '商品房',
        lng: 117.05374047387,
        lat: 36.659859151524,
      },
      {
        n: '花园路',
        p: '17485元/平米',
        t: '商品房',
        lng: 117.05901528524,
        lat: 36.688836686429,
      },

      {
        n: '青后',
        p: '25728元/平米',
        t: '商品房',
        lng: 117.044914,
        lat: 36.676432,
      },
      {
        n: '甸柳',
        p: '26843元/平米',
        t: '商品房',
        lng: 117.07374708214,
        lat: 36.66121860246,
      },

      {
        n: '明湖区',
        p: '17627元/平米',
        t: '已购公房',
        lng: 117.03814,
        lat: 36.675152,
      },

      {
        n: '文化东路',
        p: '28418元/平米',
        t: '商品房',
        lng: 117.05374047387,
        lat: 36.659859151524,
      },
      {
        n: '花园路',
        p: '20931元/平米',
        t: '商品房',
        lng: 117.05901528524,
        lat: 36.688836686429,
      },
      {
        n: '东关',
        p: '19706元/平米',
        t: '商品房',
        lng: 117.045219,
        lat: 36.683106,
      },
      {
        n: '东关',
        p: '31429元/平米',
        t: '商品房',
        lng: 117.04655219619,
        lat: 36.678624581227,
      },
      {
        n: '文化东路',
        p: '25000元/平米',
        t: '商品房',
        lng: 117.05374047387,
        lat: 36.659859151524,
      },
      {
        n: '文化西路',
        p: '25766元/平米',
        t: '已购公房',
        lng: 117.030757,
        lat: 36.656219,
      },
      {
        n: '文化西路',
        p: '27778元/平米',
        t: '已购公房',
        lng: 117.029247,
        lat: 36.657826,
      },
      {
        n: '东关',
        p: '21438元/平米',
        t: '商品房',
        lng: 117.04974161336,
        lat: 36.679520836289,
      },
      {
        n: '东关',
        p: '21317元/平米',
        t: '经济适用房',
        lng: 117.046917,
        lat: 36.684377,
      },
      {
        n: '青后',
        p: '30216元/平米',
        t: '已购公房',
        lng: 117.041383,
        lat: 36.670455,
      },
      {
        n: '文化西路',
        p: '22945元/平米',
        t: '商品房',
        lng: 117.041344,
        lat: 36.656366,
      },
      {
        n: '文化东路',
        p: '27237元/平米',
        t: '商品房',
        lng: 117.05374047387,
        lat: 36.659859151524,
      },
      {
        n: '青后',
        p: '30226元/平米',
        t: '已购公房',
        lng: 117.042484,
        lat: 36.668182,
      },
      {
        n: '山大路',
        p: '34716元/平米',
        t: '已购公房',
        lng: 117.064218,
        lat: 36.675139,
      },
      {
        n: '东关',
        p: '17819元/平米',
        t: '商品房',
        lng: 117.045219,
        lat: 36.683106,
      },
      {
        n: '文化东路',
        p: '19545元/平米',
        t: '商品房',
        lng: 117.05226870326,
        lat: 36.666563657761,
      },
    ];

    let point = new PointLayer()
      .source(data, {
        parser: {
          type: 'json',
          x: 'lng',
          y: 'lat',
        },
      })
      .shape('circle')
      .size(60)
      .animate(true)
      .style({
        opacity: 0.6,
      })
      .color('#0ff');

    let pointBar = new PointLayer({ depth: false })
      .source(data, {
        parser: {
          type: 'json',
          x: 'lng',
          y: 'lat',
        },
      })
      .shape('cylinder')
      .size([3, 3, 40])
      .color('#0ff')
      .style({
        opacityLinear: {
          enable: true,
          dir: 'up',
        },
        opacity: 0.6,
        heightFixed: true,
      });

    scene.on('loaded', () => {
      scene.addLayer(point);
      scene.addLayer(pointBar);

      const img = new Image();
      img.crossOrigin = '';
      img.onload = () => {
        data.map((d) => {
          let billboard = new GeometryLayer().shape('billboard').style({
            width: 60,
            height: 20,
            canvasWidth: 360,
            canvasHeight: 120,
            center: [d.lng, d.lat],
            drawCanvas: (canvas: HTMLCanvasElement) => {
              let { width, height } = canvas;
              let ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
              ctx.globalAlpha = 0.5;
              ctx.drawImage(
                img,
                0,
                0,
                img.width,
                img.height,
                0,
                0,
                width,
                height,
              );
              ctx.globalAlpha = 1;
              ctx.fillStyle = '#0ff';
              ctx.textAlign = 'center';
              ctx.textBaseline = 'middle';
              ctx.font = '24px Georgia';
              ctx.fillText(d.n + ' ' + d.p, width / 2, height / 2);
            },
            raisingHeight: 60,
          });
          scene.addLayer(billboard);
        });
      };
      img.src =
        'https://gw.alipayobjects.com/mdn/rms_23a451/afts/img/A*zMw0T6gEIZYAAAAAAAAAAAAAARQnAQ';
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
