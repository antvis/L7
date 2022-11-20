import { ILayer, createLayerContainer, ILngLat, ITile } from '@antv/l7-core';
import { SourceTile } from '@antv/l7-utils';
import { Container } from 'inversify';
import { isNeedMask } from './util';

export default abstract class Tile implements ITile{
  public x: number;
  public y: number;
  public z: number;
  public key: string;
  protected parent: ILayer;
  public sourceTile: SourceTile;
  public visible: boolean = true;
  protected layers: ILayer[] = [];
  public isLoaded: boolean = false;
  constructor(sourceTile: SourceTile, parent: ILayer) {
    this.parent = parent;
    this.sourceTile = sourceTile;
    this.x = sourceTile.x;
    this.y = sourceTile.y;
    this.z = sourceTile.z;
    this.key = `${this.x}_${this.y}_${this.z}`;
  }
  public getLayers() {
    return this.layers;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public styleUpdate(...arg: any) {}

  public abstract initTileLayer(): Promise<void>;

  public lnglatInBounds(lnglat: ILngLat): boolean {
    const [minLng, minLat, maxLng, maxLat] = this.sourceTile.bounds;
    const { lng, lat } = lnglat;
    return lng >= minLng && lng <= maxLng && lat >= minLat && lat <= maxLat;
  }

  protected getLayerOptions() {
    const options = this.parent.getLayerConfig();
    return {
      ...options,
      autoFit:false,
      mask:isNeedMask(this.parent.type) || options.mask
    }
  }


  protected async addMask(layer: ILayer, mask: ILayer) {
    const container = createLayerContainer(
      this.parent.sceneContainer as Container,
    );
    mask.setContainer(container, this.parent.sceneContainer as Container);
    await mask.init();
    layer.addMaskLayer(mask);
  }

  protected async addLayer(layer: ILayer) {
    // set flag
    layer.isTileLayer = true;
    const container = createLayerContainer(
      this.parent.sceneContainer as Container,
    );
    layer.setContainer(container, this.parent.sceneContainer as Container);
    this.layers.push(layer);
    await layer.init();
  }

  public updateVisible(value: boolean) {
    this.visible = value;
    this.updateOptions('visible', value);
  }

  public updateOptions(key: string, value: any) {
    this.layers.forEach((l) => {
      l.updateLayerConfig({
        [key]: value,
      });
    });
  }

  /**
   * 一个 Tile 可能有多个 layer，但是在发生拾取、点击事件的时候只有一个生效
   */
  public getMainLayer(): ILayer | undefined {
    return this.layers[0];
  }

  public  getFeatures(sourceLayer: string | undefined):any[] {
    return []
  }
    
  /**
   * 在一个 Tile 中可能存在一个相同 ID 的 feature
   * @param id 
   * @returns 
   */
  public  getFeatureById(id: number):any[] {
    return []
  }

  public destroy() {
    this.layers.forEach((layer) => layer.destroy());
  }
}
