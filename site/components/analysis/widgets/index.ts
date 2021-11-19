import { registerWidget } from '@antv/dipper-core';
import {
  CitySelect,
  NavBar,
  ClassifyColor,
  DiscreteColor,
  Draw,
  MapStyle,
  SearchPlace,
  Location,
} from '@antv/dipper-widgets';
import { GridLayer } from './GridLayer';
import { MeshIndicator } from './MeshIndicator';
import { MeshName } from './MeshName';
import { Filter } from './Filter';
import { TotalPanel } from './TotalPanel/index';
import { MeshChart } from './MeshChart';

export function initWidgets() {
  registerWidget('citySelect', CitySelect);
  registerWidget('navibar', NavBar);
  registerWidget('gridLayer', GridLayer);
  registerWidget('classifyColor', ClassifyColor);
  registerWidget('discreteColor', DiscreteColor);
  registerWidget('mapStyle', MapStyle);
  registerWidget('searchPlaces', SearchPlace);
  registerWidget('location', Location);
  registerWidget('filter', Filter);
  registerWidget('mesh_indicator', MeshIndicator);
  registerWidget('total_data_panel', TotalPanel);
  registerWidget('meshchart', MeshChart);

  registerWidget('draw', Draw);
  registerWidget('meshName',MeshName)
}
