import * as React from 'react';
import { ILayerProps } from './LayerAttribute';
import BaseLayer from './LayerAttribute/Layer';

const PolygonLayer = React.memo(function Layer(
  props: ILayerProps & { children?: any },
) {
  return BaseLayer('polygonLayer', props);
});

const LineLayer = React.memo(function Layer(props: ILayerProps) {
  return BaseLayer('lineLayer', props);
});

const PointLayer = React.memo(function Layer(
  props: ILayerProps & { children?: any },
) {
  return BaseLayer('pointLayer', props);
});

const HeatmapLayer = React.memo(function Layer(
  props: ILayerProps & { children?: any },
) {
  return BaseLayer('heatmapLayer', props);
});

const RasterLayer = React.memo(function Layer(
  props: ILayerProps & { children?: any },
) {
  return BaseLayer('rasterLayer', props);
});

const ImageLayer = React.memo(function Layer(
  props: ILayerProps & { children?: any },
) {
  return BaseLayer('imagelayer', props);
});

const CityBuildingLayer = React.memo(function Layer(
  props: ILayerProps & { children?: any },
) {
  return BaseLayer('citybuildinglayer', props);
});

export {
  PolygonLayer,
  LineLayer,
  PointLayer,
  HeatmapLayer,
  RasterLayer,
  ImageLayer,
  CityBuildingLayer,
};
