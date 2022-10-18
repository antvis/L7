
import { PointLayer, PolygonLayer, LineLayer, RasterLayer} from '@antv/l7-layers'
export function getTileLayer(type:string) {
    if(type === 'PolygonLayer') {
        return PolygonLayer;
    }
    if(type === 'LineLayer') {
        return LineLayer;
    }
    if(type === 'PointLayer') {
        return PointLayer
    }
    if(type === 'RasterLayer') {
        return RasterLayer;
    }
    return PointLayer

}