import { storiesOf } from '@storybook/react';
import * as React from 'react';
import Water from './components/water';
import Taifong from './components/taifeng'
import Radar from './components/radar';

storiesOf('Object', module)
        .add('water', () => <Water />)
        .add('Taifong', () => <Taifong />)
        .add('Radar', () => <Radar/>)