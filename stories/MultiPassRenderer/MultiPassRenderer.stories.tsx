import { storiesOf } from '@storybook/react';
import * as React from 'react';
import Bloom from './components/Bloom';
import BloomClick from './components/BloomClick';
import Blur from './components/Blur';
import ColorHalftone from './components/ColorHalftone';
import CustomPostProcessing from './components/CustomPostProcessing';
import HexagonalPixelate from './components/HexagonalPixelate';
import Ink from './components/Ink';
import Noise from './components/Noise';
import Sepia from './components/Sepia';
import TAA from './components/TAA';
// @ts-ignore
storiesOf('MultiPassRenderer', module)
  .add('ColorHalftone', () => <ColorHalftone />)
  .add('HexagonalPixelate', () => <HexagonalPixelate />)
  .add('Ink', () => <Ink />)
  .add('Bloom', () => <Bloom />)
  .add('BloomClick', () => <BloomClick/>)
  .add('Blur', () => <Blur />)
  .add('Noise', () => <Noise />)
  .add('Sepia', () => <Sepia />)
  .add('TAA(Temporal Anti-Aliasing)', () => <TAA />)
  .add('自定义后处理效果', () => <CustomPostProcessing />);
