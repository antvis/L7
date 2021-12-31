// @ts-ignore
import { Scene, WindLayer, PointLayer } from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';
import * as React from 'react';
import * as dat from 'dat.gui';

export default class WindMap extends React.Component {
  // @ts-ignore
  private scene: Scene;
  private gui: any;

  public componentWillUnmount() {
    if (this.gui) {
      this.gui.destroy();
    }
    this.scene.destroy();
  }

  public async componentDidMount() {
    const scene = new Scene({
      id: 'map',
      map: new GaodeMap({
        center: [40, 30.3628],
        pitch: 0,
        style: 'normal',
        zoom: 2,
        viewMode: '3D',
      }),
    });
    this.scene = scene;

    const pointLayer = new PointLayer({ zIndex: 1 })
      .source(
        [
          {
            lng: 121.107846,
            lat: 30.267069,
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
      .color('#f00')
      .active(true)
      .size(40)
      .style({
        stroke: '#fff',
        storkeWidth: 2,
      });

    scene.on('loaded', () => {
      scene.addLayer(pointLayer);

      const styleOptions = {
        uMin: -21.32,
        uMax: 26.8,
        vMin: -21.57,
        vMax: 21.42,
        numParticles: 65535,
        fadeOpacity: 0.996,
        rampColors: {
          0.0: '#3288bd',
          0.1: '#66c2a5',
          0.2: '#abdda4',
          0.3: '#e6f598',
          0.4: '#fee08b',
          0.5: '#fdae61',
          0.6: '#f46d43', // f46d43
          1.0: '#d53e4f',
        },
        sizeScale: 0.5,
      };

      const layer = new WindLayer({});
      layer
        .source(
          'https://gw.alipayobjects.com/mdn/rms_23a451/afts/img/A*wcU8S5xMEDYAAAAAAAAAAAAAARQnAQ',
          {
            parser: {
              type: 'image',
              extent: [-180, -85, 180, 85],
            },
          },
        )
        .animate(true)
        .style({
          uMin: styleOptions.uMin,
          uMax: styleOptions.uMax,
          vMin: styleOptions.vMin,
          vMax: styleOptions.vMax,
          fadeOpacity: styleOptions.fadeOpacity,
          numParticles: styleOptions.numParticles,
          rampColors: styleOptions.rampColors,
          sizeScale: styleOptions.sizeScale,
        });
      scene.addLayer(layer);

      /*** 运行时修改样式属性 ***/
      const gui = new dat.GUI();
      this.gui = gui;

      const pointFolder = gui.addFolder('风场数据');
      pointFolder
        .add(styleOptions, 'numParticles', 0, 65535, 1)
        .onChange((num: number) => {
          layer.style({
            numParticles: num,
          });
        });

      pointFolder
        .add(styleOptions, 'uMin', -100, 100, 1)
        .onChange((num: number) => {
          layer.style({
            uMin: num,
          });
        });

      pointFolder
        .add(styleOptions, 'uMax', -100, 100, 1)
        .onChange((num: number) => {
          layer.style({
            uMax: num,
          });
        });

      pointFolder
        .add(styleOptions, 'vMin', -100, 100, 1)
        .onChange((num: number) => {
          layer.style({
            vMin: num,
          });
        });

      pointFolder
        .add(styleOptions, 'vMax', -100, 100, 1)
        .onChange((num: number) => {
          layer.style({
            vMax: num,
          });
        });

      pointFolder
        .add(styleOptions, 'fadeOpacity', 0.9, 1, 0.01)
        .onChange((num: number) => {
          layer.style({
            fadeOpacity: num,
          });
        });

      pointFolder
        .add(styleOptions, 'sizeScale', 0, 2, 0.01)
        .onChange((num: number) => {
          layer.style({
            sizeScale: num,
          });
        });

      pointFolder
        .addColor(styleOptions.rampColors, '0.6')
        .onChange((color: string) => {
          layer.style({
            rampColors: {
              0.0: '#3288bd',
              0.1: '#66c2a5',
              0.2: '#abdda4',
              0.3: '#e6f598',
              0.4: '#fee08b',
              0.5: '#fdae61',
              0.6: color,
              1.0: '#d53e4f',
            },
          });
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
