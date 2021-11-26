import { storiesOf } from '@storybook/react';
import * as React from 'react';
import GaodeMapScene from './components/Scene';
import WorldMap from './components/world';
import WorldLayer from './components/worldLayer';
import WorldExtrueMap from './components/world_ncov';
import WorldBubbleMap from './components/world_ncov_bubble';
import WorldBubbleAnimateMap from './components/world_ncov_bubble_animate';
import WorldColumnMap from './components/world_ncov_column';
import WorldFillMap from './components/world_ncov_fill';

// @ts-ignore
storiesOf('React', module).add('高德地图', () => <GaodeMapScene />);
storiesOf('React', module).add('世界地图', () => <WorldMap />);
storiesOf('React', module).add('WorldLayer', () => <WorldLayer />);
storiesOf('React', module).add('疫情地图-填充图', () => <WorldFillMap />);
storiesOf('React', module).add('疫情地图-气泡图', () => <WorldBubbleMap />);
storiesOf('React', module).add('疫情地图-3D柱图', () => <WorldColumnMap />);
storiesOf('React', module).add('疫情地图- 3D填充', () => <WorldExtrueMap />);
storiesOf('React', module).add('疫情地图- 气泡动画', () => (
  <WorldBubbleAnimateMap />
));
