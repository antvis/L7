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
      : layer.color(color.values as StyleAttrField);
    // TODO：目前这种处理会频繁更新，但是直接JSON.Stringify(size.values)，回调函数不会更新，待优化
  }, [color.field, color.scale, color.values]);

  return null;
});
