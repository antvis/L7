import { storiesOf } from '@storybook/react';
import * as React from 'react';
import MapCenter from './components/mapCenter';
import Amap2demo from './components/amap2demo'
import Amap2demo_destroy from './components/amap2demo_destroy';
import Amap2demo_extrude from './components/amap2demo_extrude'
import Amapdemo_extrude from './components/amapdemo_extrude'
import Amap2demo_text from './components/amap2demo_text'
import Amap2demo_textSelect from './components/amap2demo_textSelect'
import Amap2demo_iconfont from './components/amap2demo_iconfont';
import Amap2demo_image from './components/amap2demo_image'

import Amap2demo_winds from "./components/amap2demo_winds"

import Amap2demo_polygon from './components/amap2demo_polygon'
import Amap2demo_polygon_extrude from './components/amap2demo_polygon_extrude'

import Amap2demo_arcLine from "./components/amap2demo_arcLine"
import Amap2demo_arcLine3d from "./components/amap2demo_arcLine3d"
import Amap2demo_arcLine3dLinear from './components/amap2demo_arcLine3dLinear';
import Amap2demo_arcLine_greatCircle from "./components/amap2demo_arcLine_greatCircle"
import Amap2demo_arcLine_greatCircleTex from "./components/amap2demo_arcLine_greatCircleTex"
import Amap2demo_lineHeight from "./components/amap2demo_lineHeight"
import Amap2demo_lineDash from "./components/amap2demo_lineDash"
import Amap2demo_arcLineDir from "./components/amap2demo_arcLineDir"
import Amap2demo_arcLineTex from './components/amap2demo_arcLineTex';
import Amap2demo_arcLineLinear from './components/amap2demo_arcLineLinear';
import Amap2demo_arcLine3DTex from './components/amap2demo_arcLine3DTex';
import Amap2demo_lineStreet from './components/amap2demo_lineStreet';
import Amap2demo_lineLinear from './components/amap2demo_lineLinear';
import Amap2demo_road from './components/amap2demo_road';
import Amap2demo_road2 from './components/amap2demo_road2';

import Amap2demo_heatmap from "./components/amap2demo_heatmap"
import Amap2demo_heatmap3D from "./components/amap2demo_heatmap3D"
import Amap2demo_heatmap_hexagon from "./components/amap2demo_heatmap_hexagon"
import Amap2demo_heatmap_hexagon_world from './components/amap2demo_heatmap_hexagon_world';
import Amap2demo_heatmap_grid from "./components/amap2demo_heatmap_grid"

import Amap2demo_imageLayer from "./components/amap2demo_imagelayer"

import Amap2demo_rasterLayer from "./components/amap2demo_rasterlayer"

import Amap2demo_citybuilding from "./components/amap2demo_citybuilding"

import Amap2demo_drilldown from "./components/amap2demo_drilldown"

import Amap2demo_markerlayer from "./components/amap2demo_markerlayer"
import Amap2demo_markerPopup from './components/amap2demo_markerPopup';
import Amap2demo_clustermarker from './components/amap2demo_clustermarker';

import Amap2demo_instance from "./components/amap2demo_instance"

import Amap2demo_drawControl from "./components/amap2demo_drawControl"

import Amap2demo_mesh from "./components/amap2demo_mesh"
import Amap2demo_mesh2 from "./components/amap2demo_mesh2"
import Amap2demo_meshStyleMap from './components/amap2demo_meshStyleMap';

import Amap2demo_styleMap from "./components/amap2demo_styleMap" 

import Amap2demo_textOffset from "./components/amap2demo_textOffset"

import ShapeUpdate from './components/shapeUpdate'
import BusLine from './components/busline'
import AmapPlugin from './components/plugin'
import PointUV from './components/pointUV'
import DestroyClear from './components/destroyClear'
import PlaneLine from './components/planeLine'
import Slider from './components/slider'
import WindMap from './components/amap2demo_wind'
import SimplePoint from './components/simplePoint';
import LineWall from './components/linewall'
import GridTile from './components/gridTile'
import GridTile2 from './components/gridTile2'
import Cluster from './components/cluster'
import Hot from './components/hot'
import Hot2 from './components/hot2'
import Mask from './components/mask'
import PolygonExteudeTex from './components/polygon_extrudeTex';
import BugFix from './components/bugfix'

// @ts-ignore
storiesOf('地图方法', module)
        .add('高德地图 point/demo', () => <MapCenter />)
        .add('高德地图2.0 point/demo', () => <Amap2demo />)
        .add('高德地图 point/extrude', () => <Amapdemo_extrude />)
        .add('高德地图2.0 point/extrude', () => <Amap2demo_extrude />)
        .add('高德地图2.0 point/text', () => <Amap2demo_text />)
        .add('高德地图2.0 point/textSelect', () => <Amap2demo_textSelect />)
        .add('高德地图2.0 point/iconfont', () => <Amap2demo_iconfont />)
        .add('高德地图2.0 point/image', () => <Amap2demo_image />)

        .add('高德地图2.0 polygon', () => <Amap2demo_polygon />)
        .add('高德地图2.0 polygon_extrude', () => <Amap2demo_polygon_extrude />)

        .add('高德地图2.0 line_arc', () => <Amap2demo_arcLine />)
        .add('高德地图2.0 line_arc3d_demo', () => <Amap2demo_arcLine3d />)
        .add('高德地图2.0 line_arc3d_linear_demo', () => <Amap2demo_arcLine3dLinear />)
        .add('高德地图2.0 line_arc_greatCircle', () => <Amap2demo_arcLine_greatCircle />)
        .add('高德地图2.0 line_arc_greatCircleTex', () => <Amap2demo_arcLine_greatCircleTex />)
        .add('高德地图2.0 lineHeight', () => <Amap2demo_lineHeight />)
        .add('高德地图2.0 lineDash', () => <Amap2demo_lineDash />)

        .add('高德地图2.0 line_arcDir', () => <Amap2demo_arcLineDir />)
        .add('高德地图2.0 line_arcTex', () => <Amap2demo_arcLineTex />)
        .add('高德地图2.0 line_arcLinear', () => <Amap2demo_arcLineLinear />)
        .add('高德地图2.0 line_arc3DTex', () => <Amap2demo_arcLine3DTex />)

        .add('高德地图2.0 line_winds', () => <Amap2demo_winds />)
        .add('高德地图2.0 line_Street', () => <Amap2demo_lineStreet />)
        .add('高德地图2.0 line_Linear', () => <Amap2demo_lineLinear />)
        .add('高德地图2.0 road', () => <Amap2demo_road />)
        .add('高德地图2.0 road2', () => <Amap2demo_road2 />)

        .add('高德地图2.0 heatmap', () => <Amap2demo_heatmap />)
        .add('高德地图2.0 heatmap3D', () => <Amap2demo_heatmap3D />)
        .add('高德地图2.0 heatmap3D/hexagon', () => <Amap2demo_heatmap_hexagon />)
        .add('高德地图2.0 heatmap/hexagon/world', () => <Amap2demo_heatmap_hexagon_world />)
        .add('高德地图2.0 heatmap3D/grid', () => <Amap2demo_heatmap_grid />)

        .add('高德地图2.0 imageLayer', () => <Amap2demo_imageLayer />)

        .add('高德地图2.0 rasterLayer', () => <Amap2demo_rasterLayer />)
        .add('高德地图2.0 citybuildLayer', () => <Amap2demo_citybuilding />)

        .add('高德地图2.0 点击下钻', () => <Amap2demo_drilldown />)

        .add('高德地图2.0 Marker图层', () => <Amap2demo_markerlayer />)
        .add('marker popup', () => <Amap2demo_markerPopup/>)
        .add('高德地图2.0 clusterMarker图层', () => <Amap2demo_clustermarker />)

        .add('高德地图2.0 instance实例', () => <Amap2demo_instance />)

        .add('高德地图2.0 drawControl实例', () => <Amap2demo_drawControl />)

        .add('高德地图2.0 mesh实例', () => <Amap2demo_mesh />)
        .add('高德地图2.0 mesh实例2', () => <Amap2demo_mesh2 />)
        .add('高德地图 mesh 样式数据映射', () => <Amap2demo_meshStyleMap/>)

        .add('高德地图 样式数据映射', () => <Amap2demo_styleMap/>)
        .add('高德地图 样式映射 文字偏移', () => <Amap2demo_textOffset/>)

        .add('测试销毁', () => <Amap2demo_destroy/>)

        .add('ShapeUpdate', () => <ShapeUpdate/>)

        .add('WindMap', () => <WindMap/>)
        .add('AmapPlugin', () => <AmapPlugin/>)
        .add('PointUV', () => <PointUV/>)
        .add('DestroyClear', () => <DestroyClear/>)
        .add('PlaneLine', () => <PlaneLine/>)
        .add('Slider', () => <Slider/>)
        .add('SimplePoint', () => <SimplePoint/>)
        .add('LineWall', () => <LineWall/>)
        .add('BusLine', () => <BusLine/>)
        .add('GridTile', () => <GridTile/>)
        .add('GridTile2', () => <GridTile2/>)
        .add('Cluster', () => <Cluster/>)
        .add('Hot1', () => <Hot/>)
        .add('Hot2', () => <Hot2/>)
        .add('Mask', () => <Mask/>)
        .add('PolygonExteudeTex', () => <PolygonExteudeTex/>)
        .add('BugFix', () => <BugFix/>)
