import { storiesOf } from '@storybook/react';
import * as React from 'react';
import Country from './Layer/Country';
import Country2 from './Layer/Country2';
import CountryCity from './Layer/country_city';
import CountryCounty from './Layer/country_county';
import World from './Layer/world';

storiesOf('行政区划', module)
  .add('世界地图', () => <World />)
  .add('中国地图', () => <Country />)
  .add('中国地图市级', () => <CountryCity />)
  .add('中国地图县级', () => <CountryCounty />)
  .add('中国地图附图', () => <Country2 />);
