import { IMapConfig, ISceneConfig, Scene } from '@antv/l7';
// @ts-ignore
// tslint:disable-next-line:no-submodule-imports
import GaodeMap from '@antv/l7-maps/lib/amap';
import React, { createElement, createRef, useEffect, useState } from 'react';
import { SceneContext } from './SceneContext';
interface IMapSceneConig {
  style?: React.CSSProperties;
  className?: string;
  map: Partial<IMapConfig>;
  option?: Partial<ISceneConfig>;
  children?: React.ReactNode;
  onSceneLoaded?: (scene: Scene) => void;
}
const AMapScene = React.memo((props: IMapSceneConig) => {
  const { style, className, map, option, onSceneLoaded } = props;
  const container = createRef();
  const [scene, setScene] = useState<Scene>();
  useEffect(() => {
    const sceneInstance = new Scene({
      id: container.current as HTMLDivElement,
      ...option,
      map: new GaodeMap(map),
    });
    sceneInstance.on('loaded', () => {
      setScene(sceneInstance);
      if (onSceneLoaded) {
        onSceneLoaded(sceneInstance);
      }
    });
    return () => {
      sceneInstance.destroy();
    };
  }, []);
  useEffect(() => {
    if (!scene) {
      return;
    }
    scene.setMapStyle(map.style);
  }, [map.style]);

  return (
    <SceneContext.Provider value={scene}>
      {createElement(
        'div',
        {
          ref: container,
          style,
          className,
        },
        scene && props.children,
      )}
    </SceneContext.Provider>
  );
});

export default AMapScene;
