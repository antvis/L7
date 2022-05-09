import { storiesOf } from '@storybook/react';
import * as React from 'react';

import UpdateAttrAndEle from './components/updateAttrAndEle';
import UpdateAttrAndEle_line from './components/updateAttrAndEle_line';
import UpdateAttrAndEle_polygon from './components/updateAttrAndEle_polygon';
import UpdateAttrAndEle_planeGeometry from './components/updateAttrAndEle_planeGeometry';
import UpdateAttrTimeLine from './components/updataPointsTimeLine';
import UpdateAttrShenZhen from './components/updateAttrAndEleShenZhen';
import UpdateHeatMap from './components/updataHeatMap';
import PointTest from './components/Map';
import BigLine from './components/BigLine';
import DataUpdate from './components/DataUpdate';

storiesOf('地图性能检测', module)
  .add('更新数据 update point attr&ele', () => <UpdateAttrAndEle />)
  .add('更新数据 update line attr&ele', () => <UpdateAttrAndEle_line />)
  .add('更新数据 update polygon attr&ele', () => <UpdateAttrAndEle_polygon />)
  .add('更新数据 update plane geometry attr&ele', () => <UpdateAttrAndEle_planeGeometry />)
  .add('更新数据 update updateAttrTimeLine', () => <UpdateAttrTimeLine />)
  .add('更新数据 update UpdateAttrShenZhen', () => <UpdateAttrShenZhen />)
  .add('更新数据 update UpdateHeatMap', () => <UpdateHeatMap />)
  .add('点', () => <PointTest />)
  .add('BigLine', () => <BigLine />)
  .add('DataUpdate', () => <DataUpdate />);
