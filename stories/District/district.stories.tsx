import { storiesOf } from '@storybook/react';
require('./../assets/css/antd.css');
import * as React from 'react';
// import City from './Layer/city';
import Country from './Layer/Country';
import Country2 from './Layer/Country2';
import ChinaBubble from './Layer/country_bubble';
import CountryCity from './Layer/country_city';
import CountryCounty from './Layer/country_county';
// import County from './Layer/county';
import DrillDown from './Layer/drillDown';
import Province from './Layer/province';
import World from './Layer/world';

storiesOf('行政区划', module)
  .add('世界地图', () => <World />)
  .add('中国地图', () => <Country />)
  .add('中国地图气泡', () => <ChinaBubble />)
  .add('中国地图市级', () => <CountryCity />)
  .add('中国地图县级', () => <CountryCounty />)
  .add('中国地图附图', () => <Country2 />)
  // .add('县级地图', () => <County />)
  // .add('市级地图', () => <City />)
  .add('上钻下取', () => <DrillDown />)
  .add('省级地图', () => <Province />);
