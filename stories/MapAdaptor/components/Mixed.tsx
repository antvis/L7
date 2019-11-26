// @ts-ignore
import { PointLayer, PolygonLayer, Scene } from '@antv/l7';
import { AMap, Mapbox } from '@antv/l7-maps';
import * as React from 'react';
// @ts-ignore
import pointsData from '../../assets/data/points.json';

export default class Mixed extends React.Component {
  private scene1: Scene;
  private scene2: Scene;
  private scene3: Scene;
  private scene4: Scene;

  public componentWillUnmount() {
    this.scene1.destroy();
    this.scene2.destroy();
    this.scene3.destroy();
    this.scene4.destroy();
  }

  public async componentDidMount() {
    const response = await fetch(
      'https://gw.alipayobjects.com/os/basement_prod/d2e0e930-fd44-4fca-8872-c1037b0fee7b.json',
    );
    const data = await response.json();

    const scene1 = new Scene({
      id: 'map1',
      map: new AMap({
        center: [110.19382669582967, 50.258134],
        pitch: 0,
        style: 'light',
        zoom: 3,
      }),
    });
    const scene2 = new Scene({
      id: 'map2',
      map: new AMap({
        center: [110.19382669582967, 50.258134],
        pitch: 0,
        style: 'dark',
        zoom: 3,
      }),
    });
    const scene3 = new Scene({
      id: 'map3',
      map: new Mapbox({
        style: 'mapbox://styles/mapbox/streets-v9',
        center: [110.19382669582967, 50.258134],
        pitch: 0,
        zoom: 2,
      }),
    });
    const scene4 = new Scene({
      id: 'map4',
      map: new Mapbox({
        style: 'mapbox://styles/mapbox/light-v10',
        center: [110.19382669582967, 50.258134],
        pitch: 0,
        zoom: 2,
      }),
    });

    this.scene1 = scene1;
    this.scene2 = scene2;
    this.scene3 = scene3;
    this.scene4 = scene4;

    const layer1 = new PolygonLayer({
      enablePicking: true,
      enableHighlight: true,
      passes: [
        [
          'colorHalftone',
          {
            size: 8,
          },
        ],
      ],
      onHover: (pickedFeature: any) => {
        // tslint:disable-next-line:no-console
        console.log('Scene1', pickedFeature.feature.name);
      },
    });
    layer1
      .source(data)
      .size('name', [0, 10000, 50000, 30000, 100000])
      .color('name', [
        '#2E8AE6',
        '#69D1AB',
        '#DAF291',
        '#FFD591',
        '#FF7A45',
        '#CF1D49',
      ])
      .shape('fill')
      .style({
        opacity: 0.8,
      });

    const layer2 = new PolygonLayer({
      enablePicking: true,
      enableHighlight: true,
      passes: [
        [
          'hexagonalPixelate',
          {
            scale: 20,
          },
        ],
      ],
      onHover: (pickedFeature: any) => {
        // tslint:disable-next-line:no-console
        console.log('Scene2', pickedFeature.feature.name);
      },
    });
    layer2
      .source(data)
      .size('name', [0, 10000, 50000, 30000, 100000])
      .color('name', [
        '#2E8AE6',
        '#69D1AB',
        '#DAF291',
        '#FFD591',
        '#FF7A45',
        '#CF1D49',
      ])
      .shape('fill')
      .style({
        opacity: 0.8,
      });

    const layer3 = new PolygonLayer({
      enablePicking: true,
      enableHighlight: true,
      passes: ['noise'],
      onHover: (pickedFeature: any) => {
        // tslint:disable-next-line:no-console
        console.log('Scene3', pickedFeature.feature.name);
      },
    });
    layer3
      .source(data)
      .size('name', [0, 10000, 50000, 30000, 100000])
      .color('name', [
        '#2E8AE6',
        '#69D1AB',
        '#DAF291',
        '#FFD591',
        '#FF7A45',
        '#CF1D49',
      ])
      .shape('fill')
      .style({
        opacity: 0.8,
      });
    const layer4 = new PolygonLayer({
      enableMultiPassRenderer: true,
      enablePicking: true,
      enableHighlight: true,
      passes: ['sepia'],
      onHover: (pickedFeature: any) => {
        // tslint:disable-next-line:no-console
        console.log('Scene4', pickedFeature.feature.name);
      },
    });
    layer4
      .source(data)
      .size('name', [0, 10000, 50000, 30000, 100000])
      .color('name', [
        '#2E8AE6',
        '#69D1AB',
        '#DAF291',
        '#FFD591',
        '#FF7A45',
        '#CF1D49',
      ])
      .shape('fill')
      .style({
        opacity: 0.8,
      });
    const pointLayer = new PointLayer({
      enableMultiPassRenderer: true,
      enablePicking: true,
      enableHighlight: true,
      passes: [
        [
          'colorHalftone',
          {
            size: 8,
          },
        ],
      ],
      onHover: (pickedFeature: any) => {
        // tslint:disable-next-line:no-console
        console.log('Scene4', pickedFeature.feature.name);
      },
    });
    pointLayer
      .source(pointsData)
      .color('name', [
        '#FFF5B8',
        '#FFDC7D',
        '#FFAB5C',
        '#F27049',
        '#D42F31',
        '#730D1C',
      ])
      .shape('subregion', [
        'circle',
        'triangle',
        'square',
        'pentagon',
        'hexagon',
        'octogon',
        'hexagram',
        'rhombus',
        'vesica',
      ])
      .size('scalerank', [5, 10])
      .style({
        opacity: 1.0,
      });

    scene1.addLayer(layer1);
    scene2.addLayer(layer2);
    scene3.addLayer(layer3);
    scene4.addLayer(layer4);
    // scene4.addLayer(pointLayer);
  }

  public render() {
    return (
      <>
        <div
          id="map1"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: '50%',
            bottom: '50%',
          }}
        />
        <div
          id="map2"
          style={{
            position: 'absolute',
            top: 0,
            left: '50%',
            right: 0,
            bottom: '50%',
          }}
        />
        <div
          id="map3"
          style={{
            position: 'absolute',
            top: '50%',
            left: 0,
            right: '50%',
            bottom: 0,
          }}
        />
        <div
          id="map4"
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            right: 0,
            bottom: 0,
          }}
        />
      </>
    );
  }
}
