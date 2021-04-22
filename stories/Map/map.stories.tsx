import { storiesOf } from '@storybook/react';
import * as React from 'react';
import MapCenter from './components/mapCenter';
import Amap2demo from './components/amap2demo'
import Amap2demo_extrude from './components/amap2demo_extrude'
import Amapdemo_extrude from './components/amapdemo_extrude'
import Amap2demo_text from './components/amap2demo_text'
import Amap2demo_image from './components/amap2demo_image'

import Amap2demo_polygon from './components/amap2demo_polygon'
import Amap2demo_polygon_extrude from './components/amap2demo_polygon_extrude'
import Amap2demo_arcLine from "./components/amap2demo_arcLine"

// @ts-ignore
storiesOf('地图方法', module)
        .add('高德地图 point/demo', () => <MapCenter />)
        .add('高德地图2.0 point/demo', () => <Amap2demo />)
        .add('高德地图 point/extrude', () => <Amapdemo_extrude />)
        .add('高德地图2.0 point/extrude', () => <Amap2demo_extrude />)
        .add('高德地图2.0 point/text', () => <Amap2demo_text />)
        .add('高德地图2.0 point/image', () => <Amap2demo_image />)
        .add('高德地图2.0 polygon', () => <Amap2demo_polygon />)
        .add('高德地图2.0 polygon_extrude', () => <Amap2demo_polygon_extrude />)
        .add('高德地图2.0 line_arc', () => <Amap2demo_arcLine />)
