import { storiesOf } from '@storybook/react';
import * as React from 'react';

import Line from './components/line'
import Point from './components/point'
import Image from './components/image'
import ImageTile from './components/imageTile'
import Heatmap from './components/heatmap'
import HeatmapGrid from './components/heatmapgrid'
import HeatmapGrid3D from './components/heatmapgrid3d'
import Hexgon from './components/hexgon'

storiesOf('Mask 方法', module)
        .add('Point', () => <Point/>)
        .add('Line', () => <Line/>)
        .add('Image', () => <Image/>)
        .add('ImageTile', () => <ImageTile/>)
        .add('Heatmap', () => <Heatmap/>)
        .add('HeatmapGrid', () => <HeatmapGrid/>)
        .add('HeatmapGrid3D', () => <HeatmapGrid3D/>)
        .add('Hexgon', () => <Hexgon/>)
