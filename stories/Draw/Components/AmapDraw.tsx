import { Scene } from '@antv/l7';
import { DrawControl } from '@antv/l7-draw';
import { GaodeMap, Mapbox } from '@antv/l7-maps';

import * as React from 'react';
export default class AMapDraw extends React.Component {
  private scene: Scene;

  public componentWillUnmount() {
    this.scene.destroy();
  }

  public async componentDidMount() {
    const scene = new Scene({
      id: 'map',
      map: new GaodeMap({
        pitch: 0,
        style: 'dark', // hosted style id
        center: [112.874, 32.76], // starting position
        zoom: 12, // starting zoom
      }),
    });
    this.scene = scene;

    scene.on('loaded', () => {
      const layer1 = new AMap.TileLayer.Satellite();
      if(scene.map instanceof AMap.Map){

        scene.map.setLayers([]);
        layer1.setMap(scene.map);
      }
     
      const drawControl = new DrawControl(scene, {
        position: 'topright',
        layout: 'horizontal', // horizontal vertical
        controls: {
          point: true,
          polygon: true,
          line: true,
          circle: true,
          rect: true,
          delete: true,
        },
      });
      // @ts-ignore
      window.drawControl = drawControl;
      drawControl.on('draw.create', (e) => {
        console.log(e);
      });
      scene.on('dblclick', () => {
        drawControl.removeAllData();
      });
      scene.addControl(drawControl);
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
