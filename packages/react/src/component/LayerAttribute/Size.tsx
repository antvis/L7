import { ILayer, StyleAttrField } from '@antv/l7';
import * as React from 'react';
import { IAttributeOptions } from './';

const { useEffect } = React;
interface ILayerProps {
  layer: ILayer;
  size: Partial<IAttributeOptions>;
}
export default React.memo(function Chart(props: ILayerProps) {
  const { layer, size } = props;
  useEffect(() => {
    size.field
      ? layer.size(size.field, size.values)
      : layer.size(size.values as StyleAttrField);
  }, [size.field, JSON.stringify(size.values), size.scale]);
  return null;
});
