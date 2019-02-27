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
export { default as PolygonLayer } from './polygonLayer';
export { default as PointLayer } from './pointLayer';
export { default as LineLayer } from './lineLayer';
export { default as ImageLayer } from './imageLayer';
export { default as RasterLayer } from './rasterLayer';
export { default as HeatmapLayer } from './heatmapLayer';

