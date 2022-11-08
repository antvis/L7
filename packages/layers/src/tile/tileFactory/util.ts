
import PointLayer from '../../point/index';
import LineLayer from '../../line';
import PolygonLayer from '../../polygon';


export function getTileLayer(type: string) {
    if(type === 'PolygonLayer') {
        return PolygonLayer;
    }
    if(type === 'LineLayer') {
        return LineLayer;
    }
    if(type === 'PointLayer') {
        return PointLayer
    }
    return PointLayer

}

export function isNeedMask(type: string) {
   return ['PolygonLayer','LineLayer'].indexOf(type) !== -1
}