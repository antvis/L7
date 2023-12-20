import * as PointDemos from './point';
import * as GPUDemos from './webgpu';
import * as LineDemos from './line';
import * as PolygonDemos from './polygon'
import * as RasterDemos from './raster'
import * as HeatmapDemos from './heatmap'
import * as TileDemos from './tile'

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
    name: 'Heatmap',
    demos: HeatmapDemos
},
{
    name: 'Raster',
    demos: RasterDemos
},
{
    name: 'Tile',
    demos: TileDemos
},
{
    name: 'WebGPU',
    demos: GPUDemos,
    snapShot: false,
},
]

export const MapType = ['Map','GaodeMap','BaiduMap','MapLibre','TencentMap','Mapbox']
export const InitMapOptions = {
    map: 'Map',
    device:'device'
}

