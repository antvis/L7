import { Bounds, Point, toLngLat, GeoCoordinates } from '@antv/geo-coord';
import { ILngLat } from '@antv/l7-core';



export type ICrs = 'epsg3857';
export interface ITileList {
  [key: string]: {
    coords: number[];
    current: boolean; // 瓦片是否需要显示
    retain?: boolean;
    active?: boolean;
    loaded?: boolean;
  };
}
export interface ICalCurrentTiles {
  crstype: ICrs;
  NE: ILngLat;
  SW: ILngLat;
  tileCenter: ILngLat;
  tileZoom: number;
  tileList: ITileList;
  updateTileList: any[];
  minZoom: number;
  maxZoom: number;
}

/**
 * tileList 记录瓦片索引
 */

/**
 * 计算当前需要渲染的瓦片
 * @param oprions
 */
export function calCurrentTiles(oprions: ICalCurrentTiles) {
  const {
    NE,
    SW,
    crstype,
    tileCenter,
    tileZoom,
    tileList,
    updateTileList,
    minZoom,
    maxZoom,
  } = oprions;
  const currentCrs = (new GeoCoordinates.default({
        start: {x: 0, y: 0},
        end: {x: 0, y: 0},
      projection: crstype
    })).crs as any;
  
  // 计算瓦片中心
  const centerPoint = currentCrs.lngLatToPoint(
    toLngLat(tileCenter.lng, tileCenter.lat),
    tileZoom,
  );
  const centerXY = centerPoint.divideBy(256).floor();

  const pixelBounds = getPixelBounds(NE, SW, tileCenter, tileZoom, currentCrs); // 计算像素范围
  const tileRange = pxBoundsToTileRange(pixelBounds); // 计算瓦片范围

  const margin = 2;

  const noPruneRange = new Bounds(
    tileRange.getBottomLeft().subtract([margin, -margin]),
    tileRange.getTopRight().add([margin, -margin]),
  );
  // console.log(noPruneRange)

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
      const coords = [i, j, tileZoom];
      const tile = tileList[coords.join('_')];
      if (tile) {
        tile.current = true;
      } else {
        tileList[coords.join('_')] = {
          current: true,
          coords,
        };
        updateTileList.push(coords);
      }
    }
  }

  // 瓦片列表排序
  updateTileList.sort((a: any, b: any) => {
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

  pruneTiles(tileList, tileZoom, noPruneRange);
  //   console.log(tileList);
}

function pruneTiles(tileList: ITileList, tileZoom: number, noPruneRange: any) {
  let tile;
  const zoom = tileZoom;

  Object.keys(tileList).map((key) => {
    const c = tileList[key].coords;
    // 如果不是同一个缩放层级，则将瓦片设为不显示
    if (c[2] !== zoom || !noPruneRange.contains(new Point(c[0], c[1]))) {
      tileList[key].current = false;
    }
  });
  //   for (const key in tileList) {
  //     const c = tileList[key].coords;
  //     // 如果不是同一个缩放层级，则将瓦片设为不显示
  //     if (c[2] !== zoom || !noPruneRange.contains(new Point(c[0], c[1]))) {
  //       tileList[key].current = false;
  //     }
  //   }

  Object.keys(tileList).map((key) => {
    tile = tileList[key];
    tile.retain = tile.current;
  });

  //   for (const key in tileList) {
  //     tile = tileList[key];
  //     tile.retain = tile.current;
  //   }

  Object.keys(tileList).map((key) => {
    tile = tileList[key];
    if (tile.current && !tile.active) {
      // @ts-ignore
      const [x, y, z] = key.split('_').map((v) => v * 1);
      if (!retainParent(x, y, z, z - 5, tileList)) {
        retainChildren(x, y, z, z + 2, tileList);
      }
    }
  });
  //   for (const key in tileList) {
  //     tile = tileList[key];
  //     if (tile.current && !tile.active) {
  //       // @ts-ignore
  //       const [x, y, z] = key.split('_').map((v) => v * 1);
  //       if (!retainParent(x, y, z, z - 5, tileList)) {
  //         retainChildren(x, y, z, z + 2, tileList);
  //       }
  //     }
  //   }
  // this._removeOutTiles(); // test
}

/**
 * 计算像素范围
 * @param NE
 * @param SW
 * @param tileCenter
 * @param tileZoom
 * @param crs
 * @returns
 */
function getPixelBounds(
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
      leftWidth = ((Math.pow(2, zoom) * 256) / 360) * (tileCenter.lng - NE.lng);
      rightWidth = width - leftWidth;
    } else {
      rightWidth =
        ((Math.pow(2, zoom) * 256) / 360) * (SW.lng - tileCenter.lng);
      leftWidth = width - rightWidth;
    }
  } else {
    // 不跨日界线
    leftWidth = ((Math.pow(2, zoom) * 256) / 360) * (tileCenter.lng - SW.lng);
    rightWidth = ((Math.pow(2, zoom) * 256) / 360) * (NE.lng - tileCenter.lng);
  }
  const pixelBounds = new Bounds(
    centerPoint.subtract(leftWidth, topHeight),
    centerPoint.add(rightWidth, bottomHeight),
  );
  return pixelBounds;
}

/**
 * 计算瓦片范围
 * @param pixelBounds
 * @returns
 */
function pxBoundsToTileRange(pixelBounds: any) {
  return new Bounds(
    pixelBounds.min.divideBy(256).floor(),
    pixelBounds.max
      .divideBy(256)
      .ceil()
      .subtract([1, 1]),
  );
}

function retainParent(
  x: number,
  y: number,
  z: number,
  minZoom: number,
  tileList: ITileList,
): any {
  const x2 = Math.floor(x / 2);
  const y2 = Math.floor(y / 2);
  const z2 = z - 1;
  const tile = tileList[[x2, y2, z2].join('_')];
  if (tile && tile.active) {
    tile.retain = true;
    return true;
  } else if (tile && tile.loaded) {
    tile.retain = true;
  }
  if (z2 > minZoom) {
    return retainParent(x2, y2, z2, minZoom, tileList);
  }
  return false;
}

function retainChildren(
  x: number,
  y: number,
  z: number,
  maxZoom: number,
  tileList: ITileList,
) {
  for (let i = 2 * x; i < 2 * x + 2; i++) {
    for (let j = 2 * y; j < 2 * y + 2; j++) {
      const key = [i, j, z + 1].join('_');
      const tile = tileList[key];
      if (tile && tile.active) {
        tile.retain = true;
        continue;
      } else if (tile && tile.loaded) {
        tile.retain = true;
      }

      if (z + 1 < maxZoom) {
        retainChildren(i, j, z + 1, maxZoom, tileList);
      }
    }
  }
}

// 移除视野外的tile
function removeOutTiles(tileList: ITileList) {
  for (const key in tileList) {
    if (!tileList[key].retain) {
      // const tileObj = this._tileCache.getTile(key);
      // if (tileObj) {
      //     tileObj._abortRequest();
      //     const pickCtr = this.get('pickingController');
      //     pickCtr && pickCtr.removePickMeshByName(tileObj.getMesh().name);
      //     this._tiles.remove(tileObj.getMesh());
      // }
      // if (tileObj && tileObj.getMesh().type === 'composer') {
      //     this.scene._engine.composerLayers = this.scene._engine.composerLayers.filter(obj => {
      //     return obj.name !== tileObj.getMesh().name;
      //     });
      // }
      delete tileList[key];
    }
  }
  // if (this._tiles.children.length > Object.keys(this.tileList).length) {
  //     this._tiles.children.forEach(tile => {
  //         const key = tile.name;
  //         if (!this.tileList[key]) {
  //             this._tiles.remove(tile);
  //         }
  //     });
  // } // 移除 空的geom
}
