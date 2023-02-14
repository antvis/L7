import { IParseDataItem } from '@antv/l7-core';
import * as turf from '@turf/helpers';
import union from '@turf/union';

/**
 * 专门处理 Tile 数据相关
 */
export class TileSourceService {
  public getCombineFeature(features: IParseDataItem[]) {
    let p: any = null;
    const properties = features[0];
    features.map((feature) => {
      const polygon = turf.polygon(feature.coordinates);
      // tslint:disable-next-line: prefer-conditional-expression
      if (p === null) {
        p = polygon;
      } else {
        p = union(p, polygon);
      }
    });

    if (properties) {
      p.properties = { ...properties };
    }
    return p;
  }
}
