import {
  IInteractionTarget,
  ILayer,
  ILayerService,
  IPickingService,
  ISource,
  ITile,
  ITilePickService,
  TYPES,
} from '@antv/l7-core';
import {
  decodePickingColor,
  encodePickingColor,
  extentPoints,
  getBBox,
  initRectPolygon,
  intersectPolygon,
  IPointsType,
  pointsType,
  TileBounds,
  TilesetManager,
} from '@antv/l7-utils';
import { filterByPolygon, ICoverRect } from '../../core/helper';
import { TileLayerService } from './TileLayerService';
import { TileSourceService } from './TileSourceService';
export interface ITilePickServiceOptions {
  layerService: ILayerService;
  tileLayerService: TileLayerService;
  tilesetManager: TilesetManager;
  parent: ILayer;
}

const SELECT = 'select';
const ACTIVE = 'active';
export class TilePickService implements ITilePickService {
  private layerService: ILayerService;
  private tileLayerService: TileLayerService;
  private tileSourceService: TileSourceService;
  private tilesetManager: TilesetManager;
  private parent: ILayer;
  private tilePickID = new Map();
  constructor({
    layerService,
    tileLayerService,
    parent,
    tilesetManager,
  }: ITilePickServiceOptions) {
    this.layerService = layerService;
    this.tileLayerService = tileLayerService;
    this.parent = parent;
    this.tilesetManager = tilesetManager;
    this.tileSourceService = new TileSourceService();
  }
  public pickRender(target: IInteractionTarget) {
    // 一个 TileLayer 有多个 Tile，但是会同时触发事件的只有一个 Tile
    const tile = this.tileLayerService.getVisibleTileBylngLat(target.lngLat);
    if (tile) {
      // TODO 多图层拾取
      const pickLayer = tile.getMainLayer();
      pickLayer?.layerPickService.pickRender(target);
    }
  }

  /**
   * 圈选数据
   * @param points
   * @returns
   */
  public pickData(points: number[]) {
    return new Promise((resolve) => {
      this.pickTileData(points, (data) => {
        resolve(data);
      });
    });
  }

  private pickTileData(points: number[], callback: (data: any) => void) {
    const type = pointsType(points);
    switch (type) {
      case IPointsType.POINT: // 拾取一个点
        callback([]);
        break;
      case IPointsType.POLYGON: // 多边形
        const extent = extentPoints(points); // 获取多边形的范围、包围盒 [minLng, minLat, maxLng, maxLat]
        const covers = this.getCoverOptions(extent);
        const pixelBounds = this.parent.mapService.boundsToContainer(extent); // 获取多边形的像素包围盒
        const { maskLayers, enableMask } = this.parent.getLayerConfig();
        const masks = enableMask ? maskLayers : [];
        const filterOption = {
          container: this.parent.getContainer(),
          pickingService: this.parent.pickingService,
          polygonPoints: points,
          maskLayers: masks as ILayer[],
        };
        filterByPolygon(filterOption, covers, pixelBounds, callback);
        break;
      case IPointsType.BOUNDS: // 拾取矩形
        const boundsCovers = this.getCoverOptions(points);
        const boundsSelect = boundsCovers.map((cover) => {
          return {
            ...cover,
            data: cover.source?.getData(cover.rect),
          };
        });
        callback(boundsSelect);
        break;
      default:
        callback([]);
    }
  }

  private getCoverOptions(lngLatBounds: number[]) {
    const covers = this.getCoverRects(lngLatBounds);
    covers.forEach((cover) => {
      const { coverBounds, tileKey } = cover;
      const tileLayer = this.tileLayerService.getTile(
        tileKey as string,
      ) as ITile;
      const source = tileLayer?.getMainLayer()?.getSource() as ISource;
      const { rect } = source.coverRect(coverBounds as number[]);
      const PixelsBounds = this.parent.mapService.boundsToContainer(
        coverBounds as number[],
      );
      cover.coverPixelsBounds = PixelsBounds;
      cover.bounds = coverBounds as number[];
      cover.rect = rect;
      cover.source = source;
    });
    return covers;
  }

  /**
   * 计算多边形包围盒与瓦片的重叠矩形
   * @param latLonBounds [minLng, minLat, maxLng, maxLat]
   * @returns
   */
  public getCoverRects(latLonBounds: number[]) {
    const coverRects = this.boundsCover(latLonBounds);
    const tileCoverData: ICoverRect[] = [];
    coverRects.forEach(({ coverBounds, tileKey }) => {
      const tileLayer = this.tileLayerService.getTile(tileKey);
      if (tileLayer) {
        tileCoverData.push({
          tileKey,
          coverBounds,
        });
      }
    });

    return tileCoverData;
  }

  // 计算覆盖区域的瓦片
  public boundsCover = (latLonBounds: number[]) => {
    const [minLat, minLng, maxLat, maxLng] = latLonBounds;
    const boundsRect = initRectPolygon(minLat, minLng, maxLat, maxLng);
    const zoom = this.parent.mapService.getZoom();
    const tileIndices = this.tilesetManager.getTileIndices(zoom, [
      minLat,
      minLng,
      maxLat,
      maxLng,
    ]);
    const combineRects: Array<{ coverBounds: TileBounds; tileKey: string }> =
      [];
    tileIndices.forEach(({ x, y, z }) => {
      const tile = this.tilesetManager.getTile(x, y, z);
      if (tile?.bounds) {
        const tileRect = initRectPolygon(...tile.bounds);
        const combineRect = intersectPolygon(boundsRect, tileRect);
        // 存在重叠部分
        if (combineRect) {
          combineRects.push({
            coverBounds: getBBox(combineRect) as TileBounds,
            tileKey: tile.key,
          });
        }
      }
    });
    return combineRects;
  };

  public pick(layer: ILayer, target: IInteractionTarget) {
    const container = this.parent.getContainer();
    const pickingService = container.get<IPickingService>(
      TYPES.IPickingService,
    );
    if (layer.type === 'RasterLayer') {
      const tile = this.tileLayerService.getVisibleTileBylngLat(target.lngLat);
      if (tile && tile.getMainLayer() !== undefined) {
        const pickLayer = tile.getMainLayer() as ILayer;
        return pickLayer.layerPickService.pickRasterLayer(
          pickLayer,
          target,
          this.parent,
        );
      }
      return false;
    }

    this.pickRender(target);

    return pickingService.pickFromPickingFBO(layer, target);
  }

  public selectFeature(pickedColors: Uint8Array | undefined) {
    // @ts-ignore
    const [r, g, b] = pickedColors;
    const id = this.color2PickId(r, g, b);
    this.tilePickID.set(SELECT, id);
    this.updateHighLight(r, g, b, SELECT);
  }

  public highlightPickedFeature(pickedColors: Uint8Array | undefined) {
    // @ts-ignore
    const [r, g, b] = pickedColors;
    const id = this.color2PickId(r, g, b);
    this.tilePickID.set(ACTIVE, id);
    this.updateHighLight(r, g, b, ACTIVE);
  }

  public updateHighLight(r: number, g: number, b: number, type: string) {
    this.tileLayerService.tiles.map((tile: ITile) => {
      const layer = tile.getMainLayer();
      switch (type) {
        case SELECT:
          layer?.hooks.beforeSelect.call([r, g, b]);
          break;
        case ACTIVE:
          layer?.hooks.beforeHighlight.call([r, g, b]);
          break;
      }
    });
  }

  public setPickState() {
    const selectColor = this.tilePickID.get(SELECT);
    const activeColor = this.tilePickID.get(ACTIVE);
    if (selectColor) {
      const [r, g, b] = this.pickId2Color(selectColor);
      this.updateHighLight(r, g, b, SELECT);
      return;
    }
    if (activeColor) {
      const [r, g, b] = this.pickId2Color(activeColor);
      this.updateHighLight(r, g, b, ACTIVE);
      return;
    }
  }

  private color2PickId(r: number, g: number, b: number) {
    return decodePickingColor(new Uint8Array([r, g, b]));
  }

  private pickId2Color(str: number) {
    return encodePickingColor(str);
  }

  /** 从瓦片中根据数据 */
  public getFeatureById(pickedFeatureIdx: number) {
    // 提取当前可见瓦片
    const tiles = this.tileLayerService
      .getTiles()
      .filter((tile: ITile) => tile.visible);
    // 提取当前可见瓦片中匹配 ID 的 feature 列表
    const features: any[] = [];
    tiles.forEach((tile: ITile) => {
      features.push(...tile.getFeatureById(pickedFeatureIdx));
    });

    // 将 feature 列表合并后返回
    // 统一返回成 polygon 的格式 点、线、面可以通用

    // const data = this.tileSourceService.getCombineFeature(features);

    return features;
  }

  // Tip: for interface define
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public pickRasterLayer(
    layer: ILayer,
    target: IInteractionTarget,
    parent?: ILayer,
  ) {
    return false;
  }
}
