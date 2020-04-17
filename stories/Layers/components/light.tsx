import { PointLayer, Scene } from '@antv/l7';
import { GaodeMap, Mapbox } from '@antv/l7-maps';
import * as dat from 'dat.gui';
import * as React from 'react';
// @ts-ignore
export default class Light extends React.Component {
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
      'https://gw-office.alipayobjects.com/bmw-prod/6698fc37-4fc1-488b-972c-e29c77617a26.csv',
    );
    const pointsData = await response.text();

    const scene = new Scene({
      id: 'map',
      map: new GaodeMap({
        pitch: 0,
        style: 'dark',
        center: [114.298569, 30.584354],
        zoom: 11,
      }),
    });
    this.scene = scene;
    const layerConfig = {
      type: 'bus',
    };
    const gui = new dat.GUI();
    this.gui = gui;
    const typeControl = this.gui.add(layerConfig, 'type', [
      'bus',
      'elm',
      'bikeriding',
      'metro',
      'parking',
    ]);

    scene.on('loaded', async () => {
      const pointLayer = new PointLayer()
        .source(pointsData, {
          parser: {
            type: 'csv',
            y: 'latitude',
            x: 'longitude',
          },
        })
        .size(0.5)
        .filter('type', (v: string) => {
          return v === 'bus';
        })
        .color('#FF2B1F')
        .style({
          opacity: 1,
        });

      scene.addLayer(pointLayer);
      typeControl.onChange((type) => {
        pointLayer.filter('type', (v) => {
          return v === type;
        });
        scene.render();
      });
      this.scene = scene;
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
