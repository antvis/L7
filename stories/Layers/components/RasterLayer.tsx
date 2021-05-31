// @ts-ignore
import { RasterLayer, Scene } from '@antv/l7';
import { Mapbox } from '@antv/l7-maps';
import * as dat from 'dat.gui';
// @ts-ignore
// tslint:disable-next-line:no-submodule-imports
import * as GeoTIFF from 'geotiff';
import * as React from 'react';
import { colorScales } from '../lib/colorscales';
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
    const mindata = -0;
    const maxdata = 8000;
    layer
      .source(tiffdata.data, {
        parser: {
          type: 'raster',
          width: tiffdata.width,
          height: tiffdata.height,
          extent: [73.482190241, 3.82501784112, 135.106618732, 57.6300459963],
          // extent: [
          //   73.4766000000000048,
          //   18.1054999999999993,
          //   135.1066187,
          //   57.630046,
          // ],
        },
      })
      .style({
        opacity: 0.8,
        domain: [mindata, maxdata],
        clampLow: true,
        rampColors: {
          colors: [
            'rgb(166,97,26)',
            'rgb(223,194,125)',
            'rgb(245,245,245)',
            'rgb(128,205,193)',
            'rgb(1,133,113)',
          ],
          positions: [0, 0.25, 0.5, 0.75, 1.0],
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
      min: mindata,
      max: maxdata,
      colorScales: 'jet',
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
    rasterFolder
      .add(styleOptions, 'min', mindata, maxdata)
      .onChange((min: number) => {
        layer.style({
          domain: [min, styleOptions.max],
        });
        scene.render();
      });
    rasterFolder
      .add(styleOptions, 'max', mindata, maxdata)
      .onChange((max: number) => {
        layer.style({
          domain: [styleOptions.min, max],
        });
        scene.render();
      });
    rasterFolder
      .add(styleOptions, 'colorScales', Object.keys(colorScales))
      .onChange((color: string) => {
        layer.style({
          rampColors: colorScales[color],
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
      // 'https://gw.alipayobjects.com/zos/antvdemo/assets/2019_clip/ndvi_201905.tiff',
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
