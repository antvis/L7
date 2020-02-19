import { IMapConfig, Scene } from '@antv/l7';
// @ts-ignore
// tslint:disable-next-line:no-submodule-imports
import Mapbox from '@antv/l7-maps/lib/mapbox';
import React, { createElement, createRef, useEffect, useState } from 'react';
import { SceneContext } from './SceneContext';
interface IMapSceneConig {
  style?: React.CSSProperties;
  className?: string;
  map: IMapConfig;
  children?: JSX.Element | JSX.Element[] | Array<JSX.Element | undefined>;
}
const MapboxScene = React.memo((props: IMapSceneConig) => {
  const { style, className, map } = props;
  const container = createRef();
  const [scene, setScene] = useState();
  useEffect(() => {
    const sceneInstance = new Scene({
      id: container.current as HTMLDivElement,
      map: new Mapbox(map),
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

export default MapboxScene;
