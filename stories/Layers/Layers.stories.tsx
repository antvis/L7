import { storiesOf } from '@storybook/react';
import * as React from 'react';
import PointDemo from './components/Point';
import Point3D from './components/Point3D';
// @ts-ignore
storiesOf('图层', module)
  .add('点图层', () => <PointDemo />)
  .add('3D点', () => <Point3D />);
