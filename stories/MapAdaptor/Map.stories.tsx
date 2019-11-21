import { storiesOf } from '@storybook/react';
import * as React from 'react';
import AMap from './components/AMap';
import Mapbox from './components/Mapbox';
// import Polygon from './components/Polygon';
// import Point3D from './components/Point3D';
// import Line from './components/Line';
// import ImageLayer from './components/Image';
// import GridHeatMap from './components/GridHeatmap';
// import PointImage from './components/pointImage';
// @ts-ignore
import notes from './Map.md';
// @ts-ignore
storiesOf('地图底图', module)
  .add('高德地图', () => <AMap />, {
    notes: { markdown: notes },
  })
  .add('Mapbox', () => <Mapbox />, {
    notes: { markdown: notes },
  });
// .add('Polygon', () => <Polygon />);
// .add('Point3D', () => <Point3D />)
// .add('Line', () => <Line />)
// .add('GridHeatMap', () => <GridHeatMap />)
// .add('Image', () => <ImageLayer />)
// .add('pointImage', () => <PointImage />);
