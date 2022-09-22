import {
    ITileBand,
    getURLFromTemplate,
    TileLoadParams,
  } from '@antv/l7-utils';
import { isString } from 'lodash'

export function getTileUrl(
    url: string | string[] | ITileBand[],
    tileParams: TileLoadParams,
  ) {
    if (Array.isArray(url)) {
      if(isString(url[0])) {
        return (url as string[]).map((src) =>
          getURLFromTemplate(src, tileParams),
        );
      } else {
        return (url as ITileBand[]).map((o) => {
          return {
            url: getURLFromTemplate(o.url, tileParams),
            bands: o.bands || [0],
          };
        });
      }
    } else {
      return getURLFromTemplate(url, tileParams);
    }
  }