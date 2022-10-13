import { storiesOf } from '@storybook/react';
import * as React from 'react';
import Amap2demo_destroy from './components/amap2demo_destroy';

import Amap2demo_arcLine from "./components/amap2demo_arcLine"
import Amap2demo_arcLine_greatCircle from "./components/amap2demo_arcLine_greatCircle"
import Amap2demo_arcLine_greatCircleTex from "./components/amap2demo_arcLine_greatCircleTex"
import Amap2demo_arcLineDir from "./components/amap2demo_arcLineDir"
import Amap2demo_arcLineLinear from './components/amap2demo_arcLineLinear';

import Amap2demo_heatmap_hexagon from "./components/amap2demo_heatmap_hexagon"
import Amap2demo_heatmap_hexagon_world from './components/amap2demo_heatmap_hexagon_world';
import Amap2demo_heatmap_grid from "./components/amap2demo_heatmap_grid"

import Amap2demo_drilldown from "./components/amap2demo_drilldown"

import Amap2demo_markerPopup from './components/amap2demo_markerPopup';
import Amap2demo_clustermarker from './components/amap2demo_clustermarker';

import Amap2demo_instance from "./components/amap2demo_instance"

import Amap2demo_drawControl from "./components/amap2demo_drawControl"

import Amap2demo_meshStyleMap from './components/amap2demo_meshStyleMap';

import Amap2demo_styleMap from "./components/amap2demo_styleMap" 

import ShapeUpdate from './components/shapeUpdate'
import AmapPlugin from './components/plugin'
import DestroyClear from './components/destroyClear'
import Cluster from './components/cluster'
import PolygonExteudeTex from './components/polygon_extrudeTex';
import DataImagelayer from './components/dataImagelayer';

// @ts-ignore
storiesOf('地图方法', module)

        .add('高德地图2.0 line_arc', () => <Amap2demo_arcLine />)
        .add('高德地图2.0 line_arc_greatCircle', () => <Amap2demo_arcLine_greatCircle />)
        .add('高德地图2.0 line_arc_greatCircleTex', () => <Amap2demo_arcLine_greatCircleTex />)

        .add('高德地图2.0 line_arcDir', () => <Amap2demo_arcLineDir />)
        .add('高德地图2.0 line_arcLinear', () => <Amap2demo_arcLineLinear />)

        .add('高德地图2.0 heatmap3D/hexagon', () => <Amap2demo_heatmap_hexagon />)
        .add('高德地图2.0 heatmap/hexagon/world', () => <Amap2demo_heatmap_hexagon_world />)
        .add('高德地图2.0 heatmap3D/grid', () => <Amap2demo_heatmap_grid />)

        .add('高德地图2.0 点击下钻', () => <Amap2demo_drilldown />)

        .add('marker popup', () => <Amap2demo_markerPopup/>)
        .add('高德地图2.0 clusterMarker图层', () => <Amap2demo_clustermarker />)

        .add('高德地图2.0 instance实例', () => <Amap2demo_instance />)

        .add('高德地图2.0 drawControl实例', () => <Amap2demo_drawControl />)

        .add('高德地图 mesh 样式数据映射', () => <Amap2demo_meshStyleMap/>)

        .add('高德地图 样式数据映射', () => <Amap2demo_styleMap/>)

        .add('测试销毁', () => <Amap2demo_destroy/>)

        .add('ShapeUpdate', () => <ShapeUpdate/>)

        .add('AmapPlugin', () => <AmapPlugin/>)
        .add('DestroyClear', () => <DestroyClear/>)
        .add('Cluster', () => <Cluster/>)
        .add('PolygonExteudeTex', () => <PolygonExteudeTex/>)
        .add('DataImagelayer', () => <DataImagelayer/>)
        
