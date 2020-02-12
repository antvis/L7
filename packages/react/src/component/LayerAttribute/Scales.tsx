import { ILayer, IScale, IScaleOptions } from '@antv/l7';
import * as React from 'react';
import { IScaleAttributeOptions } from './';

const { useEffect } = React;
interface ILayerProps {
  layer: ILayer;
  scales: Partial<IScaleAttributeOptions>;
}
export default React.memo(function Chart(props: ILayerProps) {
  const { layer, scales } = props;
  useEffect(() => {
    scales.field
      ? layer.scale(scales.field as string, scales.value as IScale)
      : layer.scale(scales.values as IScaleOptions);
  }, [scales.value, scales.field, JSON.stringify(scales.values)]);
  return null;
});
