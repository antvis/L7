import { storiesOf } from '@storybook/react';
import * as React from 'react';
import AnimatePoint from './components/AnimatePoint';
import ClusterDemo from './components/cluster';
import ClusterDemo2 from './components/cluster2';
import DataUpdate from './components/data_update';
import GridTest from './components/gridtest';
import HexagonLayerDemo from './components/hexagon';
import HighLight from './components/highlight';
import OffsetTest from './components/offsetTest';
import WorldDemo from './components/polygon_line';

// @ts-ignore
storiesOf('图层', module)
  .add('聚合图', () => <ClusterDemo />)
  .add('聚合图标注', () => <ClusterDemo2 />)
  .add('数据更新', () => <DataUpdate />)
  .add('点动画', () => <AnimatePoint />)
  .add('网格热力图', () => <HexagonLayerDemo />)
  .add('网格热力图2', () => <GridTest />)
  .add('网格测试', () => <OffsetTest />)
  .add('图层高亮', () => <HighLight />)
  .add('世界地图', () => <WorldDemo />);
