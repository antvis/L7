import { storiesOf } from '@storybook/react';
import * as React from 'react';
import Country from './Layer/Country';


storiesOf('行政区划', module)
  .add('中国地图', () => <Country />);
