import { ILayer, IScale, IScaleOptions } from '@antv/l7';
import * as React from 'react';
import { IScaleAttributeOptions } from './';

const { useEffect } = React;
interface ILayerProps {
  layer: ILayer;
  scale: Partial<IScaleAttributeOptions>;
}
export default React.memo(function Chart(props: ILayerProps) {
  const { layer, scale } = props;
  useEffect(() => {
    scale.value
      ? layer.scale(scale.field as string, scale.value as IScale)
      : layer.scale(scale.field as IScaleOptions);
  }, [scale.value, scale.field]);
  return null;
});
