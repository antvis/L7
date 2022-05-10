import {
  createLayerContainer,
  ILayer,
  ILayerGroup,
  IModelUniform,
} from '@antv/l7-core';
import { Tile, TilesetManager } from '@antv/l7-utils';
import { Container } from 'inversify';
import BaseModel from '../../core/BaseModel';
import { IRasterTileLayerStyleOptions } from '../../core/interface';
import LineLayer from '../../line';
import MaskLayer from '../../mask';
import PointLayer from '../../point';
import PolygonLayer from '../../polygon';

export default class VertexTileModel extends BaseModel {
  // 瓦片是否加载成功
  public initedTileset = false;
  // 瓦片数据管理器
  public tilesetManager: TilesetManager | undefined;
  // 是否开启瓦片网格子图层，用于调试
  public showGrid = false;
  // 瓦片网格子图层，用于调试
  private subGridLayer: ILayer;
  // 瓦片网格文本子图层，用于调试
  private subTextLayer: ILayer;
  // 上一次视野状态
  private lastViewStates: {
    zoom: number;
    latLonBounds: [number, number, number, number];
  };
  private timer: any;

  public getUninforms(): IModelUniform {
    return {};
  }

  public initModels() {
    const source = this.layer.getSource();
    this.tilesetManager = source.tileset;

    if (!this.initedTileset) {
      this.bindTilesetEvent();
      this.initedTileset = true;
    }

    const { latLonBounds, zoom } = this.getCurrentView();
    this.tilesetManager?.update(zoom, latLonBounds);

    if (this.showGrid) {
      this.renderSubGridLayer();
    }

    return this.buildModels();
  }

  public buildModels() {
    return [];
  }

  public clearModels() {
    //
  }

  // 渲染瓦片网格图层方便调试
  public renderSubGridLayer() {
    if (!this.tilesetManager) {
      return;
    }

    const features = this.tilesetManager.currentTiles.map(
      (tile) => tile.bboxPolygon,
    );

    const data = { type: 'FeatureCollection', features };

    if (this.subGridLayer) {
      this.subGridLayer.setData(data);
      this.subTextLayer.setData(data);
      return;
    }

    this.subGridLayer = new LineLayer({ autoFit: false })
      .source(data)
      .size(1)
      .color('red')
      .shape('simple')
      .style({ lineType: 'dash', dashArray: [1, 2] });

    this.subTextLayer = new PointLayer({ autoFit: false })
      .source(data)
      .size(14)
      .color('red')
      .shape('meta', 'text')
      .style({
        opacity: 1,
        strokeWidth: 1,
        stroke: '#fff',
      });

    this.subGridLayer.setContainer(
      createLayerContainer(this.layer.sceneContainer as Container),
      this.layer.sceneContainer as Container,
    );
    this.subTextLayer.setContainer(
      createLayerContainer(this.layer.sceneContainer as Container),
      this.layer.sceneContainer as Container,
    );
    this.subGridLayer.init();
    this.subTextLayer.init();
  }

  protected registerBuiltinAttributes() {
    //
  }

  // 监听瓦片管理器
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
      this.destroySubLayer(tile);
    });

    // 瓦片数据加载失败
    this.tilesetManager.on('tile-error', (error, tile: Tile) => {
      // todo: 将事件抛出，图层上可以监听使用
    });

    // 瓦片显隐状态更新
    this.tilesetManager.on('tile-update', this.renderSubLayers);

    // 地图视野发生改变
    this.mapService.on('mapchange', (e) => {
      const { latLonBounds, zoom } = this.getCurrentView();

      if (this.mapService.version === 'GAODE1.x') {
        const { visible } = this.layer.getLayerConfig();
        if (zoom < 3 && visible) {
          this.layer.updateLayerConfig({ visible: false });
          this.layerService.updateLayerRenderList();
        } else if (zoom >= 3 && !visible) {
          this.layer.updateLayerConfig({ visible: true });
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

      this.timer = setTimeout(() => {
        this.tilesetManager?.update(zoom, latLonBounds);

        if (this.showGrid) {
          this.renderSubGridLayer();
        }
      }, 250);
    });
  }

  // 创建子图层
  private creatSubLayer(tile: Tile) {
    const {
      opacity = 1,
      zIndex = 0,
      tileLayerName = [],
    } = this.layer.getLayerConfig() as IRasterTileLayerStyleOptions;

    const layerName = tileLayerName[0]; // 'place_label'

    const features = tile.data.layers[layerName]?.features;
    if (!features) {
      return null;
    }

    const layer = new PointLayer({
      visible: tile.isVisible,
      zIndex,
      mask: true,
    })
      .source({
        type: 'FeatureCollection',
        features,
      })
      .shape('circle')
      .color('#00f')
      .size(10)
      .style({
        opacity,
      });
    const container = createLayerContainer(
      this.layer.sceneContainer as Container,
    );
    layer.setContainer(container, this.layer.sceneContainer as Container);
    layer.init();

    const mask = new MaskLayer()
      .source({
        type: 'FeatureCollection',
        features: [tile.bboxPolygon],
      })
      .shape('fill')
      .color('#000')
      .style({
        opacity: 0,
      });
    const layerContainer = createLayerContainer(
      this.layer.sceneContainer as Container,
    );
    mask.setContainer(layerContainer, this.layer.sceneContainer as Container);
    mask.init();
    layer.addMaskLayer(mask);

    return layer;
  }

  // 更新子图层
  private renderSubLayers = () => {
    if (!this.tilesetManager) {
      return;
    }

    const rasteTileLayer = this.layer as ILayerGroup;

    this.tilesetManager.tiles
      .filter((tile) => tile.isLoaded)
      .map((tile) => {
        if (!tile.layer) {
          const subLayer = this.creatSubLayer(tile);
          if (subLayer) {
            tile.layer = subLayer;
            rasteTileLayer.addChild(tile.layer);
          }
        } else {
          // 显隐藏控制
          tile.layer.updateLayerConfig({
            visible: tile.isVisible,
          });
        }
        return tile.layer;
      });

    if (this.showGrid) {
      if (!rasteTileLayer.hasChild(this.subGridLayer)) {
        rasteTileLayer.addChild(this.subGridLayer);
      }
      if (!rasteTileLayer.hasChild(this.subTextLayer)) {
        rasteTileLayer.addChild(this.subTextLayer);
      }
    }

    this.layerService.updateLayerRenderList();
    this.layerService.renderLayers();

    if (this.tilesetManager.isLoaded) {
      // 将事件抛出，图层上可以使用瓦片
      rasteTileLayer.emit('tiles-loaded', this.tilesetManager.currentTiles);
    }
  };

  // 摧毁子图层
  private destroySubLayer(tile: Tile) {
    if (tile.layer) {
      const layerGroup = this.layer as ILayerGroup;
      layerGroup.removeChild(tile.layer);
    }
  }

  // 获取当前视野参数
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
