import { CanvasLayer, Scene, IMapService } from '@antv/l7';
import { GaodeMap, Mapbox } from '@antv/l7-maps';
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
        pitch: 0,
        // style: 'dark',
        center: [96.99215001469588, 29.281597225674773],
        zoom: 2.194613775109773,
      }),
    });
    this.scene = scene;

    scene.on('loaded', () => {
      fetch(
        'https://gw.alipayobjects.com/os/basement_prod/337ddbb7-aa3f-4679-ab60-d64359241955.json',
      )
        .then((res) => res.json())
        .then((data) => {
          const layer = new CanvasLayer({}).style({
            zIndex: 10,
            update: 'aways',
            // update: 'dragend',
            drawingOnCanvas: (
              ctx: CanvasRenderingContext2D,
              mapService: IMapService,
              size: [number, number],
            ) => {
              const [width, height] = size;

              ctx.clearRect(0, 0, width, height);
              ctx.fillStyle = 'rgba(0, 200, 0, 0.2)';
              data.features.map((feature: any) => {
                let pixelCenter = mapService.lngLatToContainer(
                  feature.geometry.coordinates,
                );
                pixelCenter.x *= window.devicePixelRatio;
                pixelCenter.y *= window.devicePixelRatio;
                if (
                  pixelCenter.x < 0 ||
                  pixelCenter.y < 0 ||
                  pixelCenter.x > width ||
                  pixelCenter.y > height
                )
                  return;
                ctx.beginPath();
                ctx.arc(
                  pixelCenter.x,
                  pixelCenter.y,
                  feature.properties.capacity / 200,
                  0,
                  Math.PI * 2,
                );
                ctx.fill();
                ctx.closePath();
              });
            },
          });
          scene.addLayer(layer);
          setTimeout(() => {
            console.log('reSet');
            layer.style({
              update: 'dragend',
            });
            scene.render();
          }, 3000);
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
