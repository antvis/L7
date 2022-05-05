import { storiesOf } from '@storybook/react';
import * as React from 'react';

import Line from './components/line'
import Polygon from './components/polygon'
import Point from './components/point'
import Image from './components/image'
import ImageTile from './components/imageTile'
import Heatmap from './components/heatmap'
import HeatmapGrid from './components/heatmapgrid'
import HeatmapGrid3D from './components/heatmapgrid3d'
import Hexgon from './components/hexgon'
import Raster from './components/raster'
import Text from './components/text'
import SingleMask from './components/singleMask';

storiesOf('Mask 方法', module)
        .add('SingleMask', () => <SingleMask/>)
        .add('Point', () => <Point/>)
        .add('Polygon', () => <Polygon/>)
        .add('Line', () => <Line/>)
        .add('Image', () => <Image/>)
        .add('ImageTile', () => <ImageTile/>)
        .add('Heatmap', () => <Heatmap/>)
        .add('HeatmapGrid', () => <HeatmapGrid/>)
        .add('HeatmapGrid3D', () => <HeatmapGrid3D/>)
        .add('Hexgon', () => <Hexgon/>)
        .add('Raster', () => <Raster/>)
        .add('Text', () => <Text/>)
