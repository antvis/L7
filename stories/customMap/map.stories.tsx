import { storiesOf } from '@storybook/react';
import * as React from 'react';

import Map from './components/Map';
import Map2 from './components/Map2';
// @ts-ignore
storiesOf('自定义地图', module).add('地图', () => <Map />)
.add('地图2', () => <Map2 />);
