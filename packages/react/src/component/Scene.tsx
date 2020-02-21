import { IMapWrapper, Scene } from '@antv/l7';
import React, { createElement, createRef, useEffect, useState } from 'react';
import { SceneContext } from './SceneContext';

interface IMapSceneConig {
  style?: React.CSSProperties;
  // 配置项，比如是否禁止鼠标缩放地图
  options?: {
    [key: string]: any;
  };
  className?: string;
  map: IMapWrapper;
  children?: JSX.Element | JSX.Element[] | Array<JSX.Element | undefined>;
}
export default React.memo((props: IMapSceneConig) => {
  const { style, className, map, options } = props;
  const container = createRef();
  const [scene, setScene] = useState();
  useEffect(() => {
    const sceneInstance = new Scene({
      id: container.current as HTMLDivElement,
      map,
    });
    sceneInstance.on('loaded', () => {
      setScene(sceneInstance);
      // 禁止鼠标滚轮缩放地图
      if (options && !options.enableMouseZoom) {
        const mapsService = sceneInstance.getMapService();
        if (mapsService && mapsService.getType() === 'mapbox') {
          (mapsService.map as any).scrollZoom.disable();
        }
        // TODO高德地图的禁止待补充
      }
    });
    return () => {
      sceneInstance.destroy();
    };
  }, []);

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
