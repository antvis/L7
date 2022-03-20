import { CanvasLayer, Scene, IMapService } from '@antv/l7';
import { GaodeMapV2, Mapbox } from '@antv/l7-maps';
import * as React from 'react';
let x = 0;
export default class Demo extends React.Component {
  // @ts-ignore
  private scene: Scene;

  public componentWillUnmount() {
    this.scene.destroy();
  }

  /**
   * draw water ball
   */
  public draw(option: any) {
    const { size, ctx, mapService } = option;
    const [width, height] = size;

    let radius = 30,
      rectWidth = radius * 2;
    const rectHeight = rectWidth;

    ctx.clearRect(0, 0, width, height);

    const points = [
      {
        lng: 108.544921875,
        lat: 30.977609093348686,
        level: 85,
        color: 'rgba(	220,20,60, 0.4)',
      },
      {
        lng: 110.654296875,
        lat: 31.090574094954192,
        level: 75,
        color: 'rgba(	255,140,0, 0.4)',
      },
      {
        lng: 112.5,
        lat: 29.80251790576445,
        level: 65,
        color: 'rgba(255,165,0, 0.4)',
      },
      {
        lng: 114.78515624999999,
        lat: 30.44867367928756,
        level: 40,
        color: 'rgba(30,144,255, 0.4)',
      },
      {
        lng: 116.49902343749999,
        lat: 29.84064389983441,
        level: 50,
        color: 'rgba(30,144,255, 0.4)',
      },
      {
        lng: 118.21289062499999,
        lat: 31.16580958786196,
        level: 20,
        color: 'rgba(	127,255,0, 0.4)',
      },
      {
        lng: 119.091796875,
        lat: 32.509761735919426,
        level: 50,
        color: 'rgba(30,144,255, 0.4)',
      },
      {
        lng: 121.0693359374999,
        lat: 31.80289258670676,
        level: 45,
        color: 'rgba(30,144,255, 0.4)',
      },
    ];
    ctx.fillStyle = '#fff';
    ctx.font = '14px YouYuan';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    points.map((point) => {
      let pixelCenter = mapService.lngLatToContainer([point.lng, point.lat]);
      pixelCenter.x *= window.devicePixelRatio;
      pixelCenter.y *= window.devicePixelRatio;
      let rectStartX = pixelCenter.x - radius;
      const rectStartY = pixelCenter.y - radius;

      ctx.save();

      ctx.fillText(point.level + '%', pixelCenter.x, pixelCenter.y);

      ctx.beginPath();
      ctx.arc(pixelCenter.x, pixelCenter.y, radius, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(135,206,250,0.2)';
      ctx.closePath();
      ctx.fill();
      ctx.clip();

      ctx.beginPath();
      ctx.fillStyle = point.color;
      ctx.moveTo(rectStartX, pixelCenter.y);

      let waterheight = rectStartY + ((100 - point.level) / 100) * rectHeight;
      for (let i = 0; i <= rectWidth; i += 10) {
        ctx.lineTo(
          rectStartX + i,
          waterheight + Math.sin(Math.PI * 2 * (i / rectWidth) + x) * 3 + 1,
        );
      }

      ctx.lineTo(pixelCenter.x + radius, pixelCenter.y + radius);
      ctx.lineTo(rectStartX, pixelCenter.y + radius);
      ctx.lineTo(rectStartX, pixelCenter.y);
      ctx.closePath();

      ctx.fill();

      ctx.restore();
    });
  }

  public async componentDidMount() {
    const scene = new Scene({
      id: 'map',
      map: new GaodeMapV2({
        pitch: 0,
        style: 'amap://styles/8aa66692b2a7790b101f88dd35b89bb5',
        center: [115, 30],
        zoom: 5.5,
      }),
    });
    this.scene = scene;

    scene.on('loaded', () => {
      fetch(
        'https://gw.alipayobjects.com/os/basement_prod/337ddbb7-aa3f-4679-ab60-d64359241955.json',
      )
        .then((res) => res.json())
        .then((data) => {
          const layer = new CanvasLayer({})
            .style({
              zIndex: 10,
              update: 'always',
              // update: 'dragend',
              drawingOnCanvas: this.draw,
            })
            .animate({
              enable: true,
            });
          scene.addLayer(layer);

          setInterval(() => {
            x += 0.1;
            layer.style({
              drawingOnCanvas: this.draw,
            });
            scene.render();
          }, 30);

          // setTimeout(() => {
          //   console.log('reSet');
          //   layer.style({
          //     update: 'dragend',
          //   });
          //   scene.render();
          // }, 3000);
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
