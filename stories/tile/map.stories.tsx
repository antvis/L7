import { storiesOf } from '@storybook/react';
import * as React from 'react';

import RasterTile from './components/RasterTile';
import RasterTiff from './components/RasterTiff';
import OsmRasterTile from './components/OsmRasterTile';
import TiffRasterTile from './components/TiffRasterTile';
import VectorOffsetPolygonTile from './components/VectorOffsetPolygonTile';
import VectorOffsetLineTile from './components/VectorOffsetLineTile';
import VectorOffssetPointTile from './components/VectorOffssetPointTile';
import VectorPointTile from './components/VectorPointTile';
import VectorPointTextTile from './components/VectorPointTextTile';
import VectorPolygonTile from './components/VectorPolygonTile';
import VectorLineTile from './components/VectorLineTile';

import VectorProvince from './components/VectorProvince';


storiesOf('瓦片', module)
  .add('RasterTile', () => <RasterTile />)
  .add('RasterTiff', () => <RasterTiff />)
  .add('OsmRasterTile', () => <OsmRasterTile />)
  .add('TiffRasterTile', () => <TiffRasterTile />)
  .add('VectorOffsetPolygonTile', () => <VectorOffsetPolygonTile />)
  .add('VectorOffsetLineTile', () => <VectorOffsetLineTile />)
  .add('VectorOffssetPointTile', () => <VectorOffssetPointTile />)
  .add('VectorPointTile', () => <VectorPointTile />)
  .add('VectorPointTextTile', () => <VectorPointTextTile />)
  .add('VectorPolygonTile', () => <VectorPolygonTile />)
  .add('VectorLineTile', () => <VectorLineTile />)

  .add('VectorProvince', () => <VectorProvince />)
