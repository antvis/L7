import { ILayer, ILayerAttributesOption } from '@antv/l7-core';
import { VectorSource } from '@antv/l7-source';
import Tile from './Tile';
import { getTileLayer } from './util';

export default class VectorTile extends Tile {
  public async initTileLayer(): Promise<void> {
    const attributes = this.parent.getLayerAttributeConfig();
    const layerOptions = this.getLayerOptions();
    const vectorLayer = getTileLayer(this.parent.type);

    const sourceOptions = this.getSourceOption();
    if (!sourceOptions) {
      this.isLoaded = true;
      return;
    }
    const layer = new vectorLayer({ ...layerOptions }).source(
      sourceOptions.data,
      sourceOptions.options,
    );

    // 初始化数据映射
    Object.keys(attributes).forEach((type) => {
      const attr = type as keyof ILayerAttributesOption;
      // @ts-ignore
      layer[attr](attributes[attr]?.field, attributes[attr]?.values);
    });

    await this.addLayer(layer);
    if (layerOptions.tileMask) {
      // 瓦片数据裁剪
      await this.addTileMask();
    }
    this.setLayerMinMaxZoom(layer);
    this.isLoaded = true;
  }

  protected getSourceOption() {
    const rawSource = this.parent.getSource();

    const { sourceLayer = 'defaultLayer', featureId = 'id' } =
      this.parent.getLayerConfig<{
        featureId: string;
      }>();
    const features = this.getFeatures(sourceLayer);
    return {
      data: {
        type: 'FeatureCollection',
        features,
      },
      options: {
        parser: {
          type: 'geojson',
          featureId,
        },
        transforms: rawSource.transforms,
      },
    };
  }

  protected setLayerMinMaxZoom(layer: ILayer) {
    // 文本图层设置，可见范围
    if (layer.getModelType() === 'text') {
      layer.updateLayerConfig({
        maxZoom: this.z + 1,
        minZoom: this.z - 1,
      });
    }
  }
  // 获取瓦片数据

  public getFeatures(sourceLayer: string) {
    const source = this.sourceTile.data as VectorSource;
    return source.getTileData(sourceLayer);
  }

  /**
   * 在一个 Tile 中可能存在一个相同 ID 的 feature
   * @param id
   * @returns
   */
  public getFeatureById(id: number) {
    const layer = this.getMainLayer();
    if (!layer) {
      return [];
    }
    const res = layer.getSource().data.dataArray.filter((d) => d._id === id);
    return res;
  }
}
