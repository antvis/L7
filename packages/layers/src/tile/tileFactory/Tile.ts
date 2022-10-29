import { ILayer, createLayerContainer, ILngLat, ITile } from '@antv/l7-core';
import { SourceTile } from '@antv/l7-utils';
import { Container } from 'inversify';
import { Feature, Properties } from '@turf/helpers';
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

  public getFeatures(sourceLayer: string | undefined){
    if(!sourceLayer || !this.sourceTile.data?.layers[sourceLayer]) return [];

    const vectorTile = this.sourceTile.data?.layers[sourceLayer];
    const { x, y, z } = this.sourceTile;
    const features: Feature<GeoJSON.Geometry, Properties>[] = [];
    for( let i = 0; i < vectorTile.length; i++ ) {
      const vectorTileFeature = vectorTile.feature(i);
      const feature = vectorTileFeature.toGeoJSON(x, y, z);
      features.push({
        ...feature,
        properties: {
          id: feature.id,
          ...feature.properties,
        },
      })
    }
    return features;
  }

  /**
   * 在一个 Tile 中最多存在一个相同 ID 的 feature
   * @param id 
   * @returns 
   */
  public getFeatureById(id: number) {
    let feature = null;
    this.layers.some(layer => {
      const dataArray = layer.getSource().data.dataArray;
      dataArray.forEach(d => {
        if(d._id === id) {
          feature = d;
          return true;
        }
      })
      return false;
    })
    return feature;
  }

  public destroy() {
    this.layers.forEach((layer) => layer.destroy());
  }
}
