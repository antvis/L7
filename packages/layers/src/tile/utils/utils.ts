import type { ILayer } from '@antv/l7-core';
import { DOM } from '@antv/l7-utils';

export const tileVectorParser = ['mvt', 'geojsonvt', 'testTile'];

/**
 * 判断当前图层是否是瓦片图层
 * @param layer
 * @returns
 */
export function isTileGroup(layer: ILayer) {
  const source = layer.getSource();
  return tileVectorParser.includes(source.parser.type);
}