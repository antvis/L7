import { storiesOf } from '@storybook/react';
import * as React from 'react';

import PointTest from './components/Map';
import BigLine from './components/BigLine';
import DataUpdate from './components/DataUpdate';
// @ts-ignore
storiesOf('地图性能检测', module)
  .add('点', () => <PointTest />)
  .add('BigLine', () => <BigLine />)
  .add('DataUpdate', () => <DataUpdate />);
