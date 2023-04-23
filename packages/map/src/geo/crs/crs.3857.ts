import SphericalMercator from '../projection/sphericalMercator';
import Transformation from '../transformation';
import { ICRS } from './crs';
import Earth from './crs.earth';
export default class EPSG3857 extends Earth implements ICRS {
  public code: string = 'EPSG:3857';
  public projection: SphericalMercator = new SphericalMercator();
  public transformation: Transformation = (() => {
    const scale = 0.5 / (Math.PI * SphericalMercator.R);
    return new Transformation(scale, 0.5, -scale, 0.5);
  })();
}
