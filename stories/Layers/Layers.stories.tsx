import { storiesOf } from '@storybook/react';
import * as React from 'react';
import AnimatePoint from './components/AnimatePoint';
import Arc2DLineDemo from './components/Arc2DLine';
import ArcLineDemo from './components/Arcline';
import ClusterDemo from './components/cluster';
import ClusterDemo2 from './components/cluster2';
import Column from './components/column';
import DashLineDemo from './components/dash';
import DataUpdate from './components/data_update';
import GridTest from './components/gridtest';
import HeatMap3D_2 from './components/heatmap2';
import HeatMapDemo3D from './components/heatmap3d';
import HexagonLayerDemo from './components/hexagon';
import HighLight from './components/highlight';
import LineAnimate from './components/lineAnimate';
import OffsetTest from './components/offsetTest';
import PointDemo from './components/Point';
import Point3D from './components/Point3D';
import PointImage from './components/PointImage';
import PolygonDemo from './components/polygon';
import Polygon3D from './components/Polygon3D';
import WorldDemo from './components/polygon_line';
import RasterLayerDemo from './components/RasterLayer';
import TextLayerDemo from './components/Text';

// @ts-ignore
storiesOf('图层', module)
  .add('点图层', () => <PointDemo />)
  .add('聚合图', () => <ClusterDemo />)
  .add('聚合图标注', () => <ClusterDemo2 />)
  .add('数据更新', () => <DataUpdate />)
  .add('点动画', () => <AnimatePoint />)
  .add('3D点', () => <Point3D />)
  .add('文字', () => <TextLayerDemo />)
  .add('Column', () => <Column />)
  .add('图片标注', () => <PointImage />)
  .add('面3d图层', () => <Polygon3D />)
  .add('面图层', () => <PolygonDemo />)
  .add('线图层2', () => <LineAnimate />)
  .add('虚线', () => <DashLineDemo />)
  .add('3D弧线', () => <ArcLineDemo />)
  .add('2D弧线', () => <Arc2DLineDemo />)
  .add('热力图3D', () => <HeatMapDemo3D />)
  .add('热力图2', () => <HeatMap3D_2 />)
  .add('网格热力图', () => <HexagonLayerDemo />)
  .add('网格热力图2', () => <GridTest />)
  .add('栅格', () => <RasterLayerDemo />)
  .add('网格测试', () => <OffsetTest />)
  .add('图层高亮', () => <HighLight />)
  .add('世界地图', () => <WorldDemo />);
