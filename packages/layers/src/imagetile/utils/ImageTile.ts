import { LngLatBounds, toBounds, toLngLatBounds } from '@antv/geo-coord';
import { Container } from 'inversify';
import ImageLayer from '../../image';

interface IUrlParams {
  x: number;
  y: number;
  z: number;
  s?: string;
}

const r2d = 180 / Math.PI;
const tileURLRegex = /\{([zxy])\}/g;

export default class ImageTile {
  public tile: number[]; // 当前图片瓦片的索引
  public name: string;
  public imageLayer: any;
  constructor(
    key: string,
    url: string,
    container: Container,
    sceneContainer: Container,
  ) {
    this.name = key;
    this.tile = key.split('_').map((v) => Number(v));

    const urlParams = {
      x: this.tile[0],
      y: this.tile[1],
      z: this.tile[2],
    };
    const imageSrc = this.getTileURL(urlParams, url);

    const lnglatBounds = this.tileLnglatBounds(this.tile);
    const west = lnglatBounds.getWest();
    const south = lnglatBounds.getSouth();
    const east = lnglatBounds.getEast();
    const north = lnglatBounds.getNorth();

    const imageLayer = new ImageLayer({ zIndex: -999 });
    imageLayer.source(
      // 'https://gw.alipayobjects.com/zos/rmsportal/FnHFeFklTzKDdUESRNDv.jpg',
      imageSrc,
      {
        parser: {
          type: 'image',
          // extent: [121.168, 30.2828, 121.384, 30.4219],
          extent: [west, south, east, north],
        },
      },
    );

    imageLayer.setContainer(container, sceneContainer);
    imageLayer.init();

    this.imageLayer = imageLayer;
  }

  public destroy() {
    this.imageLayer.clearModels();
    this.imageLayer.destroy();
  }

  public getTileURL(urlParams: IUrlParams, path: string) {
    if (!urlParams.s) {
      // Default to a random choice of a, b or c
      urlParams.s = String.fromCharCode(97 + Math.floor(Math.random() * 3));
    }

    tileURLRegex.lastIndex = 0;
    return path.replace(tileURLRegex, (value, key: any) => {
      // @ts-ignore
      return urlParams[key];
    });
  }

  // Get tile bounds in WGS84 coordinates
  public tileLnglatBounds(tile: number[]) {
    const e = this.tile2lng(tile[0] + 1, tile[2]);
    const w = this.tile2lng(tile[0], tile[2]);
    const s = this.tile2lat(tile[1] + 1, tile[2]);
    const n = this.tile2lat(tile[1], tile[2]);
    return toLngLatBounds([w, n], [e, s]);
  }

  public tile2lng(x: number, z: number) {
    return (x / Math.pow(2, z)) * 360 - 180;
  }

  public tile2lat(y: number, z: number) {
    const n = Math.PI - (2 * Math.PI * y) / Math.pow(2, z);
    return r2d * Math.atan(0.5 * (Math.exp(n) - Math.exp(-n)));
  }
}
