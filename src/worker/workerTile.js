import TileMapping from '../core/controller/tile_mapping';
import { getBuffer } from '../geom/buffer/index';
import Source from '../core/source';
import Global from '../global';
const { pointShape } = Global;

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
      const tileSource = new Source({
        ...style.sourceOption,
        mapType: style.mapType,
        projected: true,
        data: data.layers[sourcelayer]
      });
      for (let i = 0; i < sourceStyle[sourcelayer].length; i++) {
        const style = sourceStyle[sourcelayer][i];
        const tileMapping = new TileMapping(tileSource, style);
        if (style.type === 'point') {
          style.shape = this._getPointShape(tileMapping);
        }
        const geometryBuffer = getBuffer(style.type, style.shape);
        const buffer = new geometryBuffer({
          layerData: tileMapping.layerData,
          shape: style.shape,
          style
        });
        sourceLayerData[style.layerId] = {
          buffer: {
            attributes: buffer.attributes,
            indexArray: buffer.indexArray
          },
          // layerData: tileMapping.layerData,
          // sourceData: tileSource.data,
          shape: style.shape,
          layerId: style.layerId,
          sourcelayer,
          tileId: this.tileID,
          featureKey: tileSource.data.featureKeys.slice(0)
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
  _getPointShape(tileMapping) {
    let shape = null;
    if (!tileMapping.layerData[0].hasOwnProperty('shape')) {
      return 'normal';
    }
    for (let i = 0; i < tileMapping.layerData.length; i++) {
      shape = tileMapping.layerData[i].shape;
      if (shape !== undefined) {
        break;
      }
    }

    // 2D circle 特殊处理
    if (pointShape['2d'].indexOf(shape) !== -1) {
      return 'fill';
    } else if (pointShape['3d'].indexOf(shape) !== -1) {
      return 'extrude';
    }
    // TODO 图片支持
    //  else if (this.scene.image.imagesIds.indexOf(shape) !== -1) {
    //   return 'image';
    // }
    return 'text';
  }
}
