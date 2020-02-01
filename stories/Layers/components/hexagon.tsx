import { HeatmapLayer, PointLayer, Scene } from '@antv/l7';
import { GaodeMap, Mapbox } from '@antv/l7-maps';
import * as dat from 'dat.gui';
import * as React from 'react';
// @ts-ignore
import data from '../data/data.json';
export default class HexagonLayerDemo extends React.Component {
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
      'https://gw.alipayobjects.com/os/basement_prod/337ddbb7-aa3f-4679-ab60-d64359241955.json',
    );
    const pointsData = await response.json();

    const scene = new Scene({
      id: 'map',
      map: new Mapbox({
        center: [120.19382669582967, 30.258134],
        pitch: 0,
        style: 'light',
        zoom: 3,
      }),
    });
    const pointLayer = new HeatmapLayer({})
      .source(pointsData, {
        transforms: [
          {
            type: 'grid',
            size: 500000,
            field: 'capacity',
            method: 'sum',
          },
        ],
      })
      .shape('hexagon')
      .style({
        coverage: 0.9,
        angle: 0,
        opacity: 0.6,
      })
      .color(
        'sum',
        [
          '#3F4BBA',
          '#3F4BBA',
          '#3F4BBA',
          '#3F4BBA',
          '#3C73DA',
          '#3C73DA',
          '#3C73DA',
          '#0F62FF',
          '#0F62FF',
          '#30B2E9',
          '#30B2E9',
          '#40C4CE',
        ].reverse(),
      );
    scene.addLayer(pointLayer);
    pointLayer.on('click', (e) => {
      console.log(e);
    });

    this.scene = scene;

    const gui = new dat.GUI();
    this.gui = gui;
    const styleOptions = {
      textAnchor: 'center',
      strokeWidth: 1,
    };
    const rasterFolder = gui.addFolder('栅格可视化');
    rasterFolder
      .add(styleOptions, 'textAnchor', [
        'center',
        'left',
        'right',
        'top',
        'bottom',
        'top-left',
        'bottom-right',
        'bottom-left',
        'top-right',
      ])
      .onChange((anchor: string) => {
        pointLayer.style({
          textAnchor: anchor,
        });
        scene.render();
      });
    // });
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
