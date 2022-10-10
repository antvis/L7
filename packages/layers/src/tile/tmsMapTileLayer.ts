import { Tile } from '@antv/l7-utils';
import BaseTileLayer from './tileLayer/baseMapTileLayer';
import { updateTileVisible } from './utils';

export class TMSBaseMapTileLayer extends BaseTileLayer {
  public type: string = 'BaseMapTMS';
  public tileUnLoad(tile: Tile) {
    this.tileLayerManager.removeChilds(tile.layerIDList, false);
  }
  public tileUpdate() {
    if (!this.tilesetManager) {
      return;
    }
    this.tilesetManager.tiles
      .filter((tile: Tile) => tile.isLoaded)
      .map((tile: Tile) => {
        if (tile.data?.layers && this.sourceLayer) {
          // vector
          const vectorTileLayer = tile.data.layers[this.sourceLayer];
          const features = vectorTileLayer?.features;
          if (!(Array.isArray(features) && features.length > 0)) {
            return;
          }
        }
        if (!tile.parentLayerIDList.includes(this.parent.id)) {
          const { layers, layerIDList } = this.tileLayerManager.createTile(
            tile,
          );
          tile.parentLayerIDList.push(this.parent.id);
          tile.layerIDList.push(...layerIDList);

          this.tileLayerManager.addChilds(layers);
        } else {
          if (!tile.isVisibleChange) {
            return;
          }
          const layers = this.tileLayerManager.getChilds(tile.layerIDList);
          updateTileVisible(tile, layers, this.layerService);
        }
      });

    if (this.tilesetManager.isLoaded) {
      // 将事件抛出，图层上可以使用瓦片
      this.parent.emit('tiles-loaded', this.tilesetManager.currentTiles);
    }
  }
}
