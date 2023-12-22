import * as PointDemos from './point';
import * as GPUDemos from './webgpu';
import * as LineDemos from './line';
import * as PolygonDemos from './polygon'
import * as RasterDemos from './raster'
import * as HeatmapDemos from './heatmap'
import * as TileDemos from './tile'
import * as MaskDemos from './mask'
import * as GalleryDemos from './gallery'
import * as BugFix from './bugfix'

export default [{
    name: 'BugFix',
    demos: BugFix
  },
    {
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
    name: 'Mask',
    demos: MaskDemos
},
{
    name: 'WebGPU',
    demos: GPUDemos,
    snapShot: false,
},{
    name:'Gallery',
    demos:GalleryDemos
}
]

export const MapType = ['Map','GaodeMap','BaiduMap','MapLibre','TencentMap','Mapbox']
export const InitMapOptions = {
    map: 'Map',
    renderer:'device',
    animate:false,
}

