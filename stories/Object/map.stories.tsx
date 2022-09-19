import { storiesOf } from '@storybook/react';
import * as React from 'react';

import Plane from './components/plane';
import PlaneTerrain from './components/planeTerrain';
import Cursor from './components/cursor';
import Arrow from './components/arrow';

storiesOf('Object', module)
        .add('Plane', () => <Plane/>)
        .add('PlaneTerrain', () => <PlaneTerrain/>)
        .add('Cursor', () => <Cursor/>)
        .add('Arrow', () => <Arrow/>)