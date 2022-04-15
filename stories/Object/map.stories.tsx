import { storiesOf } from '@storybook/react';
import * as React from 'react';
import Water from './components/water';
import Ocean from './components/ocean';
import Taifong from './components/taifeng'
import Radar from './components/radar';
import CanvasDemo from './components/canvas';
import Plane from './components/plane';
import Sprite from './components/sprite';
import PlaneTerrain from './components/planeTerrain';
import Cursor from './components/cursor';
import Arrow from './components/arrow';

storiesOf('Object', module)
        .add('water', () => <Water />)
        .add('Ocean', () => <Ocean />)
        .add('Taifong', () => <Taifong />)
        .add('Radar', () => <Radar/>)
        .add('CanvasDemo', () => <CanvasDemo/>)
        .add('Plane', () => <Plane/>)
        .add('Sprite', () => <Sprite/>)
        .add('PlaneTerrain', () => <PlaneTerrain/>)
        .add('Cursor', () => <Cursor/>)
        .add('Arrow', () => <Arrow/>)