import { Scene } from '@antv/l7';
import { createContext, useContext } from 'react';

export const SceneContext = createContext({});
export function useSceneValue(): Scene {
  return (useContext(SceneContext) as unknown) as Scene;
}
