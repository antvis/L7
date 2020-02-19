import { ILayer, LineLayer, PointLayer, PolygonLayer, Scene } from '@antv/l7';
import * as React from 'react';
import { LayerContext } from '../LayerContext';
import { useSceneValue } from '../SceneContext';
import {
  Active,
  Color,
  Filter,
  ILayerProps,
  Scale,
  Shape,
  Size,
  Source,
  Style,
} from './';

const { useEffect, useState } = React;

export default function BaseLayer(type: string, props: ILayerProps) {
  const {
    source,
    color,
    shape,
    style,
    size,
    scale,
    active,
    filter,
    options,
  } = props;
  const mapScene = (useSceneValue() as unknown) as Scene;
  const [layer, setLayer] = useState();
  if (!layer) {
    let l: ILayer;
    switch (type) {
      case 'polygonLayer':
        l = new PolygonLayer(options);
        break;
      case 'lineLayer':
        l = new LineLayer(options);
        break;
      case 'pointLayer':
        l = new PointLayer(options);
        break;
      default:
        l = new PolygonLayer(options);
    }
    setLayer(l);
  }

  useEffect(() => {
    mapScene.addLayer(layer);
    return () => {
      mapScene.removeLayer(layer);
    };
  }, []);
  useEffect(() => {
    if (layer) {
      mapScene.render();
    }
  });
  return (
    <LayerContext.Provider value={layer}>
      <Source layer={layer} source={source} />
      {scale && <Scale layer={layer} scale={scale} />}
      <Color layer={layer} color={color} />
      {size && <Size layer={layer} size={size} />}
      <Shape layer={layer} shape={shape} />
      {style && <Style layer={layer} style={style} />}
      {active && <Active layer={layer} active={active} />}
      {filter && <Filter layer={layer} filter={filter} />}
      {/* LayerContext主要传入LayerEvent组件 */}
      {props.children}
    </LayerContext.Provider>
  );
}
