import { ICRS, Transformation, TypeCRS } from '@antv/l7-core';
import SphericalMercator from '../projection/sphericalMercator';

import Earth from './crs.earth';
export default class EPSG3857 extends Earth implements ICRS {
  public code: TypeCRS = 'EPSG:3857';
  public projection: SphericalMercator = new SphericalMercator();
  public transformation: Transformation = (() => {
    const scale = 0.5 / (Math.PI * SphericalMercator.R);
    return new Transformation(scale, 0.5, -scale, 0.5);
  })();
}
