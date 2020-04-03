import { storiesOf } from '@storybook/react';
import * as React from 'react';
import Circle from './Components/Circle';
import DrawCircle from './Components/DrawCircle';
import DrawControl from './Components/DrawControl';
import Line from './Components/DrawLine';
import Point from './Components/DrawPoint';
import DrawPolygon from './Components/DrawPolygon';
import DrawRect from './Components/DrawRect';
import Polygon from './Components/Polygon';

storiesOf('绘制', module)
  .add('圆', () => <Circle />, {})
  .add('矩形', () => <DrawRect />, {})
  .add('多边形', () => <Polygon />, {})
  .add('点', () => <Point />, {})
  .add('路径', () => <Line />, {})
  .add('绘制组件', () => <DrawControl />, {})
  .add('绘制圆', () => <DrawCircle />, {})
  .add('绘制面', () => <DrawPolygon />, {});
