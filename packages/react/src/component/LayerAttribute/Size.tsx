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
    // TODO：目前这种处理会频繁更新，但是直接JSON.Stringify(size.values)，回调函数不会更新，待优化
  }, [size.field, size.values, size.scale]);
  return null;
});
