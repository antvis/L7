import { IActiveOption, ILayer } from '@antv/l7';
import * as React from 'react';

const { useEffect } = React;
interface ILayerProps {
  layer: ILayer;
  active: {
    option: IActiveOption | boolean;
  };
}
export default React.memo(function Chart(props: ILayerProps) {
  const { layer, active } = props;
  useEffect(() => {
    layer.active(active.option);
  }, [active, layer]);
  return null;
});
