import {
  LineLayer,
  Scene,
  MaskLayer,
  PolygonLayer,
  PointLayer,
  RasterLayer,
} from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';
import * as React from 'react';
// tslint:disable-next-line:no-submodule-imports
// @ts-ignore
import * as GeoTIFF from 'geotiff';
export default class Amap2demo_road2 extends React.Component {
  // @ts-ignore
  private scene: Scene;

  public componentWillUnmount() {
    this.scene.destroy();
  }

  public async componentDidMount() {
    const scene = new Scene({
      id: 'map',
      stencil: true,
      map: new GaodeMap({
        center: [105, 30.26],
        pitch: 0,
        zoom: 2,
        viewMode: '3D',
        style: 'dark',
      }),
    });
    this.scene = scene;

    scene.on('loaded', () => {
      fetch(
        'https://gw.alipayobjects.com/os/basement_prod/d2e0e930-fd44-4fca-8872-c1037b0fee7b.json',
      )
        .then((res) => res.json())
        .then((data) => {
          const layer = new MaskLayer({}).source(data);

          scene.addLayer(layer);
        });
      addLayer();
    });
    async function getTiffData() {
      const response = await fetch(
        'https://gw.alipayobjects.com/os/rmsportal/XKgkjjGaAzRyKupCBiYW.dat',
      );
      const arrayBuffer = await response.arrayBuffer();
      const tiff = await GeoTIFF.fromArrayBuffer(arrayBuffer);
      const image = await tiff.getImage();
      const width = image.getWidth();
      const height = image.getHeight();
      const values = await image.readRasters();
      return {
        data: values[0],
        width,
        height,
        min: 0,
        max: 8000,
      };
    }

    async function addLayer() {
      const tiffdata = await getTiffData();

      // const layer = new RasterLayer({ mask: true });
      const layer = new RasterLayer({ mask: true });
      layer
        .source(tiffdata.data, {
          parser: {
            type: 'raster',
            width: tiffdata.width,
            height: tiffdata.height,
            extent: [73.482190241, 3.82501784112, 135.106618732, 57.6300459963],
          },
        })
        .style({
          clampLow: false,
          clampHigh: false,
          opacity: 0.8,
          domain: [0, 8000],
          rampColors: {
            colors: [
              '#FF4818',
              '#F7B74A',
              '#FFF598',
              '#91EABC',
              '#2EA9A1',
              '#206C7C',
            ].reverse(),
            positions: [0, 0.2, 0.4, 0.6, 0.8, 1.0],
          },
        });

      scene.addLayer(layer);
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
        />
      </>
    );
  }
}
