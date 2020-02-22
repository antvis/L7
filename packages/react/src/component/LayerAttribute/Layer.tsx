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
  const [layer, setLayer] = useState<ILayer>();
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
    if (layer !== undefined) {
      mapScene.addLayer(layer as ILayer);
      return () => {
        mapScene.removeLayer(layer as ILayer);
      };
    }
  }, []);
  useEffect(() => {
    // 重绘layer
    if (layer) {
      mapScene.render();
      // 如果autoFit为true，执行自适应操作
      if (options?.autoFit) {
        layer.fitBounds();
      }
    }
  });

  useEffect(() => {
    if (layer && layer.inited && options) {
      layer.updateLayerConfig(options);
    }
  }, [options?.minZoom, options?.maxZoom, options?.visible]);

  useEffect(() => {
    if (layer && layer.inited && options && options.zIndex) {
      layer.setIndex(options.zIndex);
    }
  }, [options?.zIndex]);

  useEffect(() => {
    if (layer && layer.inited && options && options.blend) {
      layer.setBlend(options.blend);
    }
  }, [options?.blend]);

  return layer !== null && layer !== undefined ? (
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
  ) : null;
}
