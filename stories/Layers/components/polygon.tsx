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
const RMBColor: { [key: string]: string[] } = {
  '100元': ['#D92568', '#E3507E', '#FC7AAB', '#F1D3E5', '#A7B5E3', '#F2EEFF'],
  '50元': ['#416D63', '#497A71', '#8FC1B1', '#7E80A7', '#D2C6DC', '#8B897B'],
  '20元': ['#563F30', '#A08671', '#BE9577', '#E1BDA0', '#9BCEB8', '#EACDD6'],
  '5元': ['#49315E', '#7C5E91', '#A38EAE', '#DCC4B2', '#CDD0B5', '#B3A895'],
  '10元': ['#23324A', '#465C6B', '#A6B0BE', '#BA9FA2', '#B6B4A3', '#B89374'],
  '1元': ['#343F24', '#717F63', '#BCCAAF', '#CEBD7E', '#B5B4A0', '#E9E4E1'],
  '5角': ['#644353', '#8C5B66', '#916970', '#BEB4C6', '#B5C0C8', '#FFDEE3'],
  '2角': ['#4D6256', '#5F6F63', '#648F96', '#A5AF9C', '#C4DAE2', '#8A9A8E'],
  '1角': ['#653E40', '#6C4547', '#AC8486', '#D1A6A1', '#CAB8B8', '#D5C1A4'],
};

// earcut结果： [5, 0, 1, 1, 2, 3, 3, 4, 5, 5, 1, 3] 0
const geoJSONhole = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [100.1953125, 42.5530802889558],
            [111.533203125, 37.16031654673677],
            [104.67773437499999, 34.88593094075317], //**
            [108.4130859375, 28.14950321154457], ///
            [127.529296875, 33.063924198120645],
            [115.48828125000001, 47.45780853075031],
            [100.1953125, 42.5530802889558], //
          ],
        ],
      },
    },
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
        style: 'blank',
        zoom: 0,
      }),
    });
    scene.on('loaded', () => {
      const layer = new PolygonLayer({
        blend: 'none',
      })
        .source(geoJSONhole)
        .shape('fill')
        .scale('childrenNum', {
          type: 'quantile',
        })
        .color('#D92568')
        .style({
          opacity: 0.3,
        });
      scene.addLayer(layer);
      this.scene = scene;
      const gui = new dat.GUI();
      this.gui = gui;
      const styleOptions = {
        textAnchor: 'center',
        filter: 1,
        textAllowOverlap: 4,
        opacity: 0.3,
        color: '100元',
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
      rasterFolder
        .add(styleOptions, 'color', [
          '100元',
          '50元',
          '20元',
          '10元',
          '5元',
          '1元',
          '5角',
          '2角',
          '1角',
        ])
        .onChange((color: any) => {
          layer.color('childrenNum', RMBColor[color] as string[]);
          // layer.shape('fill');
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
