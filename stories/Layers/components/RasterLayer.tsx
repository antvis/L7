import { RasterLayer, Scene } from '@antv/l7';
import { Mapbox } from '@antv/l7-maps';
import * as dat from 'dat.gui';
// @ts-ignore
import * as GeoTIFF from 'geotiff/dist/geotiff.bundle.js';
import * as React from 'react';

export default class ImageLayerDemo extends React.Component {
  private scene: Scene;
  private gui: dat.GUI;

  public componentWillUnmount() {
    this.scene.destroy();
    if (this.gui) {
      this.gui.destroy();
    }
  }

  public async componentDidMount() {
    const scene = new Scene({
      id: 'map',
      map: new Mapbox({
        center: [121.268, 30.3628],
        pitch: 0,
        style: 'dark',
        zoom: 2,
      }),
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
        domain: [100, 4000],
        clampLow: true,
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

    this.scene = scene;
    /*** 运行时修改样式属性 ***/
    const gui = new dat.GUI();
    this.gui = gui;
    const styleOptions = {
      clampLow: true,
      clampHigh: true,
      noDataValue: -9999999,
      min: 100,
      max: 4000,
    };
    const rasterFolder = gui.addFolder('栅格可视化');
    rasterFolder.add(styleOptions, 'clampLow').onChange((clampLow: boolean) => {
      layer.style({
        clampLow,
      });
      scene.render();
    });
    rasterFolder
      .add(styleOptions, 'clampHigh')
      .onChange((clampHigh: boolean) => {
        layer.style({
          clampHigh,
        });
        scene.render();
      });
    rasterFolder.add(styleOptions, 'min', 0, 9000).onChange((min: number) => {
      layer.style({
        domain: [min, styleOptions.max],
      });
      scene.render();
    });
    rasterFolder.add(styleOptions, 'max', 0, 9000).onChange((max: number) => {
      layer.style({
        domain: [styleOptions.min, max],
      });
      scene.render();
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
