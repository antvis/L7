import { storiesOf } from '@storybook/react';
import * as React from 'react';

import RasterTile from './components/RasterTile';
import OsmRasterTile from './components/OsmRasterTile';

import RasterArrayBuffer from './components/RasterArrayBuffer';
import DemFilter from './components/demFilter';
import RasterArrayBuffer2 from './components/RasterArrayBuffer2';
import RasterArrayBufferMask from './components/RasterArrayBufferMask';
import America from './components/america';
import Lerc from './components/lerc';

import TiffRasterTile from './components/TiffRasterTile';
import VectorOffsetPolygonTile from './components/VectorOffsetPolygonTile';
import VectorOffsetLineTile from './components/VectorOffsetLineTile';
import VectorOffssetPointTile from './components/VectorOffssetPointTile';
import VectorPointTile from './components/VectorPointTile';
import VectorPointTextTile from './components/VectorPointTextTile';
import VectorPolygonTile from './components/VectorPolygonTile';
import VectorLineTile from './components/VectorLineTile';

import VectorProvince from './components/VectorProvince';
import VectorProvinceAllTile from './components/VectorProvinceAllTile';

import Germany from './components/germany';
import Billboard from './components/billboard';
import LinearLine from './components/linearLine';
import TimeLine from './components/timeline';
import Light from './components/light';
import LandCover from './components/landCover';
import HeightLine from './components/heightline';
import Quxian from './components/QuXian';

storiesOf('瓦片', module)
  .add('RasterTile', () => <RasterTile />)
  .add('OsmRasterTile', () => <OsmRasterTile />)

  .add('America', () => <America />)
  .add('Lerc', () => <Lerc />)
  .add('DemColor', () => <RasterArrayBuffer />)
  .add('DemFilter', () => <DemFilter />)
  .add('RasterArrayBuffer2', () => <RasterArrayBuffer2 />)
  .add('RasterArrayBufferMask', () => <RasterArrayBufferMask />)

  .add('TiffRasterTile', () => <TiffRasterTile />)
  .add('VectorOffsetPolygonTile', () => <VectorOffsetPolygonTile />)
  .add('VectorOffsetLineTile', () => <VectorOffsetLineTile />)
  .add('VectorOffssetPointTile', () => <VectorOffssetPointTile />)
  .add('VectorPointTile', () => <VectorPointTile />)
  .add('VectorPointTextTile', () => <VectorPointTextTile />)
  .add('VectorPolygonTile', () => <VectorPolygonTile />)
  .add('VectorLineTile', () => <VectorLineTile />)

  .add('VectorProvince', () => <VectorProvince />)
  .add('VectorProvinceAllTile', () => <VectorProvinceAllTile />)

  .add('Germany', () => <Germany />)
  .add('Billboard', () => <Billboard />)
  .add('LinearLine', () => <LinearLine />)
  .add('TimeLine', () => <TimeLine />)
  .add('Light', () => <Light />)
  .add('LandCover', () => <LandCover />)
  .add('HeightLine', () => <HeightLine />)
  .add('Quxian', () => <Quxian />)
