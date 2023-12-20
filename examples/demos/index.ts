import * as PointDemos from './point';
import * as GPUDemos from './webgpu';
import * as RasterDemos from './raster'

export default [{
    name: 'Point',
    demos: PointDemos
}, {
    name: 'WebGPU',
    demos: GPUDemos
},{
    name: 'Raster',
    demos: RasterDemos
}
]

export const MapType = ['Map','GaodeMap','BaiduMap','MapLibre','TencentMap','Mapbox']
export const InitMapOptions = {
    map: 'Map',
    device:'device'
}

