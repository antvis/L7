import { storiesOf } from '@storybook/react';
import * as React from 'react';

import RasterTile from './components/RasterTile';
import RasterTileMask from './components/RasterTileMask';
import OsmRasterTile from './components/OsmRasterTile';
import VectorOffsetPolygonTile from './components/VectorOffsetPolygonTile';
import VectorOffsetLineTile from './components/VectorOffsetLineTile';
import VectorOffssetPointTile from './components/VectorOffssetPointTile';
import VectorPointTile from './components/VectorPointTile';
import VectorPolygonTile from './components/VectorPolygonTile';
import VectorLineTile from './components/VectorLineTile';


storiesOf('瓦片', module)
  .add('RasterTile', () => <RasterTile />)
  .add('RasterTileMask', () => <RasterTileMask />)
  .add('OsmRasterTile', () => <OsmRasterTile />)
  .add('VectorOffsetPolygonTile', () => <VectorOffsetPolygonTile />)
  .add('VectorOffsetLineTile', () => <VectorOffsetLineTile />)
  .add('VectorOffssetPointTile', () => <VectorOffssetPointTile />)
  .add('VectorPointTile', () => <VectorPointTile />)
  .add('VectorPolygonTile', () => <VectorPolygonTile />)
  .add('VectorLineTile', () => <VectorLineTile />)
