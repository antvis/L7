
import { PointLayer, PolygonLayer, LineLayer, MaskLayer} from '@antv/l7-layers'
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

export function getMaskLayer(type: string){
   switch(type) {
    case 'PolygonLayer':
    case 'LineLayer':
        return MaskLayer;
    case 'PointLayer':
    case 'RasterLayer':
        return undefined;
    default:
        return undefined;
   }
}