import {
  createLayerContainer,
  ILayer,
  ILayerGroup,
  IModelUniform,
} from '@antv/l7-core';
import { Tile, TilesetManager } from '@antv/l7-utils';
import { Container } from 'inversify';
import BaseModel from '../../core/BaseModel';
import ImageLayer from '../../image';
import LineLayer from '../../line';
import PointLayer from '../../point';

export default class RasterTileModel extends BaseModel {
  // 瓦片是否加载成功
  public initedTileset = false;
  // 瓦片数据管理器
  public tilesetManager: TilesetManager | undefined;
  public showGrid = true;
  // 瓦片网格子图层，用于调试
  private subGridLayer: ILayer;
  // 瓦片网格文本子图层，用于调试
  private subTextLayer: ILayer;

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

    return this.buildModels();
  }

  public buildModels() {
    return [];
  }

  public clearModels() {
    this.tilesetManager?.destroy();
  }

  // 渲染更新子图层
  public renderSubLayers = () => {
    if (!this.tilesetManager) {
      return;
    }
    const layerChildren = this.tilesetManager.tiles
      .filter((tile) => tile.isLoaded && tile.data)
      .map((tile) => {
        if (tile.layer) {
          this.layer.updateLayerConfig({
            visible: tile.isVisible,
          });
        } else {
          tile.layer = this.creatSubLayer(tile);
        }

        return tile.layer;
      });

    this.layer.layerChildren = layerChildren;

    if (this.showGrid) {
      this.renderSubGridLayer();
      this.layer.layerChildren = layerChildren.concat(
        this.subGridLayer,
        this.subTextLayer,
      );
      // this.layer.layerChildren = [this.subGridLayer, this.subTextLayer];
    }

    this.layerService.updateLayerRenderList();
    this.layerService.renderLayers();
  };

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
      .shape('line')
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

  // 创建子图层
  public creatSubLayer(tile: Tile) {
    const layer = new ImageLayer({
      zIndex: -999,
      visible: tile.isVisible,
    }).source(tile.data, {
      parser: {
        type: 'image',
        extent: tile.bbox,
      },
    });
    const container = createLayerContainer(
      this.layer.sceneContainer as Container,
    );
    layer.setContainer(container, this.layer.sceneContainer as Container);
    layer.init();

    return layer;
  }

  protected registerBuiltinAttributes() {
    //
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

  // 监听瓦片管理器
  private bindTilesetEvent() {
    if (!this.tilesetManager) {
      return;
    }

    this.tilesetManager.on('tile-load', (tile: Tile) => {
      tile.layer?.destroy();
      // console.log('tile-load: ', tile);
    });
    this.tilesetManager.on('tile-unload', (tile: Tile) => {
      tile.layer?.destroy();
      // console.log('tile-unload: ', tile);
    });
    this.tilesetManager.on('tile-error', (error, tile: Tile) => {
      tile.layer?.destroy();
      // console.log('tile-error', error, tile);
    });
    this.tilesetManager.on('tile-update', this.renderSubLayers);

    // 地图视野发生改变
    this.mapService.on('mapchange', (e) => {
      const { latLonBounds, zoom } = this.getCurrentView();
      this.tilesetManager?.update(zoom, latLonBounds);
    });
  }
}
