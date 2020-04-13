import { storiesOf } from '@storybook/react';
import * as React from 'react';
import GaodeMap from './components/AMap';
import Mapbox from './components/Mapbox';
import MapboxInstance from './components/MapboxInstance';
import AMapinstance from './components/MapInstance';
import Mixed from './components/Mixed';
import MultiAMap from './components/MultiAMap';
import MultiMapbox from './components/MultiMapbox';
import MultiAMapLayer from './components/multiMaptest';
// @ts-ignore
import notes from './Map.md';
// @ts-ignore
storiesOf('地图底图', module)
  .add('高德地图', () => <GaodeMap />, {
    notes: { markdown: notes },
  })
  .add('高德地图实例', () => <AMapinstance />, {
    notes: { markdown: notes },
  })
  .add('Mapbox', () => <Mapbox />, {
    notes: { markdown: notes },
  })
  .add('Mapbox地图实例', () => <MapboxInstance />, {
    notes: { markdown: notes },
  })
  .add('多个高德地图实例', () => <MultiAMap />, {
    notes: { markdown: notes },
  })
  .add('多个高德图层', () => <MultiAMapLayer />, {
    notes: { markdown: notes },
  })
  .add('多个 Mapbox 实例', () => <MultiMapbox />, {
    notes: { markdown: notes },
  })
  .add('高德地图 & Mapbox 混合', () => <Mixed />, {
    notes: { markdown: notes },
  });
