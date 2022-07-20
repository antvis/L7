import {
  IInteractionTarget,
  ILayer,
  ILayerService,
  IMapService,
  IScale,
  IScaleOptions,
  ISource,
  ITileLayer,
  ITileLayerManager,
  ITileLayerOPtions,
} from '@antv/l7-core';
import { decodePickingColor, Tile, TilesetManager } from '@antv/l7-utils';
import { TileLayerManager } from '../manager/tileLayerManager';

export default class BaseTileLayer implements ITileLayer {
  public get children() {
    return this.tileLayerManager.children;
  }
  public type: string = 'baseTile';
  public sourceLayer: string;
  public parent: ILayer;
  // 瓦片是否加载成功
  public initedTileset: boolean = false;
  // 瓦片数据管理器
  public tilesetManager: TilesetManager | undefined;
  public tileLayerManager: ITileLayerManager;
  public scaleField: any;

  private lastViewStates: {
    zoom: number;
    latLonBounds: [number, number, number, number];
  };

  private timer: any;
  private mapService: IMapService;
  private layerService: ILayerService;
  private pickColors: {
    select: any;
    active: any;
  } = {
    select: null,
    active: null,
  };

  constructor({
    parent,
    rendererService,
    mapService,
    layerService,
    pickingService,
  }: ITileLayerOPtions) {
    const parentSource = parent.getSource();
    const { sourceLayer, coords, featureId } =
      parentSource?.data?.tilesetOptions || {};
    this.sourceLayer = sourceLayer;
    this.parent = parent;
    this.mapService = mapService;
    this.layerService = layerService;

    this.tileLayerManager = new TileLayerManager(
      parent,
      mapService,
      rendererService,
      pickingService,
      layerService,
    );

    this.initTileSetManager();
    this.bindSubLayerEvent();
    this.bindSubLayerPick();

    this.scaleField = this.parent.getScaleOptions();
  }

  /**
   * 渲染瓦片的图层
   */
  public render() {
    if (this.tileLayerManager) {
      this.tileLayerManager.render();
    }
  }

  public clearPick(type: string) {
    if (type === 'mousemove') {
      this.tileLayerManager.tilePickManager.clearPick();
    }
  }

  /**
   * 清除 select 的选中状态
   */
  public clearPickState() {
    this.children
      .filter((child) => child.inited && child.isVisible())
      .filter((child) => child.getCurrentSelectedId() !== null)
      .map((child) => {
        this.selectFeature(child, new Uint8Array([0, 0, 0, 0]));
        child.setCurrentSelectedId(null);
      });
  }

  /**
   * 瓦片图层独立的拾取逻辑
   * @param target
   * @returns
   */
  public pickLayers(target: IInteractionTarget) {
    return this.tileLayerManager.pickLayers(target);
  }

  public tileLoaded(tile: Tile) {
    //
  }

  public tileError(error: Error) {
    console.warn('error:', error);
  }

  public tileUnLoad(tile: Tile) {
    this.tileLayerManager.removeChilds(tile.layerIDList, false);
  }

  public tileUpdate() {
    // Base Function
    if (!this.tilesetManager) {
      return;
    }

    this.tilesetManager.tiles
      .filter((tile) => tile.isLoaded)
      .map((tile) => {
        if (tile.layerIDList.length === 0) {
          const { layers, layerIDList } = this.tileLayerManager.createTile(
            tile,
          );
          tile.layerIDList = layerIDList;
          this.tileLayerManager.addChilds(layers);
        } else {
          if (!tile.isVisibleChange) {
            return;
          }
          const layers = this.tileLayerManager.getChilds(tile.layerIDList);
          this.tileLayerManager.updateLayersConfig(
            layers,
            'visible',
            tile.isVisible,
          );
        }
      });

    if (this.tilesetManager.isLoaded) {
      // 将事件抛出，图层上可以使用瓦片
      this.parent.emit('tiles-loaded', this.tilesetManager.currentTiles);
    }
  }

  protected setPickState(layers: ILayer[]) {
    if (this.pickColors.select) {
      const selectedId = decodePickingColor(this.pickColors.select);
      layers.map((layer) => {
        this.selectFeature(layer, this.pickColors.select);
        layer.setCurrentSelectedId(selectedId);
      });
    }

    if (this.pickColors.active) {
      const selectedId = decodePickingColor(this.pickColors.active);
      layers
        .filter((layer) => layer.inited && layer.isVisible())
        .map((layer) => {
          layer.hooks.beforeHighlight.call(this.pickColors.active);
          layer.setCurrentPickId(selectedId);
        });
    }
  }

  private bindSubLayerPick() {
    this.tileLayerManager.tilePickManager.on('pick', (e) => {
      // @ts-ignore
      const [r, g, b] = e.pickedColors;

      if (e.type === 'click') {
        const restLayers = this.children
          .filter(
            (child) => child.inited && child.isVisible() && child.isVector,
          )
          .filter((child) => child !== e.layer);
        this.setSelect(restLayers, [r, g, b]);
      } else {
        this.setHighlight([r, g, b]);
      }
    });

    this.tileLayerManager.tilePickManager.on('unpick', () => {
      this.pickColors.active = null;
    });
  }

  private setHighlight(pickedColors: any) {
    const pickId = decodePickingColor(pickedColors);
    this.pickColors.active = pickedColors;
    this.children
      .filter((child) => child.inited && child.isVisible() && child.isVector)
      // Tip: 使用 vectorLayer 上的 pickID 优化高亮操作（过滤重复操作）
      // @ts-ignore
      .filter((child) => child.getPickID() !== pickId)
      .map((child) => {
        // @ts-ignore
        child.setPickID(pickId);
        child.hooks.beforeHighlight.call(pickedColors);
      });
  }

  private setSelect(layers: ILayer[], pickedColors: any) {
    const selectedId = decodePickingColor(pickedColors);
    layers.map((layer) => {
      if (
        layer.getCurrentSelectedId() === null ||
        selectedId !== layer.getCurrentSelectedId()
      ) {
        this.selectFeature(layer, pickedColors);
        layer.setCurrentSelectedId(selectedId);
        this.pickColors.select = pickedColors;
      } else {
        this.selectFeature(layer, new Uint8Array([0, 0, 0, 0])); // toggle select
        layer.setCurrentSelectedId(null);
        this.pickColors.select = null;
      }
    });
    // unselect normal layer
    const renderList = this.layerService.getRenderList();
    renderList
      .filter(
        (layer) =>
          layer.inited &&
          !layer.isVector &&
          layer.isVisible() &&
          layer.needPick('click'),
      )
      .filter((layer) => layer.getCurrentSelectedId() !== null)
      .map((layer) => {
        this.selectFeature(layer, new Uint8Array([0, 0, 0, 0]));
        layer.setCurrentSelectedId(null);
      });
  }

  private selectFeature(layer: ILayer, pickedColors: Uint8Array | undefined) {
    // @ts-ignore
    const [r, g, b] = pickedColors;
    layer.hooks.beforeSelect.call([r, g, b]);
  }

  private bindSubLayerEvent() {
    /**
     * layer.on('click', (ev) => {}); // 鼠标左键点击图层事件
     * layer.on('mouseenter', (ev) => {}); // 鼠标进入图层要素
     * layer.on('mousemove', (ev) => {}); // 鼠标在图层上移动时触发
     * layer.on('mouseout', (ev) => {}); // 鼠标移出图层要素时触发
     * layer.on('mouseup', (ev) => {}); // 鼠标在图层上单击抬起时触发
     * layer.on('mousedown', (ev) => {}); // 鼠标在图层上单击按下时触发
     * layer.on('contextmenu', (ev) => {}); // 图层要素点击右键菜单
     *
     *  鼠标在图层外的事件
     * layer.on('unclick', (ev) => {}); // 图层外点击
     * layer.on('unmousemove', (ev) => {}); // 图层外移动
     * layer.on('unmouseup', (ev) => {}); // 图层外鼠标抬起
     * layer.on('unmousedown', (ev) => {}); // 图层外单击按下时触发
     * layer.on('uncontextmenu', (ev) => {}); // 图层外点击右键
     * layer.on('unpick', (ev) => {}); // 图层外的操作的所有事件
     */
    this.parent.on('subLayerClick', (e) => {
      this.parent.emit('click', { ...e });
    });
    this.parent.on('subLayerMouseMove', (e) =>
      this.parent.emit('mousemove', { ...e }),
    );
    this.parent.on('subLayerMouseUp', (e) =>
      this.parent.emit('mouseup', { ...e }),
    );
    this.parent.on('subLayerMouseEnter', (e) =>
      this.parent.emit('mouseenter', { ...e }),
    );
    this.parent.on('subLayerMouseOut', (e) =>
      this.parent.emit('mouseout', { ...e }),
    );
    this.parent.on('subLayerMouseDown', (e) =>
      this.parent.emit('mousedown', { ...e }),
    );
    this.parent.on('subLayerContextmenu', (e) =>
      this.parent.emit('contextmenu', { ...e }),
    );

    // vector layer 图层外事件
    this.parent.on('subLayerUnClick', (e) =>
      this.parent.emit('unclick', { ...e }),
    );
    this.parent.on('subLayerUnMouseMove', (e) =>
      this.parent.emit('unmousemove', { ...e }),
    );
    this.parent.on('subLayerUnMouseUp', (e) =>
      this.parent.emit('unmouseup', { ...e }),
    );
    this.parent.on('subLayerUnMouseDown', (e) =>
      this.parent.emit('unmousedown', { ...e }),
    );
    this.parent.on('subLayerUnContextmenu', (e) =>
      this.parent.emit('uncontextmenu', { ...e }),
    );
  }

  private initTileSetManager() {
    const source: ISource = this.parent.getSource();
    this.tilesetManager = source.tileset as TilesetManager;

    if (!this.initedTileset) {
      this.bindTilesetEvent();
      this.initedTileset = true;
    }

    const { latLonBounds, zoom } = this.getCurrentView();
    this.tilesetManager?.update(zoom, latLonBounds);
  }

  private mapchange() {
    const { latLonBounds, zoom } = this.getCurrentView();

    if (this.mapService.version === 'GAODE1.x') {
      const { visible } = this.parent.getLayerConfig();
      if (zoom < 3 && visible) {
        this.parent.updateLayerConfig({ visible: false });
        this.layerService.updateLayerRenderList();
      } else if (zoom >= 3 && !visible) {
        this.parent.updateLayerConfig({ visible: true });
        this.layerService.updateLayerRenderList();
      }
    }

    if (
      this.lastViewStates &&
      this.lastViewStates.zoom === zoom &&
      this.lastViewStates.latLonBounds.toString() === latLonBounds.toString()
    ) {
      return;
    }
    this.lastViewStates = { zoom, latLonBounds };

    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }

    // this.timer = setTimeout(() => {
    this.tilesetManager?.update(zoom, latLonBounds);
    // }, 250);
  }

  private bindTilesetEvent() {
    if (!this.tilesetManager) {
      return;
    }
    // 瓦片数据加载成功
    this.tilesetManager.on('tile-loaded', (tile: Tile) => {
      // todo: 将事件抛出，图层上可以监听使用
    });

    // 瓦片数据从缓存删除或被执行重新加载
    this.tilesetManager.on('tile-unload', (tile: Tile) => {
      // todo: 将事件抛出，图层上可以监听使用
      this.tileUnLoad(tile);
    });

    // 瓦片数据加载失败
    this.tilesetManager.on('tile-error', (error, tile: Tile) => {
      // todo: 将事件抛出，图层上可以监听使用
      this.tileError(error);
    });

    // 瓦片显隐状态更新
    this.tilesetManager.on('tile-update', () => {
      this.tileUpdate();
    });

    // 地图视野发生改变
    this.mapService.on('zoomend', () => this.mapchange());
    this.mapService.on('moveend', () => this.mapchange());
  }

  private getCurrentView() {
    const bounds = this.mapService.getBounds();
    const latLonBounds: [number, number, number, number] = [
      bounds[0][0],
      bounds[0][1],
      bounds[1][0],
      bounds[1][1],
    ];
    const zoom = this.mapService.getZoom();

    return { latLonBounds, zoom };
  }
}
