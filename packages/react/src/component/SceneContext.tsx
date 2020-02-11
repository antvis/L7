import { Scene } from '@antv/l7';
import { createContext, useContext } from 'react';
const SceneContext = createContext(null);
export function useSceneValue(): Scene {
  return (useContext(SceneContext) as unknown) as Scene;
}
export default SceneContext;
