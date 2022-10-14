/**
 * 瓦片图层的样式
 */

export const Attributes = ['size', 'color', 'shape'];

const common = [
    'opacity',
    'zIndex',
]
const rasterLayer = [
    'mask',
    'rampColors',
    'domain',
    'clampHigh',
    'clampLow',
    'pixelConstant',
    'pixelConstantR',
    'pixelConstantG',
    'pixelConstantB',
    'pixelConstantRGB',
    ...common
]
const pointLayer = [
    'stroke',
    'strokeWidth',
    'strokeOpacity',
    'color',
    'shape',
    'size',
    ...common
]
const lineLayer = [
    'stroke',
    'strokeWidth',
    'strokeOpacity',
    'color',
    'shape',
    'size',
    ...common
]
const polygonLayer = [
    'color',
    'shape',
    ...common
]
export type IStyles = 'PointLayer'| 'LineLayer' | 'PolygonLayer' | 'RasterLayer' | 'MaskLayer' | 'TileDebugLayer';
export const styles = {
    'PointLayer': pointLayer,
    'LineLayer': lineLayer,
    'PolygonLayer': polygonLayer,

    'RasterLayer': rasterLayer,

    'MaskLayer': [],
    'TileDebugLayer': [],
}

