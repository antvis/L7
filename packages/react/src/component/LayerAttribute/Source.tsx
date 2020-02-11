import { ILayer } from '@antv/l7';
import * as React from 'react';
import { ISourceOptions } from './';

const { useEffect } = React;
interface ISourceProps {
  layer: ILayer;
  source: Partial<ISourceOptions>;
}
export default React.memo(function Chart(props: ISourceProps) {
  const { layer, source } = props;
  const { data, ...sourceOption } = source;

  useEffect(() => {
    // @ts-ignore
    layer.source(data, sourceOption);
  }, []);
  return null;
});
