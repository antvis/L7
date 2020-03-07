import { storiesOf } from '@storybook/react';
import * as React from 'react';
import GaodeMapScene from './components/Scene';
import WorldMap from './components/world';

// @ts-ignore
storiesOf('React', module).add('高德地图', () => <GaodeMapScene />);
storiesOf('React', module).add('世界地图', () => <WorldMap />);
