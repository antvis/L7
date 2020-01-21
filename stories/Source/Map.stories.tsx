import { storiesOf } from '@storybook/react';
import * as React from 'react';
import MultiLine from './components/multiLine';
import MultiPolygon from './components/multiPolygon';
import UpdatePolygon from './components/updatedata';
// @ts-ignore
import notes from './Map.md';
// @ts-ignore
storiesOf('数据', module)
  .add('multiPolygon', () => <MultiPolygon />, {})
  .add('updatePolygon', () => <UpdatePolygon />, {})
  .add('MultiLine', () => <MultiLine />, {});
