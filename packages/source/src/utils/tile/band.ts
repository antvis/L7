import { isString } from 'lodash';
import {
  ITileBand,
} from '@antv/l7-utils';

export function getTileBandParams(urlBandParam: string | string[] | ITileBand[]) {
  if(typeof urlBandParam === 'string') {
    return [{
      url: urlBandParam,
      bands: [0]
    }]
  } else if(isString(urlBandParam[0])) {
    return urlBandParam.map(param => {
      return {
        url: param as string,
        bands: [0]
      };
    })
  } else {
    return urlBandParam as ITileBand[];
  }
}