import { ILayer, ILayerService, ILngLat, IRendererService, ITexture2D } from '@antv/l7-core';
import { SourceTile } from '@antv/l7-utils';
import 'reflect-metadata';
import Tile from '../tileFactory/Tile';

interface TileLayerServiceOptions {
  rendererService: IRendererService;
  layerService: ILayerService
  parent:ILayer;
}
export class TileLayerService {
  private rendererService: IRendererService;
  private   layerService: ILayerService;
  private parent: ILayer;

  public colorTexture: ITexture2D; // 颜色纹理，被栅格瓦片共用

  private _tiles: Tile[] = [];
  constructor({ rendererService,layerService, parent }: TileLayerServiceOptions) {
    this.rendererService = rendererService;
    this.layerService =layerService;
    this.parent = parent;
  }
  get tiles():Tile[] {
    return this._tiles;
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
  beforeRender() {
    // TODO 统一处理状态更新 attribute style
    
  }

  render() {
    
    this._tiles.filter((t)=>t.visible && t.isLoaded)
      .map(async (tile: Tile) => {
        const layers = tile.getLayers();
        await Promise.all(layers.map(async (layer: ILayer) => {
          await layer.hooks.beforeRenderData.promise();
          layer.hooks.beforeRender.call();
          if (layer.masks.length > 0) {
            // 清除上一次的模版缓存
            // this.rendererService.clear({
            //   stencil: 0,
            //   depth: 1,
            //   framebuffer: null,
            // });
            // await this.layerService.renderMask(layer.masks)
            const m = layer.masks[0]
            await m.hooks.beforeRenderData.promise();
            m.hooks.beforeRender.call();

            this.rendererService.clear({
              stencil: 0,
              depth: 1,
              framebuffer: null,
            });
            
            m.render();
            m.hooks.afterRender.call();
          }
          if (layer.getLayerConfig().enableMultiPassRenderer) {
            // multiPassRender 不是同步渲染完成的
            await layer.renderMultiPass();
          } else {
            layer.render();
          }
          layer.hooks.afterRender.call();
        }));
      })

     // const m = layer.masks[0]
          // await m.hooks.beforeRenderData.promise();
          // m.hooks.beforeRender.call();
          // m.render();
          // m.hooks.afterRender.call();

      // const layers = this.getRenderLayers();
      // // const masks = this.getMaskLayers(layers);
      // // this.rendererService.clear({
      // //   stencil: 0,
      // //   depth: 1,
      // //   framebuffer: null,
      // // });

      // layers.map(async layer =>{
      //   console.log('***' + layer.id)
        


      //   await layer.hooks.beforeRenderData.promise();

       
      //     layer.hooks.beforeRender.call();
         
      //     if (layer.masks.length > 0) {
            
      //       const m = layer.masks[0]
      //       await m.hooks.beforeRenderData.promise();
            
      //       m.hooks.beforeRender.call();
            
      //       console.log(layer.id + '----' + 'clear')
      //       this.rendererService.clear({
      //         stencil: 0,
      //         depth: 1,
      //         framebuffer: null,
      //       });

      //       console.log(layer.id + '----' + 'mask')

      //       m.render();
      //       m.hooks.afterRender.call();
      //     }
      //     console.log(layer.id + '----' + 'layer')
      //     layer.render();
      //     layer.hooks.afterRender.call();
      // })

      // (async () => {
      //     this.rendererService.clear({
      //       stencil: 0,
      //       depth: 1,
      //       framebuffer: null,
      //     });
      //   await this.layerService.renderMask(masks)
      //   await this.layerService.renderMask(layers)
      // })();

      // [...masks, ...layers].map( layer => {
      //    layer.hooks.beforeRenderData.promise();
      //   layer.hooks.beforeRender.call();
      //   // if (layer.masks.length > 0) {
      //   //   // 清除上一次的模版缓存
      //   //   this.rendererService.clear({
      //   //     stencil: 0,
      //   //     depth: 1,
      //   //     framebuffer: null,
      //   //   });
      //   //   await this.layerService.renderMask(layer.masks)
      //   // }
      //   layer.render();
      //   layer.hooks.afterRender.call();
      // })
      
     
    
  }

  

  getRenderLayers() {
    const tileList = this._tiles.filter((t)=>t.visible && t.isLoaded);
    const layers: ILayer[] = [];
    tileList.map(tile => layers.push(...tile.getLayers()))
    return layers;
  }

  getMaskLayers(layers: ILayer[]){
    const masks: ILayer[] = [];
    layers.map(layer => masks.push(...layer.masks));
    return masks;
  }

  destroy() {
    this._tiles.forEach((t) => t.destroy());
  }
}
