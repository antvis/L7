import {
  IInteractionTarget,
  ILayer,
  ILayerPickService,
  IMapService,
  IPickingService,
  TYPES,
} from '@antv/l7-core';
import { lngLatInExtent } from '@antv/l7-utils';
export default class BaseLayerPickService implements ILayerPickService {
  private layer: ILayer;
  constructor(layer: ILayer) {
    this.layer = layer;
  }
  public pickRender(target: IInteractionTarget): void {
    

  }

  public pick(layer: ILayer, target: IInteractionTarget) {
    const container = this.layer.getContainer();
    const pickingService = container.get<IPickingService>(
      TYPES.IPickingService,
    );
    if (layer.type === 'RasterLayer') {
      return this.pickRasterLayer(layer, target);
    }

    this.pickRender(target);

    return pickingService.pickFromPickingFBO(layer, target);
  }

  public pickRasterLayer(
    layer: ILayer,
    target: IInteractionTarget,
    parent?: ILayer,
  ) {
    return false;
  }

  public readRasterValue(
    layer: ILayer,
    bbox: number[],
    mapService: IMapService,
    x: number,
    y: number,
  ) {
    return [];
  }

  public selectFeature(pickedColors: Uint8Array | undefined): void {
    const layer = this.layer;
    // @ts-ignore
    const [r, g, b] = pickedColors;
    layer.hooks.beforeSelect.call([r, g, b]);
  }
  public highlightPickedFeature(pickedColors: Uint8Array | undefined): void {
    // @ts-ignore
    const [r, g, b] = pickedColors;
    this.layer.hooks.beforeHighlight.call([r, g, b]);
  }
  public getFeatureById(pickedFeatureIdx: number): any {
    return this.layer.getSource().getFeatureById(pickedFeatureIdx);
  }
}
