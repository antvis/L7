import * as PointDemos from './point';
import * as GPUDemos from './webgpu';
import * as LineDemos from './line';
import * as PolygonDemos from './polygon'
import * as RasterDemos from './raster'
import * as HeatmapDemps from './heatmap'

export default [{
    name: 'Point',
    demos: PointDemos
},
{
    name: 'Line',
    demos: LineDemos
},
{
    name: 'Polygon',
    demos: PolygonDemos
}, 
{
    name: 'heatmap',
    demos: HeatmapDemps
},
{
    name: 'Raster',
    demos: RasterDemos
},
{
    name: 'WebGPU',
    demos: GPUDemos,
    snapShot: false,
},
]

export const MapType = ['Map', 'GaodeMap', 'BaiduMap', 'MapLibre', 'TencentMap', 'Mapbox']
export const InitMapOptions = {
    map: 'Map',
    device: 'device'
}