import { storiesOf } from '@storybook/react';
import * as React from 'react';

import RasterTile from './components/RasterTile';
import OsmRasterTile from './components/OsmRasterTile';
import VectorTile from './components/VectorTile';
import VectorTileClickTest from './components/VextorTileClickTest';

storiesOf('瓦片', module)
  .add('RasterTile', () => <RasterTile />)
  .add('VectorTile', () => <VectorTile />)
  .add('OsmRasterTile', () => <OsmRasterTile />)
  .add('VectorTileClickTest', () => <VectorTileClickTest />)
