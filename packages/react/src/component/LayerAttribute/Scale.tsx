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
    layer.scale(scale.values as IScaleOptions);
  }, [scale.values]);
  return null;
});
