import { storiesOf } from '@storybook/react';
import * as React from 'react';
import AMap from './components/AMap';
import Mapbox from './components/Mapbox';
import Polygon from './components/Polygon';
// @ts-ignore
import notes from './Map.md';

storiesOf('地图底图测试', module)
  .add('高德地图', () => <AMap />, {
    notes: { markdown: notes },
  })
  .add('Mapbox', () => <Mapbox />, {
    notes: { markdown: notes },
  })
  .add('Polygon', () => <Polygon />);
