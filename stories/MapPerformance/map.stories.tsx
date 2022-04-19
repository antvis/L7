import { storiesOf } from '@storybook/react';
import * as React from 'react';

import UpdateAttrAndEle from './components/updateAttrAndEle';
import UpdateAttrAndEle_line from './components/updateAttrAndEle_line';
import PointTest from './components/Map';
import BigLine from './components/BigLine';
import DataUpdate from './components/DataUpdate';

storiesOf('地图性能检测', module)
  .add('更新数据 update point attr&ele', () => <UpdateAttrAndEle />)
  .add('更新数据 update line attr&ele', () => <UpdateAttrAndEle_line />)
  .add('点', () => <PointTest />)
  .add('BigLine', () => <BigLine />)
  .add('DataUpdate', () => <DataUpdate />);
