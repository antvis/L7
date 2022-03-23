import { storiesOf } from '@storybook/react';
import * as React from 'react';

import PointGrid from './components/pointGrid';
import Image from './components/image';
import Polygon from './components/polygon';
import Line from './components/line';
import ParkDemo from './components/parkdemo';

storiesOf('平面坐标地图', module)
.add('Point', () => <PointGrid />)
.add('Image', () => <Image />)
.add('Polygon', () => <Polygon/>)
.add('Line', () => <Line/>)
.add('ParkDemo', () => <ParkDemo/>)
