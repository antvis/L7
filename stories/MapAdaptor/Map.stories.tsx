import { storiesOf } from '@storybook/react';
import * as React from 'react';
import AMap from './components/AMap';
import Mapbox from './components/Mapbox';
import Mixed from './components/Mixed';
import MultiAMap from './components/MultiAMap';
import MultiMapbox from './components/MultiMapbox';
// @ts-ignore
import notes from './Map.md';
// @ts-ignore
storiesOf('地图底图', module)
  .add('高德地图', () => <AMap />, {
    notes: { markdown: notes },
  })
  .add('Mapbox', () => <Mapbox />, {
    notes: { markdown: notes },
  })
  .add('多个高德地图实例', () => <MultiAMap />, {
    notes: { markdown: notes },
  })
  .add('多个 Mapbox 实例', () => <MultiMapbox />, {
    notes: { markdown: notes },
  })
  .add('高德地图 & Mapbox 混合', () => <Mixed />, {
    notes: { markdown: notes },
  });
