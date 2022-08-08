import { storiesOf } from '@storybook/react';
import * as React from 'react';


import Point from './components/point'

storiesOf('自定义模版', module)
        .add('Point', () => <Point/>)