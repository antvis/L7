import * as React from 'react';
import { ILayerProps } from './LayerAttribute';
import BaseLayer from './LayerAttribute/Layer';

const PolygonLayer = React.memo(function Layer(props: ILayerProps) {
  return BaseLayer('polygonLayer', props);
});

const LineLayer = React.memo(function Layer(props: ILayerProps) {
  return BaseLayer('polygonLayer', props);
});

const PointLayer = React.memo(function Layer(props: ILayerProps) {
  return BaseLayer('pointLayer', props);
});

export { PolygonLayer, LineLayer, PointLayer };
