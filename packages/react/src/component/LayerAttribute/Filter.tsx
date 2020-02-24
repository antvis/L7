import { ILayer, StyleAttrField } from '@antv/l7';
import * as React from 'react';
import { IAttributeOptions } from './';

const { useEffect } = React;
interface ILayerProps {
  layer: ILayer;
  filter: Partial<IAttributeOptions>;
}
export default React.memo(function Chart(props: ILayerProps) {
  const { layer, filter } = props;
  useEffect(() => {
    if (filter.field) {
      layer.filter(filter.field as string, filter.values as StyleAttrField);
    }
  }, [filter.field, JSON.stringify(filter.values)]);
  return null;
});
