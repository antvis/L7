import { storiesOf } from '@storybook/react';
import * as React from 'react';

import RasterTile from './components/RasterTile';
import OsmRasterTile from './components/OsmRasterTile';
import VectorTile from './components/VectorTile';
import VectorLineTile from './components/VectorLineTile';
import VectorPolygonTile from './components/VectorPolygonTile';
import VectorTileClickTest from './components/VextorTileClickTest';

storiesOf('瓦片', module)
  .add('RasterTile', () => <RasterTile />)
  .add('VectorPointTile', () => <VectorTile />)
  .add('VectorLineTile', () => <VectorLineTile />)
  .add('VectorPolygonTile', () => <VectorPolygonTile />)
  .add('OsmRasterTile', () => <OsmRasterTile />)
  .add('VectorTileClickTest', () => <VectorTileClickTest />)
