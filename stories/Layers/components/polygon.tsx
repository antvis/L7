import { PolygonLayer, Scene } from '@antv/l7';
import { GaodeMap, Mapbox } from '@antv/l7-maps';
import * as dat from 'dat.gui';
import * as React from 'react';
// @ts-ignore
const Spectral: {
  [key: string]: string[];
} = {
  3: ['rgb(252,141,89)', 'rgb(255,255,191)', 'rgb(153,213,148)'],
  4: [
    'rgb(215,25,28)',
    'rgb(253,174,97)',
    'rgb(171,221,164)',
    'rgb(43,131,186)',
  ],
  5: [
    'rgb(215,25,28)',
    'rgb(253,174,97)',
    'rgb(255,255,191)',
    'rgb(171,221,164)',
    'rgb(43,131,186)',
  ],
  6: [
    'rgb(213,62,79)',
    'rgb(252,141,89)',
    'rgb(254,224,139)',
    'rgb(230,245,152)',
    'rgb(153,213,148)',
    'rgb(50,136,189)',
  ],
  7: [
    'rgb(213,62,79)',
    'rgb(252,141,89)',
    'rgb(254,224,139)',
    'rgb(255,255,191)',
    'rgb(230,245,152)',
    'rgb(153,213,148)',
    'rgb(50,136,189)',
  ],
  8: [
    'rgb(213,62,79)',
    'rgb(244,109,67)',
    'rgb(253,174,97)',
    'rgb(254,224,139)',
    'rgb(230,245,152)',
    'rgb(171,221,164)',
    'rgb(102,194,165)',
    'rgb(50,136,189)',
  ],
  9: [
    'rgb(213,62,79)',
    'rgb(244,109,67)',
    'rgb(253,174,97)',
    'rgb(254,224,139)',
    'rgb(255,255,191)',
    'rgb(230,245,152)',
    'rgb(171,221,164)',
    'rgb(102,194,165)',
    'rgb(50,136,189)',
  ],
  10: [
    'rgb(158,1,66)',
    'rgb(213,62,79)',
    'rgb(244,109,67)',
    'rgb(253,174,97)',
    'rgb(254,224,139)',
    'rgb(230,245,152)',
    'rgb(171,221,164)',
    'rgb(102,194,165)',
    'rgb(50,136,189)',
    'rgb(94,79,162)',
  ],
  11: [
    'rgb(158,1,66)',
    'rgb(213,62,79)',
    'rgb(244,109,67)',
    'rgb(253,174,97)',
    'rgb(254,224,139)',
    'rgb(255,255,191)',
    'rgb(230,245,152)',
    'rgb(171,221,164)',
    'rgb(102,194,165)',
    'rgb(50,136,189)',
    'rgb(94,79,162)',
  ],
};
export default class TextLayerDemo extends React.Component {
  // @ts-ignore
  private scene: Scene;
  private gui: dat.GUI;

  public componentWillUnmount() {
    this.scene.destroy();
    if (this.gui) {
      this.gui.destroy();
    }
  }
  public async componentDidMount() {
    const response = await fetch(
      'https://gw.alipayobjects.com/os/basement_prod/d2e0e930-fd44-4fca-8872-c1037b0fee7b.json',
    );
    const data = await response.json();

    const scene = new Scene({
      id: 'map',
      map: new Mapbox({
        center: [120.19382669582967, 30.258134],
        pitch: 0,
        style: 'dark',
        zoom: 3,
      }),
    });
    scene.on('loaded', () => {
      const layer = new PolygonLayer({
        minZoom: 3,
        maxZoom: 7,
      })
        .source(data)
        .shape('fill')
        .color('childrenNum', [
          'rgb(247,252,240)',
          'rgb(224,243,219)',
          'rgb(204,235,197)',
          'rgb(168,221,181)',
          'rgb(123,204,196)',
          'rgb(78,179,211)',
          'rgb(43,140,190)',
          'rgb(8,88,158)',
        ])
        .style({
          opacity: 1.0,
        });
      scene.addLayer(layer);
      layer.on('click', (e) => {
        console.log(e);
      });
      this.scene = scene;

      const gui = new dat.GUI();
      this.gui = gui;
      const styleOptions = {
        textAnchor: 'center',
        filter: 1,
        textAllowOverlap: 4,
        opacity: 1,
        color: '#ffffff',
      };
      const rasterFolder = gui.addFolder('面图层可视化');

      rasterFolder
        .add(styleOptions, 'filter', 0, 50)
        .onChange((strokeWidth: number) => {
          layer.filter('childrenNum', (t: number) => {
            return t > strokeWidth;
          });
          scene.render();
        });
      rasterFolder
        .add(styleOptions, 'textAllowOverlap', 3, 10, 1)
        .onChange((v: string) => {
          layer.color('childrenNum', Spectral[v]);
          scene.render();
        });
      rasterFolder
        .add(styleOptions, 'opacity', 0, 1)
        .onChange((opacity: number) => {
          layer.style({
            opacity,
          });
          scene.render();
          scene.exportPng();
        });
      rasterFolder.addColor(styleOptions, 'color').onChange((color: string) => {
        layer.color(color);
        scene.render();
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
