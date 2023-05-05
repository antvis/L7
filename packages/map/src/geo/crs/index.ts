import { ICRS, TypeCRS } from '@antv/l7-core';
import BaseCRS from './crs';
import EPSG3857 from './crs.3857';
import Earth from './crs.earth';
import EPSG4326 from './crs.epsg4326';

export function getCRS(name: TypeCRS): ICRS {
  switch (name) {
    case 'EPSG:3857':
      return new EPSG3857();
    case 'EPSG:4326':
      return new EPSG4326();
    default:
      return new EPSG3857();
  }
}

export { EPSG3857, EPSG4326, Earth, BaseCRS };
