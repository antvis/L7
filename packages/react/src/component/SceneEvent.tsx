import { ILayer, Scene } from '@antv/l7';
import * as React from 'react';
import { useSceneValue } from './SceneContext';

const { useEffect } = React;
interface ILayerProps {
  type: string;
  handler: (...args: any[]) => void;
}
export const SceneEvent = React.memo((props: ILayerProps) => {
  const { type, handler } = props;
  const mapScene = (useSceneValue() as unknown) as Scene;

  useEffect(() => {
    mapScene.on(type, handler);
    return () => {
      mapScene.off('type', handler);
    };
  }, [type]);
  return null;
});
