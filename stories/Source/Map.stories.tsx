import { storiesOf } from '@storybook/react';
import * as React from 'react';
import MultiPolygon from './components/multiPolygon';
import MultiLine from './components/multiLine';
// @ts-ignore
import notes from './Map.md';
// @ts-ignore
storiesOf('数据', module)
  .add('multiPolygon', () => <MultiPolygon />, {})
  .add('MultiLine', () => <MultiLine />, {});
