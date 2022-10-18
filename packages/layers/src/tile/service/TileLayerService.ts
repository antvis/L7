import { ILayer, ILngLat, IRendererService } from '@antv/l7-core';
import { SourceTile } from '@antv/l7-utils';
import 'reflect-metadata';
import Tile from '../tileFactory/Tile';

interface TileLayerServiceOptions {
  rendererService: IRendererService;
}

export class TileLayerService {
  private rendererService: IRendererService;

  private _tiles: Tile[] = [];
  constructor({ rendererService }: TileLayerServiceOptions) {
    this.rendererService = rendererService;
  }
  get tiles():Tile[] {
    return this.tiles;
  }

  hasTile(tileKey: string): boolean {
    return this._tiles.some((tile) => tile.key === tileKey);
  }

  addTile(tile: Tile) {
    this._tiles.push(tile);
  }

  getTile(tileKey: string): Tile | undefined {
    return this._tiles.find((tile) => tile.key === tileKey);
  }
  getVisibleTileBylngLat(langLat: ILngLat): Tile | undefined {
    // 加载完成 & 可见 & 鼠标选中
    return this._tiles.find(
      (tile) => tile.isLoaded && tile.visible && tile.lnglatInBounds(langLat),
    );
  }

  removeTile(tileKey: string) {
    const index = this._tiles.findIndex((tile) => tile.key === tileKey);
    const tile = this._tiles.splice(index, 1);
    tile[0] && tile[0].destroy();
  }
  updateTileVisible(sourceTile: SourceTile) {
    const tile = this.getTile(sourceTile.key);
    tile?.updateVisible(sourceTile.isVisible);
  }

  render() {
    // TODO 渲染排序
    this._tiles.map((tile: Tile) => {
      const layers = tile.getLayers();
      layers.forEach(async (layer: ILayer) => {
        await layer.hooks.beforeRenderData.promise();
        layer.hooks.beforeRender.call();

        if (layer.masks.length > 0) {
          // 清除上一次的模版缓存
          this.rendererService.clear({
            stencil: 0,
            depth: 1,
            framebuffer: null,
          });
          layer.masks.map(async (m: ILayer) => {
            await m.hooks.beforeRenderData.promise();
            m.hooks.beforeRender.call();
            m.render();
            m.hooks.afterRender.call();
          });
        }
        if (layer.getLayerConfig().enableMultiPassRenderer) {
          // multiPassRender 不是同步渲染完成的
          await layer.renderMultiPass();
        } else {
          layer.render();
        }
        layer.hooks.afterRender.call();
      });
    });
  }
  destroy() {
    this._tiles.forEach((t) => t.destroy());
  }
}
