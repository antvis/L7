import TileMapping from '../core/controller/tile_mapping';
import { getBuffer } from '../geom/buffer/index';
import Source from '../core/source';

export default class WorkerTile {
  constructor(params) {
    this.tileID = params.id;
    this.source = params.sourceID;
    this.params = params;
  }
  parse(data, layerstyle, actor, callback) {
    this.status = 'parsing';
    this.data = data;
    const sourceStyle = this._layerStyleGroupBySourceID(layerstyle)[this.source];
    const tile = this.tileID.split('_');
    const sourceLayerData = {};
    // 数据源解析
    for (const sourcelayer in sourceStyle) { // sourceLayer
      const features = [];
      const vectorLayer = data.layers[sourcelayer];
      if (vectorLayer === undefined) {
        return null;
      }
      for (let i = 0; i < vectorLayer.length; i++) {
        const feature = vectorLayer.feature(i);
        const geofeature = feature.toGeoJSON(tile[0], tile[1], tile[2]);
        features.push(geofeature);
      }
      const geodata = {
        type: 'FeatureCollection',
        features
      };
      for (let i = 0; i < sourceStyle[sourcelayer].length; i++) {
        const style = sourceStyle[sourcelayer][i];
        style.sourceOption.parser.type = 'geojson';
        const tileSource = new Source({
          ...style.sourceOption,
          mapType: style.mapType,
          data: geodata
        });
        const tileMapping = new TileMapping(tileSource, style);
        const geometryBuffer = getBuffer(style.type, style.shape);
        const buffer = new geometryBuffer({
          layerData: tileMapping.layerData,
          shape: style.shape
        });
        sourceLayerData[style.layerId] = {
          attributes: buffer.attributes,
          // layerData: tileMapping.layerData,
          // sourceData: tileSource.data,
          layerId: style.layerId,
          sourcelayer,
          tileId: this.tileID
        };
      }
    }
    this.status = 'done';
    callback(null, { ...sourceLayerData });
  }
  _layerStyleGroupBySourceID(layerStyles) {
    const sourceStyles = {};
    // 支持VectorLayer
    for (const layerId in layerStyles) {
      const sourceID = layerStyles[layerId].sourceOption.id;
      const sourcelayer = layerStyles[layerId].sourceOption.parser.sourceLayer;
      if (!sourceStyles[sourceID]) sourceStyles[sourceID] = {};
      if (!sourceStyles[sourceID][sourcelayer]) sourceStyles[sourceID][sourcelayer] = [];
      sourceStyles[sourceID][sourcelayer].push(layerStyles[layerId]);
    }
    return sourceStyles;
  }
}
