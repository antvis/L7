
import { PointLayer,PolygonLayer,LineLayer} from '@antv/l7-layers'
export function getVectorLayer(type:string) {
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