import { storiesOf } from '@storybook/react';
import * as React from 'react';

import RasterTile from './components/RasterTile';
import OsmRasterTile from './components/OsmRasterTile';

storiesOf('瓦片', module)
  .add('RasterTile', () => <RasterTile />)
  .add('OsmRasterTile', () => <OsmRasterTile />)
