import { storiesOf } from '@storybook/react';
import * as React from 'react';
import PointScale from './components/Point';
storiesOf('数据映射', module)
  .add('枚举类型', () => <PointScale />)