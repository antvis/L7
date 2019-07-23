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
      const vectorLayer = data.layers[sourcelayer];
      if (vectorLayer === undefined) {
        return null;
      }
      const style = sourceStyle[sourcelayer][0];
      style.sourceOption.parser.type = 'vector';
      style.sourceOption.parser.tile = tile;
      const tileSource2 = new Source({
        ...style.sourceOption,
        mapType: style.mapType,
        projected: true,
        data: data.layers[sourcelayer]
      });

      for (let i = 0; i < sourceStyle[sourcelayer].length; i++) {
        const style = sourceStyle[sourcelayer][i];
        const tileMapping = new TileMapping(tileSource2, style);
        const geometryBuffer = getBuffer(style.type, style.shape);
        const buffer = new geometryBuffer({
          layerData: tileMapping.layerData,
          shape: style.shape
        });
        sourceLayerData[style.layerId] = {
          buffer: {
            attributes: buffer.attributes,
            indexArray: buffer.indexArray
          },
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
