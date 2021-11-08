import { registerWidget } from '@antv/dipper-core';
import {
  CitySelect,
  SiderBar,
  NavBar,
  ClassifyColor,
  DiscreteColor,
} from '@antv/dipper-widgets';
import { GridLayer } from './GridLayer';
import { MapStyle } from '@antv/dipper-widgets';

export function initWidgets() {
  registerWidget('citySelect', CitySelect);
  registerWidget('siderbartabcontent', SiderBar);
  registerWidget('navibar', NavBar);
  registerWidget('gridLayer', GridLayer);
  registerWidget('classifyColor', ClassifyColor);
  registerWidget('discreteColor', DiscreteColor);
  registerWidget('mapStyle', MapStyle);
}
