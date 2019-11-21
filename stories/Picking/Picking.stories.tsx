import { storiesOf } from '@storybook/react';
import * as React from 'react';
import AdvancedAPI from './components/AdvancedAPI';
import Highlight from './components/Highlight';
import Tooltip from './components/Tooltip';
// @ts-ignore
storiesOf('交互', module)
  .add('拾取 & 高亮', () => <Highlight />)
  .add('拾取 & Tooltip', () => <Tooltip />)
  .add('高级拾取 API', () => <AdvancedAPI />);
