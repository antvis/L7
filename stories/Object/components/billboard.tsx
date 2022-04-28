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
        pitch: 80,
        style: 'dark',
        center: [120, 30],
        zoom: 5,
      }),
    });
    this.scene = scene;

    let point = new PointLayer()
      .source(
        [
          {
            lng: 120,
            lat: 30,
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
      .size(80)
      .animate(true)
      .color('#0ff');

    let pointBar = new PointLayer({ depth: false })
      .source(
        [
          {
            lng: 120,
            lat: 30,
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
      .shape('cylinder')
      .size([5, 5, 60])
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
        let billboard = new GeometryLayer().shape('billboard').style({
          width: 90,
          height: 30,
          canvasWidth: 360,
          canvasHeight: 120,
          center: [120, 30],
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
            ctx.font = '36px Georgia';
            ctx.fillText('Hello World! 蚂蚁', width / 2, height / 2);
          },
          raisingHeight: 100,
        });
        billboard.active({
          color: '#0ff',
          mix: 0.5,
        });
        scene.addLayer(billboard);
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
