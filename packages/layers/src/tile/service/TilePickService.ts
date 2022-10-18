import { ILayerService } from '@antv/l7-core';
import { TileLayerService } from './TileLayerService';
import { ILayer, IInteractionTarget } from '@antv/l7-core';
import Tile from '../tileFactory/Tile';
export interface ITilePickServiceOptions {
  layerService: ILayerService;
  tileLayerService: TileLayerService;
}
export class TilePickService {
  private layerService: ILayerService;
  private tileLayerService: TileLayerService;
  constructor({ layerService, tileLayerService }: ITilePickServiceOptions) {
    this.layerService = layerService;
    this.tileLayerService = tileLayerService;
  }
  pickRender(target: IInteractionTarget) {
    const tile = this.tileLayerService.getVisibleTileBylngLat(target.lngLat);
    if (tile) {
      const pickLayer = tile.getLayers()[0];
      this.layerService.pickRender(pickLayer);
    }
  }
  selectFeature(layer: ILayer, pickedColors: Uint8Array | undefined) {
    // @ts-ignore
    const [r, g, b] = pickedColors;
    layer.hooks.beforeSelect.call([r, g, b]);
    this.tileLayerService.tiles.map((tile: Tile) => {
      const layers = tile.getLayers();
      layers.forEach((layer) => {
        layer.hooks.beforeSelect.call([r, g, b]);
      });
    });
  }
  highlightPickedFeature(layer: ILayer, pickedColors: Uint8Array | undefined) {
    // @ts-ignore
    const [r, g, b] = pickedColors;
    layer.hooks.beforeSelect.call([r, g, b]);
    this.tileLayerService.tiles.map((tile: Tile) => {
      const layers = tile.getLayers();
      layers.forEach((layer) => {
        layer.hooks.beforeHighlight.call([r, g, b]);
      });
    });
  }
}
