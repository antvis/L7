import { storiesOf } from '@storybook/react';
import * as React from 'react';

import Line from './components/line'
import Point from './components/point'
import Image from './components/image'

// @ts-ignore
storiesOf('Mask 方法', module)
        .add('Point', () => <Point/>)
        .add('Line', () => <Line/>)
        .add('Image', () => <Image/>)
