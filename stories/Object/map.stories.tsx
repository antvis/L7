import { storiesOf } from '@storybook/react';
import * as React from 'react';
import Water from './components/water';
import Ocean from './components/ocean';
import Taifong from './components/taifeng'
import Radar from './components/radar';
import CanvasDemo from './components/canvas';
import Plane from './components/plane';

storiesOf('Object', module)
        .add('water', () => <Water />)
        .add('Ocean', () => <Ocean />)
        .add('Taifong', () => <Taifong />)
        .add('Radar', () => <Radar/>)
        .add('CanvasDemo', () => <CanvasDemo/>)
        .add('Plane', () => <Plane/>)