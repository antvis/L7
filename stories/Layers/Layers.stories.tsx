import { storiesOf } from '@storybook/react';
import * as React from 'react';
import Arc2DLineDemo from './components/Arc2DLine';
import ArcLineDemo from './components/Arcline';
import GridHeatMap from './components/heatMapgrid';
import LineLayer from './components/Line';
import PointDemo from './components/Point';
import Point3D from './components/Point3D';
import PointImage from './components/pointImage';
import Polygon3D from './components/polygon3D';
import ImageLayerDemo from './components/rasterImage';

// @ts-ignore
storiesOf('图层', module)
  .add('点图层', () => <PointDemo />)
  .add('3D点', () => <Point3D />)
  .add('图片标注', () => <PointImage />)
  .add('面3d图层', () => <Polygon3D />)
  .add('线图层', () => <LineLayer />)
  .add('3D弧线', () => <ArcLineDemo />)
  .add('2D弧线', () => <Arc2DLineDemo />)
  .add('网格热力图', () => <GridHeatMap />)
  .add('图片', () => <ImageLayerDemo />);
