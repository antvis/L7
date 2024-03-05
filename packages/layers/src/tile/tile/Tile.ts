import type { ILayer, ILngLat, ITile } from '@antv/l7-core';
import { createLayerContainer } from '@antv/l7-core';
import type { SourceTile } from '@antv/l7-utils';
import { EventEmitter } from 'eventemitter3';
import PolygonLayer from '../../polygon';
import type BaseTileLayer from '../core/BaseLayer';
import { isNeedMask } from './util';

export type TileEventType = 'loaded';

export default abstract class Tile extends EventEmitter implements ITile {
  public x: number;
  public y: number;
  public z: number;
  public key: string;
  protected parent: ILayer;
  public sourceTile: SourceTile;
  public visible: boolean = true;
  protected layers: ILayer[] = [];
  public isLoaded: boolean = false;
  protected tileMaskLayers: ILayer[] = [];
  protected tileMask: ILayer | undefined;
  constructor(sourceTile: SourceTile, parent: ILayer) {
    super();
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
  public styleUpdate(...arg: any) {
    return;
  }

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
      textAllowOverlap: true, // 文本允许重叠
      autoFit: false,
      maskLayers: this.getMaskLayer(),
      tileMask: isNeedMask(this.parent.type),
      mask:
        options.mask ||
        (options.maskLayers?.length !== 0 && options.enableMask),
    };
  }
  // 获取Mask 图层
  protected getMaskLayer(): ILayer[] {
    const { maskLayers } = this.parent.getLayerConfig();
    const layers: ILayer[] = [];
    maskLayers?.forEach((layer: ILayer) => {
      if (!layer.tileLayer) {
        // 非瓦片图层返回图层本身，瓦片图层返回对应的行列号图层
        layers.push(layer);
        return layer;
      }
      const tileLayer = layer.tileLayer as BaseTileLayer;
      const tile = tileLayer.getTile(this.sourceTile.key);
      const l = tile?.getLayers()[0] as ILayer;
      if (l) {
        layers.push(l);
      }
    });
    return layers;
  }

  protected async addTileMask() {
    const mask = new PolygonLayer({
      name: 'mask',
      visible: true,
      enablePicking: false,
    })
      .source(
        {
          type: 'FeatureCollection',
          features: [this.sourceTile.bboxPolygon],
        },
        {
          parser: {
            type: 'geojson',
            featureId: 'id',
          },
        },
      )
      .shape('fill')
      .color('#0f0')
      .style({
        opacity: 0.5,
      });
    const container = createLayerContainer(this.parent.container!);
    mask.setContainer(container);
    await mask.init();
    this.tileMask = mask;
    const mainLayer = this.getMainLayer();
    if (mainLayer !== undefined) {
      mainLayer.tileMask = mask;
    }
    return mask;
  }
  // 全局 Mask
  protected async addMask(layer: ILayer, mask: ILayer) {
    const container = createLayerContainer(this.parent.container!);
    mask.setContainer(container);
    await mask.init();
    layer.addMask(mask);
    this.tileMaskLayers.push(mask);
  }

  protected async addLayer(layer: ILayer) {
    // set flag
    layer.isTileLayer = true;
    const container = createLayerContainer(this.parent.container!);
    layer.setContainer(container);
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
 // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public getFeatures(sourceLayer: string | undefined): any[] {
    return [];
  }

  /**
   * 在一个 Tile 中可能存在一个相同 ID 的 feature
   * @param id
   * @returns
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public getFeatureById(id: number): any[] {
    return [];
  }

  public destroy() {
    this.tileMask?.destroy();
    this.layers.forEach((layer) => layer.destroy());
  }
}
