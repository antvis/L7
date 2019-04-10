import { registerLayer } from './factory';
import PolygonLayer from './polygonLayer';
import PointLayer from './pointLayer';
import LineLayer from './lineLayer';
import ImageLayer from './imageLayer';
import RasterLayer from './rasterLayer';
import HeatmapLayer from './heatmapLayer';

registerLayer('PolygonLayer', PolygonLayer);
registerLayer('PointLayer', PointLayer);
registerLayer('LineLayer', LineLayer);
registerLayer('ImageLayer', ImageLayer);
registerLayer('RasterLayer', RasterLayer);
registerLayer('HeatmapLayer', HeatmapLayer);

export { LAYER_MAP } from './factory';
export { registerLayer };

