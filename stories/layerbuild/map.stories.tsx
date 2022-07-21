import { storiesOf } from '@storybook/react';
import * as React from 'react';

import PointFill from './components/Points';
import PointExtrue from './components/PointsExtrude';
import PointText from './components/PointsText';
import PointSimple from './components/PointsSimple';
import PointsNormal from './components/PointsNormal';
import PointsFillImage from './components/PointsFillImage';
import PointImage from './components/PointsImage';
import PointIconFont from './components/PointsIconFont';
import PointRader from './components/PointsRadar';
import PointTile from './components/PointsTile';
import PointEarthFill from './components/PointsEarthFill';
import PointEarthExtrude from './components/PointsEarthExtrude';

import Line from './components/Line';
import LineArc from './components/LineArc';
import LineArc3d from './components/LineArc3d';
import LineLinear from './components/LineLinear';
import LineSimple from './components/LineSimple';
import LineHalf from './components/LineHalf';
import LineGreatCircle from './components/LineGreatCircle';
import LineWall from './components/LineWall';
import LineEarthArc3D from './components/LineEarthArc3D';
import LineTile from './components/LineTile';

import PolygonFill from './components/Polygon';
import PolygonExtrude from './components/PolygonExtrude';
import PolygonOcean from './components/PolygonOcean';
import PolygonWater from './components/PolygonWater';
import PolygonTile from './components/PolygonTile';

import Heatmap from './components/Heatmap';
import Heatmap3d from './components/Heatmap3d';
import HeatmapGrid from './components/HeatmapGrid';
import HeatmapGrid3d from './components/HeatmapGrid3d';
import HeatmapHexagon from './components/HeatmapHexagon';

import CityBuilding from './components/CityBuilding';

import ImageLayer from './components/ImageLayer';

import RasterLayer from './components/RasterLayer';

storiesOf('图层渲染流程改造', module)
  .add('pointFill', () => <PointFill />)
  .add('PointExtrue', () => <PointExtrue />)
  .add('PointText', () => <PointText />)
  .add('PointSimple', () => <PointSimple />)
  .add('PointsNormal', () => <PointsNormal />)
  .add('PointsFillImage', () => <PointsFillImage />)
  .add('PointImage', () => <PointImage />)
  .add('PointIconFont', () => <PointIconFont />)
  .add('PointRader', () => <PointRader />)
  .add('PointTile', () => <PointTile />)
  .add('PointEarthFill', () => <PointEarthFill />)
  .add('PointEarthExtrude', () => <PointEarthExtrude />)

  .add('Line', () => <Line />)
  .add('LineArc', () => <LineArc />)
  .add('LineArc3d', () => <LineArc3d />)
  .add('LineLinear', () => <LineLinear />)
  .add('LineSimple', () => <LineSimple />)
  .add('LineHalf', () => <LineHalf />)
  .add('LineGreatCircle', () => <LineGreatCircle />)
  .add('LineWall', () => <LineWall />)
  .add('LineEarthArc3D', () => <LineEarthArc3D />)
  .add('LineTile', () => <LineTile />)

  .add('PolygonFill', () => <PolygonFill />)
  .add('PolygonExtrude', () => <PolygonExtrude />)
  .add('PolygonOcean', () => <PolygonOcean />)
  .add('PolygonWater', () => <PolygonWater />)
  .add('PolygonTile', () => <PolygonTile />)

  .add('Heatmap', () => <Heatmap />)
  .add('Heatmap3d', () => <Heatmap3d />)
  .add('HeatmapGrid', () => <HeatmapGrid />)
  .add('HeatmapGrid3d', () => <HeatmapGrid3d />)
  .add('HeatmapHexagon', () => <HeatmapHexagon />)

  .add('CityBuilding', () => <CityBuilding />)

  .add('ImageLayer', () => <ImageLayer />)

  .add('RasterLayer', () => <RasterLayer />)
