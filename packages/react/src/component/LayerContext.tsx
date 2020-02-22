import { ILayer } from '@antv/l7';
import { createContext, useContext } from 'react';

export const LayerContext = createContext({});
export function useLayerValue(): ILayer {
  return (useContext(LayerContext) as unknown) as ILayer;
}
