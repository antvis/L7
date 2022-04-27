import { storiesOf } from '@storybook/react';
import * as React from 'react';

import ImageTile from './components/ImageTile';
import RasterTile from './components/RasterTile';

storiesOf('瓦片', module)
  .add('ImageTile', () => <ImageTile />)
  .add('RasterTile', () => <RasterTile />);
