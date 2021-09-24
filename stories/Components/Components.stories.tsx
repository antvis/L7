import { storiesOf } from '@storybook/react';
import * as React from 'react';
import Chart from './components/chart';
import ClusterMarkerLayer from './components/clusterMarker';
import Marker from './components/Marker';
import MarkerLayerComponent from './components/markerlayer';
import Popup from './components/Popup';
import Scale from './components/Scale';
import Zoom from './components/Zoom';
import Position from './components/Position';
// @ts-ignore
storiesOf('UI 组件', module)
  .add('Zoom', () => <Zoom />)
  .add('Scale', () => <Scale />)
  .add('Marker', () => <Marker />)
  .add('Chart', () => <Chart />)
  .add('Popup', () => <Popup />)
  .add('MarkerLayer', () => <MarkerLayerComponent />)
  .add('ClusterMarkerLayer', () => <ClusterMarkerLayer />)
  .add('Position', () => <Position />);
