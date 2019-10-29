import { storiesOf } from '@storybook/react';
import * as React from 'react';
import Blur from './components/Blur';
import TAA from './components/TAA';
// @ts-ignore
storiesOf('MultiPassRenderer', module)
  .add('Blur', () => <Blur />)
  .add('TAA(Temporal Anti-Aliasing)', () => <TAA />);
