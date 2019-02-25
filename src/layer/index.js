import { registerLayer } from './factory';
import PolygonLayer from './polygonLayer';
import PointLayer from './pointLayer';
import LineLayer from './lineLayer';
import ImageLayer from './imageLayer';
import RasterLayer from './rasterLayer';
import HeatMapLayer from './heatmap';

registerLayer('PolygonLayer', PolygonLayer);
registerLayer('PointLayer', PointLayer);
registerLayer('LineLayer', LineLayer);
registerLayer('ImageLayer', ImageLayer);
registerLayer('RasterLayer', RasterLayer);
registerLayer('HeatMapLayer', HeatMapLayer);

export { LAYER_MAP } from './factory';

