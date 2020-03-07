import { ILayer } from '@antv/l7';
import { createContext, useContext } from 'react';

// tslint:disable-next-line: no-object-literal-type-assertion
export const LayerContext = createContext<ILayer | undefined>({} as ILayer);
export function useLayerValue(): ILayer {
  return (useContext(LayerContext) as unknown) as ILayer;
}
