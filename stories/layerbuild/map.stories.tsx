import { storiesOf } from '@storybook/react';
import * as React from 'react';

import PointEarthFill from './components/PointsEarthFill';
import PointEarthExtrude from './components/PointsEarthExtrude';

import Line from './components/Line';
import LineEarthArc3D from './components/LineEarthArc3D';

import HeatmapGrid from './components/HeatmapGrid';
import HeatmapGrid3d from './components/HeatmapGrid3d';
import HeatmapHexagon from './components/HeatmapHexagon';

import Plane from './components/Plane';

import SourceTest from './components/SourceTest';

storiesOf('图层渲染流程改造', module)
  .add('PointEarthFill', () => <PointEarthFill />)
  .add('PointEarthExtrude', () => <PointEarthExtrude />)

  .add('Line', () => <Line />)

  .add('LineEarthArc3D', () => <LineEarthArc3D />)

  .add('HeatmapGrid', () => <HeatmapGrid />)
  .add('HeatmapGrid3d', () => <HeatmapGrid3d />)
  .add('HeatmapHexagon', () => <HeatmapHexagon />)

  .add('Plane', () => <Plane />)

  .add('SourceTest', () => <SourceTest />)
