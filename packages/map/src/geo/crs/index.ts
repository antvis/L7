import BaseCRS, { ICRS } from './crs';
import EPSG3857 from './crs.3857';
import Earth from './crs.earth';
import EPSG4326 from './crs.epsg4326';
export type TypeCRS = 'EPSG:3857' | 'EPSG:4326';
export { EPSG3857, EPSG4326, Earth, BaseCRS, ICRS };
