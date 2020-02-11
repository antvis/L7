import { ILayer, StyleAttrField } from '@antv/l7';
import * as React from 'react';
import { IAttributeOptions } from './';

const { useEffect } = React;
interface ILayerProps {
  layer: ILayer;
  color: Partial<IAttributeOptions>;
}
export default React.memo(function Chart(props: ILayerProps) {
  const { layer, color } = props;
  useEffect(() => {
    color.field
      ? layer.color(color.field as StyleAttrField, color.values)
      : layer.color(color.value as StyleAttrField);
  }, [color.value, color.field, JSON.stringify(color.values)]);
  return null;
});
