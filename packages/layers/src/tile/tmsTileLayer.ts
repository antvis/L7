import { Tile, TilesetManager } from '@antv/l7-utils';
import BaseTileLayer from './tileLayer/baseTileLayer';

export class TMSTileLayer extends BaseTileLayer {
  public type: string = 'TMS';
  public tileUnLoad(tile: Tile) {
    this.tileLayerManager.removeChilds(tile.layerIDList);
  }
  public tileUpdate() {
    if (!this.tilesetManager) {
      return;
    }
    this.tilesetManager.tiles
      .filter((tile) => tile.isLoaded)
      .map((tile) => {
        if (tile.data?.layers && this.layerName) {
          // vector
          const vectorTileLayer = tile.data.layers[this.layerName];
          const features = vectorTileLayer?.features;
          if (!(Array.isArray(features) && features.length > 0)) {
            return;
          }
        }

        if (tile.layerIDList.length === 0) {
          const { layers, layerIDList } = this.tileLayerManager.createTile(
            tile,
          );
          tile.layerIDList = layerIDList;
          this.tileLayerManager.addChilds(layers);
          this.setPickState(layers);
        } else {
          const layers = this.tileLayerManager.getChilds(tile.layerIDList);
          this.tileLayerManager.updateLayersConfig(
            layers,
            'visible',
            tile.isVisible,
          );
          this.setPickState(layers);
        }
      });

    this.parent.renderLayers();

    if (this.tilesetManager.isLoaded) {
      // 将事件抛出，图层上可以使用瓦片
      this.parent.emit('tiles-loaded', this.tilesetManager.currentTiles);
    }
  }
}
