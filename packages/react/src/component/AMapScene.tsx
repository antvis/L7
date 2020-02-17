import { IMapConfig, Scene } from '@antv/l7';

// tslint:disable-next-line:no-submodule-imports
import GaodeMap from '@antv/l7-maps/lib/amap';
import React, { createElement, createRef, useEffect, useState } from 'react';
import SceneContext from './SceneContext';
interface IMapSceneConig {
  style?: React.CSSProperties;
  className?: string;
  map: IMapConfig;
  children?: JSX.Element | JSX.Element[] | Array<JSX.Element | undefined>;
}
const AMapScene = React.memo((props: IMapSceneConig) => {
  const { style, className, map } = props;
  const container = createRef();
  const [scene, setScene] = useState();
  useEffect(() => {
    const sceneInstance = new Scene({
      id: container.current as HTMLDivElement,
      map: new GaodeMap(map),
    });
    sceneInstance.on('loaded', () => {
      setScene(sceneInstance);
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
