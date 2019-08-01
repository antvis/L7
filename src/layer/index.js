import { registerLayer } from './factory';
import PolygonLayer from './polygon_layer';
import PointLayer from './point_layer';
import LineLayer from './line_layer';
import ImageLayer from './image_layer';
import RasterLayer from './raster_layer';
import HeatmapLayer from './heatmap_layer';
import TileLayer from './tile/tile_layer';
import ImageTileLayer from './tile/image_tile_layer';
import VectorTileLayer from './tile/vector_tile_layer';

registerLayer('PolygonLayer', PolygonLayer);
registerLayer('PointLayer', PointLayer);
registerLayer('LineLayer', LineLayer);
registerLayer('ImageLayer', ImageLayer);
registerLayer('RasterLayer', RasterLayer);
registerLayer('HeatmapLayer', HeatmapLayer);
registerLayer('TileLayer', TileLayer);
registerLayer('ImageTileLayer', ImageTileLayer);
registerLayer('VectorTileLayer', VectorTileLayer);

export { LAYER_MAP, getLayer } from './factory';
export { registerLayer };

