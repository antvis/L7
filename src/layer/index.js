import { registerLayer } from './factory';
import PolygonLayer from './polygonLayer';
import PointLayer from './pointLayer';
import LineLayer from './lineLayer';
import ImageLayer from './imageLayer';
import RasterLayer from './rasterLayer';
import HeatmapLayer from './heatmapLayer';
import TileLayer from './tile/tileLayer';
import ImageTileLayer from './tile/imageTileLayer';
import VectorTileLayer from './tile/VectorTileLayer';
import TextLayer from './textLayer';

registerLayer('PolygonLayer', PolygonLayer);
registerLayer('PointLayer', PointLayer);
registerLayer('LineLayer', LineLayer);
registerLayer('ImageLayer', ImageLayer);
registerLayer('RasterLayer', RasterLayer);
registerLayer('HeatmapLayer', HeatmapLayer);
registerLayer('TileLayer', TileLayer);
registerLayer('ImageTileLayer', ImageTileLayer);
registerLayer('VectorTileLayer', VectorTileLayer);
registerLayer('TextLayer', TextLayer);

export { LAYER_MAP, getLayer } from './factory';
export { registerLayer };

