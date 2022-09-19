import { ILayer } from '@antv/l7-core';
import { Tile } from '@antv/l7-utils';
import BaseTileLayer from './tileLayer/baseTileLayer';
import { tileAllLoad } from './utils';

export class TMSTileLayer extends BaseTileLayer {
  public type: string = 'TMS';
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
          this.setPickState(layers);
        } else {
          if (!tile.isVisibleChange) {
            return;
          }
          const layers = this.tileLayerManager.getChilds(tile.layerIDList);
          this.updateTileVisible(tile, layers);
          this.setPickState(layers);
        }
      });

    if (this.tilesetManager.isLoaded) {
      // 将事件抛出，图层上可以使用瓦片
      this.parent.emit('tiles-loaded', this.tilesetManager.currentTiles);
    }
  }

  private emitTileVisibleEvent(tile: Tile, callback: () => void) {
    if (tile.isVisible) {
      callback();
    } else {
      tileAllLoad(tile, () => {
        callback();
      });
    }
  }

  private updateTileVisible(tile: Tile, layers: ILayer[]) {
    this.emitTileVisibleEvent(tile, () => {
      this.tileLayerManager.updateLayersConfig(
        layers,
        'visible',
        tile.isVisible,
      );
      this.layerService.reRender();
    });
  }
}
