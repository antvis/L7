import { Bounds, GeoCoordinates, Point, toLngLat } from '@antv/geo-coord';
import {
  createLayerContainer,
  ILayer,
  ILayerGroup,
  ILayerService,
  ILngLat,
} from '@antv/l7-core';
import { Container } from 'inversify';

import ImageTile from './ImageTile';
import TileCache from './tileCache';

// Tip: 瓦片地图的存储上限
const CacheLimit = 30;

export default class Tile {
  public tileList: any = {};
  public tileCache: any;

  public updateTileList: any[];
  public tileZoom: number;
  public noPruneRange: any;
  public url: string;
  public resolution: number;
  public maxSourceZoom: number;
  public crstype: string;
  public currentCrs: any;

  public layerService: ILayerService;
  public layer: ILayerGroup;
  constructor(props: any) {
    this.layerService = props.layerService;
    this.layer = props.layer;
    this.url = props.url;
    this.resolution = props.resolution === 'low' ? -1 : 0;
    this.maxSourceZoom = props.maxSourceZoom;
    this.crstype = props.crstype;

    this.currentCrs = new GeoCoordinates.default({
      start: { x: 0, y: 0 },
      end: { x: 0, y: 0 },
      projection: this.crstype,
    }).crs as any;

    this.destroyTile = this.destroyTile.bind(this);
    this.tileCache = new TileCache(CacheLimit, this.destroyTile);

    this.updateTileList = [];

    this.removeTiles = this.removeTiles.bind(this);
  }

  public calCurrentTiles(oprions: any) {
    const {
      NE,
      SW,
      tileCenter,
      currentZoom,
      minSourceZoom,
      minZoom,
      maxZoom,
    } = oprions;
    // TODO: 当前瓦片的层级要比地图底图的层级低
    if (currentZoom >= this.maxSourceZoom) {
      return;
    }
    const zoom = Math.floor(currentZoom) + this.resolution;

    this.tileZoom = zoom > this.maxSourceZoom ? this.maxSourceZoom : zoom;

    if (
      currentZoom < minZoom ||
      currentZoom >= maxZoom ||
      currentZoom < minSourceZoom
    ) {
      this.removeTiles();
      return;
    }

    this.updateTileList = [];

    // 计算瓦片中心
    const centerPoint = this.currentCrs.lngLatToPoint(
      toLngLat(tileCenter.lng, tileCenter.lat),
      this.tileZoom,
    );
    const centerXY = centerPoint.divideBy(256).floor();

    const pixelBounds = this.getPixelBounds(
      NE,
      SW,
      tileCenter,
      this.tileZoom,
      this.currentCrs,
    ); // 计算像素范围
    const tileRange = this.pxBoundsToTileRange(pixelBounds); // 计算瓦片范围

    const margin = 4;

    this.noPruneRange = new Bounds(
      tileRange.getBottomLeft().subtract([margin, -margin]),
      tileRange.getTopRight().add([margin, -margin]),
    );

    // T: isFinite(n: number) 用于检测 n 是否无穷大
    if (
      !(
        isFinite(tileRange.min.x) &&
        isFinite(tileRange.min.y) &&
        isFinite(tileRange.max.x) &&
        isFinite(tileRange.max.y)
      )
    ) {
      throw new Error('Attempted to load an infinite number of tiles');
    }

    // 根据视野判断新增的瓦片索引
    for (let j = tileRange.min.y; j <= tileRange.max.y; j++) {
      for (let i = tileRange.min.x; i <= tileRange.max.x; i++) {
        const coords = [i, j, this.tileZoom];
        const tile = this.tileList[coords.join('_')];
        if (tile) {
          tile.current = true;
        } else {
          this.tileList[coords.join('_')] = {
            current: true,
            coords,
          };
          this.updateTileList.push(coords);
        }
      }
    }

    // 瓦片列表排序
    this.updateTileList.sort((a: any, b: any) => {
      const tile1 = a;
      const tile2 = b;
      const d1 =
        Math.pow(tile1[0] * 1 - centerXY.x, 2) +
        Math.pow(tile1[1] * 1 - centerXY.y, 2);
      const d2 =
        Math.pow(tile2[0] * 1 - centerXY.x, 2) +
        Math.pow(tile2[1] * 1 - centerXY.y, 2);
      return d1 - d2;
    });

    this.pruneTiles();
    this.updateTileList.forEach((coords: any) => {
      const key = coords.join('_');
      if (this.tileList[key].current) {
        this.requestTile(key);
      }
    });
  }

  public pxBoundsToTileRange(pixelBounds: any) {
    return new Bounds(
      pixelBounds.min.divideBy(256).floor(),
      pixelBounds.max
        .divideBy(256)
        .ceil()
        .subtract([1, 1]),
    );
  }

  public getPixelBounds(
    NE: ILngLat,
    SW: ILngLat,
    tileCenter: ILngLat,
    tileZoom: number,
    crs: any,
  ) {
    const zoom = tileZoom;
    const NEPoint = crs.lngLatToPoint(toLngLat(NE.lng, NE.lat), zoom);
    const SWPoint = crs.lngLatToPoint(toLngLat(SW.lng, SW.lat), zoom);
    const centerPoint = crs.lngLatToPoint(
      toLngLat(tileCenter.lng, tileCenter.lat),
      zoom,
    );
    const topHeight = centerPoint.y - NEPoint.y;
    const bottomHeight = SWPoint.y - centerPoint.y;
    // 跨日界线的情况
    let leftWidth;
    let rightWidth;
    if (tileCenter.lng - NE.lng > 0 || tileCenter.lng - SW.lng < 0) {
      const width =
        ((Math.pow(2, zoom) * 256) / 360) * (180 - NE.lng) +
        ((Math.pow(2, zoom) * 256) / 360) * (SW.lng + 180);
      if (tileCenter.lng - NE.lng > 0) {
        // 日界线在右侧
        leftWidth =
          ((Math.pow(2, zoom) * 256) / 360) * (tileCenter.lng - NE.lng);
        rightWidth = width - leftWidth;
      } else {
        rightWidth =
          ((Math.pow(2, zoom) * 256) / 360) * (SW.lng - tileCenter.lng);
        leftWidth = width - rightWidth;
      }
    } else {
      // 不跨日界线
      leftWidth = ((Math.pow(2, zoom) * 256) / 360) * (tileCenter.lng - SW.lng);
      rightWidth =
        ((Math.pow(2, zoom) * 256) / 360) * (NE.lng - tileCenter.lng);
    }
    const pixelBounds = new Bounds(
      centerPoint.subtract(leftWidth, topHeight),
      centerPoint.add(rightWidth, bottomHeight),
    );
    return pixelBounds;
  }

  public pruneTiles() {
    Object.keys(this.tileList).map((key) => {
      const c = this.tileList[key].coords;
      // 如果不是同一个缩放层级，则将瓦片设为不显示
      if (
        c[2] !== this.tileZoom ||
        !this.noPruneRange.contains(new Point(c[0], c[1]))
      ) {
        this.tileList[key].current = false;
      }
    });

    Object.keys(this.tileList).map((key) => {
      const tile = this.tileList[key];
      tile.retain = tile.current;
    });

    Object.keys(this.tileList).map((key) => {
      const tile = this.tileList[key];
      if (tile.current && !tile.active) {
        const [x, y, z] = key.split('_').map((v) => Number(v));

        if (!this.retainParent(x, y, z, z - 5)) {
          this.retainChildren(x, y, z, z + 2);
        }
      }
    });

    this.removeOutTiles();
  }

  public requestTile(key: string) {
    const t = this.tileList[key];
    if (!t) {
      return;
    }
    let tile = this.tileCache.getTile(key);
    if (!tile) {
      const container = createLayerContainer(
        this.layer.sceneContainer as Container,
      );
      tile = new ImageTile(
        key,
        this.url,
        container,
        this.layer.sceneContainer as Container,
      );
      tile.name = key;

      t.current = true;
      t.retain = true;
      t.active = true;

      // 往 imageTileLayer 中添加子图层
      this.layer.addChild(tile.imageLayer);

      this.tileCache.setTile(tile, key);

      this.pruneTiles();
      this.layerService.updateLayerRenderList();
      this.layerService.renderLayers();
    } else {
      // Tip: show 方法就是将相应的瓦片图片添加到渲染队列
      tile.imageLayer.show();
      t.current = true;
      t.retain = true;
      t.active = true;

      this.pruneTiles();
    }
  }

  public retainParent(x: number, y: number, z: number, minZoom: number): any {
    const x2 = Math.floor(x / 2);
    const y2 = Math.floor(y / 2);
    const z2 = z - 1;
    const tile = this.tileList[[x2, y2, z2].join('_')];
    if (tile && tile.active) {
      tile.retain = true;
      return true;
    } else if (tile && tile.loaded) {
      tile.retain = true;
    }
    if (z2 > minZoom) {
      return this.retainParent(x2, y2, z2, minZoom);
    }
    return false;
  }

  public retainChildren(x: number, y: number, z: number, maxZoom: number) {
    for (let i = 2 * x; i < 2 * x + 2; i++) {
      for (let j = 2 * y; j < 2 * y + 2; j++) {
        const key = [i, j, z + 1].join('_');
        const tile = this.tileList[key];
        if (tile && tile.active) {
          tile.retain = true;
          continue;
        } else if (tile && tile.loaded) {
          tile.retain = true;
        }

        if (z + 1 < maxZoom) {
          this.retainChildren(i, j, z + 1, maxZoom);
        }
      }
    }
  }

  public destroyTile(tile: any) {
    this.layer.removeChild(tile.imageLayer);
    this.layerService.updateLayerRenderList();
    this.layerService.renderLayers();

    // 清除 tileCache 中的存储 相当于 tileCache.setTile(tile, null)
    tile = null;
  }

  public removeOutTiles() {
    for (const key in this.tileList) {
      if (!this.tileList[key].retain) {
        // Tip: 不需要显示的瓦片对象
        const tile = this.tileCache.getTile(key);
        // Tip: 若是网格对象存在
        if (tile) {
          // Tip: hide 方法就是将相应的瓦片图片从渲染队列中剔除
          tile.imageLayer.hide();
        }
        delete this.tileList[key];
      }
    }
  }

  public removeTiles() {
    this.layer.clearChild();
    this.layerService.updateLayerRenderList();
    this.layerService.renderLayers();
    this.tileList = {};
    this.tileCache.destory();
  }
}
