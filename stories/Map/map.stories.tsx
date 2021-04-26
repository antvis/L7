import { storiesOf } from '@storybook/react';
import * as React from 'react';
import MapCenter from './components/mapCenter';
import Amap2demo from './components/amap2demo'
import Amap2demo_extrude from './components/amap2demo_extrude'
import Amapdemo_extrude from './components/amapdemo_extrude'
import Amap2demo_text from './components/amap2demo_text'
import Amap2demo_image from './components/amap2demo_image'

import Amap2demo_polygon from './components/amap2demo_polygon'
import Amap2demo_polygon_extrude from './components/amap2demo_polygon_extrude'
import Amap2demo_arcLine from "./components/amap2demo_arcLine"
import Amap2demo_arcLine3d from "./components/amap2demo_arcLine3d"
import Amap2demo_arcLine_greatCircle from "./components/amap2demo_arcLine_greatCircle"

import Amap2demo_heatmap from "./components/amap2demo_heatmap"
import Amap2demo_heatmap3D from "./components/amap2demo_heatmap3D"
import Amap2demo_heatmap_hexagon from "./components/amap2demo_heatmap_hexagon"
import Amap2demo_heatmap_grid from "./components/amap2demo_heatmap_grid"

import Amap2demo_imageLayer from "./components/amap2demo_imagelayer"

import Amap2demo_rasterLayer from "./components/amap2demo_rasterlayer"

import Amap2demo_citybuilding from "./components/amap2demo_citybuilding"

// @ts-ignore
storiesOf('地图方法', module)
        .add('高德地图 point/demo', () => <MapCenter />)
        .add('高德地图2.0 point/demo', () => <Amap2demo />)
        .add('高德地图 point/extrude', () => <Amapdemo_extrude />)
        .add('高德地图2.0 point/extrude', () => <Amap2demo_extrude />)
        .add('高德地图2.0 point/text', () => <Amap2demo_text />)
        .add('高德地图2.0 point/image', () => <Amap2demo_image />)
        .add('高德地图2.0 polygon', () => <Amap2demo_polygon />)
        .add('高德地图2.0 polygon_extrude', () => <Amap2demo_polygon_extrude />)
        .add('高德地图2.0 line_arc', () => <Amap2demo_arcLine />)
        .add('高德地图2.0 line_arc3d', () => <Amap2demo_arcLine3d />)
        .add('高德地图2.0 line_arc3d_greatCircle', () => <Amap2demo_arcLine_greatCircle />)
        .add('高德地图2.0 heatmap', () => <Amap2demo_heatmap />)
        .add('高德地图2.0 heatmap3D', () => <Amap2demo_heatmap3D />)
        .add('高德地图2.0 heatmap3D/hexagon', () => <Amap2demo_heatmap_hexagon />)
        .add('高德地图2.0 heatmap3D/grid', () => <Amap2demo_heatmap_grid />)
        .add('高德地图2.0 imageLayer', () => <Amap2demo_imageLayer />)
        .add('高德地图2.0 rasterLayer', () => <Amap2demo_rasterLayer />)
        .add('高德地图2.0 citybuildLayer', () => <Amap2demo_citybuilding />)
