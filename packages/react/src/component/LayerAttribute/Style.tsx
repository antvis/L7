import { ILayer } from '@antv/l7';
import * as React from 'react';
import { IStyleOptions } from './';

const { useEffect } = React;
interface ILayerProps {
  layer: ILayer;
  style: Partial<IStyleOptions>;
}
export default React.memo(function Chart(props: ILayerProps) {
  const { layer, style } = props;
  useEffect(
    () => {
      layer.style(style);
    },
    Object.keys(style).map((key) => style[key]),
  );
  return null;
});
