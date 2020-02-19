import { ILayer } from '@antv/l7';
import * as React from 'react';
import { useLayerValue } from './LayerContext';

const { useEffect } = React;
interface ILayerProps {
  type: string;
  handler: (...args: any[]) => void;
}
export const LayerEvent = React.memo((props: ILayerProps) => {
  const { type, handler } = props;
  const layer = (useLayerValue() as unknown) as ILayer;

  useEffect(() => {
    layer.on(type, handler);
  }, [type]);
  return null;
});
