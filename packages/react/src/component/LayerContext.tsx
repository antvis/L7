import { Layers } from '@antv/l7';
import { createContext, useContext } from 'react';

export const LayerContext = createContext(null);
export function useLayerValue(): Layers {
  return (useContext(LayerContext) as unknown) as Layers;
}
