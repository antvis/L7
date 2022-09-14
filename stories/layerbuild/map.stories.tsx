import { storiesOf } from '@storybook/react';
import * as React from 'react';

import PointExtrue from './components/PointsExtrude';

import PointEarthFill from './components/PointsEarthFill';
import PointEarthExtrude from './components/PointsEarthExtrude';

import Line from './components/Line';
import LineArc from './components/LineArc';
import LineArc3d from './components/LineArc3d';
import LineLinear from './components/LineLinear';
import LineHalf from './components/LineHalf';
import LineGreatCircle from './components/LineGreatCircle';
import LineWall from './components/LineWall';
import LineEarthArc3D from './components/LineEarthArc3D';

import PolygonExtrude from './components/PolygonExtrude';

import Heatmap3d from './components/Heatmap3d';
import HeatmapGrid from './components/HeatmapGrid';
import HeatmapGrid3d from './components/HeatmapGrid3d';
import HeatmapHexagon from './components/HeatmapHexagon';


import RasterLayer from './components/RasterLayer';

import Plane from './components/Plane';

import Wind from './components/Wind';

import SourceTest from './components/SourceTest';

storiesOf('图层渲染流程改造', module)
  .add('PointExtrue', () => <PointExtrue />)
  .add('PointEarthFill', () => <PointEarthFill />)
  .add('PointEarthExtrude', () => <PointEarthExtrude />)

  .add('Line', () => <Line />)
  .add('LineArc', () => <LineArc />)
  .add('LineArc3d', () => <LineArc3d />)
  .add('LineLinear', () => <LineLinear />)
  .add('LineHalf', () => <LineHalf />)
  .add('LineGreatCircle', () => <LineGreatCircle />)
  .add('LineWall', () => <LineWall />)
  .add('LineEarthArc3D', () => <LineEarthArc3D />)

  .add('PolygonExtrude', () => <PolygonExtrude />)

  .add('Heatmap3d', () => <Heatmap3d />)
  .add('HeatmapGrid', () => <HeatmapGrid />)
  .add('HeatmapGrid3d', () => <HeatmapGrid3d />)
  .add('HeatmapHexagon', () => <HeatmapHexagon />)

  .add('RasterLayer', () => <RasterLayer />)

  .add('Plane', () => <Plane />)

  .add('Wind', () => <Wind />)

  .add('SourceTest', () => <SourceTest />)
