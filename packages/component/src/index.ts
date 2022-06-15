import Control from './control/BaseControl';
import Layers, { ILayerControlOption } from './control/layer';
import Logo from './control/logo';
import Scale, { IScaleControlOption } from './control/scale';
import Zoom, { IZoomControlOption } from './control/zoom';
import Marker from './marker';
import MarkerLayer, { IMarkerLayerOption } from './markerlayer';
import Popup from './popup';

// 引入样式
// TODO: 使用 Less 或者 Sass，每个组件单独引用自身样式
import './css/l7.css';

export {
  Control,
  Logo,
  Scale,
  IScaleControlOption,
  Zoom,
  IZoomControlOption,
  Layers,
  ILayerControlOption,
  Marker,
  Popup,
  MarkerLayer,
  IMarkerLayerOption,
};
