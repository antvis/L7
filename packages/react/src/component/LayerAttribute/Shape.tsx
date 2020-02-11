import { ILayer, StyleAttrField } from '@antv/l7';
import * as React from 'react';
import { IAttributeOptions } from './';

const { useEffect } = React;
interface ILayerProps {
  layer: ILayer;
  shape: Partial<IAttributeOptions>;
}
export default React.memo(function Chart(props: ILayerProps) {
  const { layer, shape } = props;
  useEffect(() => {
    shape.field
      ? layer.shape(shape.field, shape.values)
      : layer.shape(shape.value as StyleAttrField);
  }, [shape.field, shape.value, JSON.stringify(shape.values)]);
  return null;
});
