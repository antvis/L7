import { storiesOf } from '@storybook/react';
import * as React from 'react';
import AnimatePoint from './components/AnimatePoint';
import Arc2DLineDemo from './components/Arc2DLine';
import ArcLineDemo from './components/Arcline';
import CityBuildingLayerDemo from './components/citybuilding';
import Column from './components/column';
import DashLineDemo from './components/dash';
import DataUpdate from './components/data_update';
import HeatMapDemo from './components/HeatMap';
import LightDemo from './components/light';
import LineLayer from './components/Line';
import PointDemo from './components/Point';
import Point3D from './components/Point3D';
import PointImage from './components/PointImage';
import Polygon3D from './components/Polygon3D';
import ImageLayerDemo from './components/RasterImage';
import RasterLayerDemo from './components/RasterLayer';
import TextLayerDemo from './components/Text';

// @ts-ignore
storiesOf('图层', module)
  .add('点图层', () => <PointDemo />)
  .add('数据更新', () => <DataUpdate />)
  .add('亮度图', () => <LightDemo />)
  .add('点动画', () => <AnimatePoint />)
  .add('3D点', () => <Point3D />)
  .add('文字', () => <TextLayerDemo />)
  .add('Column', () => <Column />)
  .add('图片标注', () => <PointImage />)
  .add('面3d图层', () => <Polygon3D />)
  .add('点亮城市', () => <CityBuildingLayerDemo />)
  .add('线图层', () => <LineLayer />)
  .add('虚线', () => <DashLineDemo />)
  .add('3D弧线', () => <ArcLineDemo />)
  .add('2D弧线', () => <Arc2DLineDemo />)
  .add('热力图', () => <HeatMapDemo />)
  .add('栅格', () => <RasterLayerDemo />)
  .add('图片', () => <ImageLayerDemo />);
