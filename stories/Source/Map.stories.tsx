import { storiesOf } from '@storybook/react';
import * as React from 'react';
import HolePolygon from './components/hole';
import Line from './components/line';
import MultiLine from './components/multiLine';
import MultiPolygon from './components/multiPolygon';
import UpdatePolygon from './components/ReuseSource';
import ReuseSource from './components/ReuseSource';
import UpdateProperty from './components/updateproperty'
// @ts-ignore
import notes from './Map.md';
// @ts-ignore
storiesOf('数据', module)
  .add('multiPolygon', () => <MultiPolygon />, {})
  .add('updatePolygon', () => <UpdatePolygon />, {})
  .add('MultiLine', () => <MultiLine />, {})
  .add('HolePolygon', () => <HolePolygon />, {})
  .add('更新属性', () => <UpdateProperty />, {})
  .add('折线', () => <Line />, {})
  .add('复用 Source', () => <ReuseSource />, {});
