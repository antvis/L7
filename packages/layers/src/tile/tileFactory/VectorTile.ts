import { ILayer, ILayerAttributesOption } from '@antv/l7-core';
import Tile from './Tile';
import { getTileLayer, getMaskLayer } from './util';
import { Feature, Properties } from '@turf/helpers';
 
export default class VectorTile extends Tile {
  public async initTileLayer(): Promise<void> {
    const attributes = this.parent.getLayerAttributeConfig();
    const layerOptions = this.parent.getLayerConfig()
    const vectorLayer = getTileLayer(this.parent.type);
    const maskLayer = getMaskLayer(this.parent.type);
    layerOptions.mask = !!maskLayer;
  
    
    const sourceOptions = this.getSourceOption();
    if(!sourceOptions){
      this.isLoaded = true;
      return
    }
    const layer = new vectorLayer({...layerOptions}).source(
      sourceOptions.data,
      sourceOptions.options,
    );


    // 初始化数据映射
    Object.keys(attributes).forEach((type) => {
      const attr = type as keyof ILayerAttributesOption;
      // @ts-ignore
      layer[attr](attributes[attr]?.field, attributes[attr]?.values);
    });
    if (maskLayer) {
      const mask = new maskLayer({layerType: "MaskLayer"})
        .source({
          type: 'FeatureCollection',
          features: [
            this.sourceTile.bboxPolygon
          ],
        }, {
          parser: {
            type: 'geojson',
            featureId: 'id'
          }
        })
      await this.addMask(layer, mask)
    }
    await this.addLayer(layer);
    this.setLayerMinMaxZoom(layer);
    this.isLoaded = true;
  }
  // Todo 校验数据有效性
  protected beforeInit() {

  }
  protected getSourceOption() {
    const rawSource = this.parent.getSource();
  
    const { sourceLayer = 'defaultLayer', featureId = 'id'} = this.parent.getLayerConfig<{
      featureId: string;
    }>();
    const features = this.getFeatures(sourceLayer)
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
    if(layer.getModelType() === 'text') {
      layer.updateLayerConfig({
        maxZoom: this.z +1,
        minZoom: this.z - 1
      });
    }

  }
  public getFeatures(sourceLayer: string | undefined){
    if(!sourceLayer || !this.sourceTile.data?.layers[sourceLayer]) {
      return [];
    }
    
    const vectorTile = this.sourceTile.data?.layers[sourceLayer];

    if(Array.isArray(vectorTile.features)) {
      // 数据不需要被解析 geojson-vt 类型
      return vectorTile.features;
    }

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
   * 在一个 Tile 中可能存在一个相同 ID 的 feature
   * @param id 
   * @returns 
   */
  public getFeatureById(id: number) {
    const layer = this.getMainLayer();
    if (!layer) {
      return [];
    }
    return layer.getSource().data.dataArray.filter(d => d._id === id);
  }

}
