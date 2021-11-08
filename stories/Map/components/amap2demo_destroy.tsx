import { PointLayer, Scene } from '@antv/l7';
import { GaodeMapV2, GaodeMap, Mapbox } from '@antv/l7-maps';
import * as React from 'react';
export default class Amap2demo_destroy extends React.Component {
  // @ts-ignore
  private scene: Scene;

  public componentWillUnmount() {
    this.scene.destroy();
  }

  public async componentDidMount() {
    const scene = new Scene({
      id: 'map',
      map: new Mapbox({
        center: [121.107846, 30.267069],
        pitch: 0,
        style: 'normal',
        zoom: 20,
        animateEnable: false,
      }),
    });
    let originData = [
      {
        lng: 121.107846,
        lat: 30.267069,
        opacity2: 0.2,
        strokeOpacity2: 0.4,
        strokeColor: '#000',
        strokeWidth: 0.5,
        // offsets2: [0, 0]
        offsets2: [100, 100],
      },
      {
        lng: 121.107,
        lat: 30.267069,
        opacity2: 0.4,
        strokeOpacity2: 0.6,
        strokeColor: '#0f0',
        strokeWidth: 2,
        offsets2: [100, 100],
      },
      {
        lng: 121.107846,
        lat: 30.26718,
        opacity2: 0.6,
        strokeOpacity2: 0.8,
        strokeColor: '#f00',
        strokeWidth: 4,
        // offsets2: [200, 200]
        offsets2: [100, 100],
      },
      // {
      //   lng: 38.54,
      //   lat: 77.02,
      //   opacity: 0.5
      //   strokeColor: "#ff0"
      // },
    ];
    this.scene = scene;
    scene.on('loaded', () => {
      let layer = new PointLayer()
        .source(originData, {
          parser: {
            type: 'json',
            x: 'lng',
            y: 'lat',
          },
        })
        .shape('circle')
        .color('rgba(255, 0, 0, 1.0)')
        .size([10, 10, 100])
        .style({
          strokeWidth: 4,
          opacity: 'opacity2',
        })
        .active(true);
      scene.addLayer(layer);
    });
    // setTimeout(() => {
    //   this.scene.destroy()
    // }, 2000)
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
        <button
          style={{
            position: 'absolute',
            top: '0',
            left: '0',
            zIndex: 10,
          }}
          onClick={() => this.scene.destroy()}
        >
          destroy
        </button>
      </>
    );
  }
}
