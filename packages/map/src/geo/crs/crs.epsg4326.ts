import { Transformation, TypeCRS } from '@antv/l7-core';
import LngLatProjection from '../projection/lng_lat';
import Earth from './crs.earth';
export default class EPSG4326 extends Earth {
  public code: TypeCRS = 'EPSG:4326';
  public projection: LngLatProjection = new LngLatProjection();
  public transformation: Transformation = new Transformation(
    1 / 180,
    1,
    -1 / 180,
    0.5,
  );
}
