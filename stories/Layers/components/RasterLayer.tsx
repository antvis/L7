import { RasterLayer } from '@antv/l7-layers';
import { Scene } from '@antv/l7-scene';
// @ts-ignore
import * as GeoTIFF from 'geotiff/dist/geotiff.bundle.js';
import * as React from 'react';

export default class ImageLayerDemo extends React.Component {
  private scene: Scene;

  public componentWillUnmount() {
    this.scene.destroy();
  }

  public async componentDidMount() {
    const scene = new Scene({
      center: [121.268, 30.3628],
      id: 'map',
      pitch: 0,
      type: 'mapbox',
      style: 'mapbox://styles/mapbox/streets-v9',
      zoom: 2,
    });
    const tiffdata = await this.getTiffData();
    const layer = new RasterLayer({});
    layer
      .source(tiffdata.data, {
        parser: {
          type: 'raster',
          width: tiffdata.width,
          height: tiffdata.height,
          min: 0,
          max: 8000,
          extent: [73.482190241, 3.82501784112, 135.106618732, 57.6300459963],
        },
      })
      .style({
        opacity: 0.8,
        rampColors: {
          colors: [
            '#002466',
            '#0D408C',
            '#105CB3',
            '#1A76C7',
            '#2894E0',
            '#3CB4F0',
            '#65CEF7',
            '#98E3FA',
            '#CFF6FF',
            '#E8FCFF',
          ],
          positions: [0, 0.02, 0.05, 0.1, 0.2, 0.3, 0.5, 0.6, 0.8, 1.0],
        },
      });
    scene.addLayer(layer);
    console.log(layer);
    scene.render();
    this.scene = scene;
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
  private async getTiffData() {
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
}
