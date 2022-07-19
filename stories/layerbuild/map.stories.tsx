import { storiesOf } from '@storybook/react';
import * as React from 'react';

import PointFill from './components/Points';
import PointExtrue from './components/PointsExtrude';
import PointText from './components/PointsText';
import PointSimple from './components/PointsSimple';
import PointsNormal from './components/PointsNormal';
import PointsFillImage from './components/PointsFillImage';
import PointImage from './components/PointsImage';
import PointIconFont from './components/PointsIconFont';
import PointRader from './components/PointsRadar';
import PointTile from './components/PointsTile';
import PointEarthFill from './components/PointsEarthFill';
import PointEarthExtrude from './components/PointsEarthExtrude';

storiesOf('图层渲染流程改造', module)
  .add('pointFill', () => <PointFill />)
  .add('PointExtrue', () => <PointExtrue />)
  .add('PointText', () => <PointText />)
  .add('PointSimple', () => <PointSimple />)
  .add('PointsNormal', () => <PointsNormal />)
  .add('PointsFillImage', () => <PointsFillImage />)
  .add('PointImage', () => <PointImage />)
  .add('PointIconFont', () => <PointIconFont />)
  .add('PointRader', () => <PointRader />)
  .add('PointTile', () => <PointTile />)
  .add('PointEarthFill', () => <PointEarthFill />)
  .add('PointEarthExtrude', () => <PointEarthExtrude />)
