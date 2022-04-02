// @ts-nocheck
import React from 'react';
import { Scene, GaodeMap, GaodeMapV2, Mapbox, Map, PointLayer } from '@antv/l7';

export default class Amap2demo extends React.Component {
  // @ts-ignore
  private scene: Scene;

  public componentWillUnmount() {
    this.scene.destroy();
  }

  public async componentDidMount() {
   
    function initScene() {
      return new Promise((resolve, reject) => {
        const scene = new Scene({
          id: 'map',
          map: new GaodeMapV2({
            // center: [121.434765, 31.256735],
            // zoom: 14.83,
            pitch: 0,
            style: 'light',
            center: [122.5, 30],
            zoom: 4,
          }),
        });
        scene.on('loaded', () => {
          setTimeout(() => {
            resolve(scene)
          }, 200)
        })
      })
    }

    
   
    for(let i = 0;i < 20;i ++) {
      console.log('init ' + (i + 1))
      let scene = await initScene()
      scene.destroy()
    }
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
        ></div>
      </>
    );
  }
}
