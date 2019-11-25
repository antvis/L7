import { storiesOf } from '@storybook/react';
import * as React from 'react';
import Marker from './components/Marker';
import Popup from './components/Popup';
import Scale from './components/Scale';
import Zoom from './components/Zoom';
// @ts-ignore
storiesOf('UI 组件', module)
  .add('Zoom', () => <Zoom />)
  .add('Scale', () => <Scale />)
  .add('Marker', () => <Marker />)
  .add('Popup', () => <Popup />);
