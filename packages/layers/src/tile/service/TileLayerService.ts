import { ILayer, ILngLat, IRendererService, ITexture2D } from '@antv/l7-core';
import { SourceTile, IColorRamp } from '@antv/l7-utils';
import 'reflect-metadata';
import Tile from '../tileFactory/Tile';
import { createColorTexture } from '../style/utils';

interface TileLayerServiceOptions {
  rendererService: IRendererService;
  parent:ILayer;
}

interface ITileLayerStyleOptions {
  rampColors?: IColorRamp;
}


export class TileLayerService {
  private rendererService: IRendererService;
  private parent: ILayer;

  public colorTexture: ITexture2D; // 颜色纹理，被栅格瓦片共用

  private _tiles: Tile[] = [];
  constructor({ rendererService, parent }: TileLayerServiceOptions) {
    this.rendererService = rendererService;
    this.parent = parent;
    // 初始化全局资源
    this.initGlobalResource();
  }
  get tiles():Tile[] {
    return this._tiles;
  }

  // 初始化全局资源 - 所有瓦片共用的资源
  initGlobalResource() {
    const { rampColors } = this.parent.getLayerConfig() as ITileLayerStyleOptions;
    if(rampColors) {
      this.colorTexture = createColorTexture(rampColors, this.rendererService);
    }
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
    // this.rendererService.clear({
    //   stencil: 0,
    //   depth: 1,
    //   framebuffer: null,
    // });
    // this.parent.masks.map( async(mask) =>{
    //   await mask.hooks.beforeRenderData.promise();
    //   mask.hooks.beforeRender.call();
    //   mask.render();
    //   mask.hooks.afterRender.call();
    // })
    // TODO 渲染排序
    this._tiles.filter((t)=>t.visible && t.isLoaded)
      .map((tile: Tile) => {
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
