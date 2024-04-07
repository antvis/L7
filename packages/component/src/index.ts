import Marker from './marker';
import MarkerLayer from './marker-layer';

import './assets/iconfont/iconfont.js';
// 引入样式
import './css/index.css';
// import './css/index.less';

export * from './control/baseControl';
export { ExportImage, type IExportImageControlOption } from './control/exportImage';
export { Fullscreen, type IFullscreenControlOption } from './control/fullscreen';
export { GeoLocate, type IGeoLocateOption } from './control/geoLocate';
export { LayerSwitch, type ILayerSwitchOption } from './control/layerSwitch';
export { Logo, type ILogoControlOption } from './control/logo';
export { MapTheme } from './control/mapTheme';
export { MouseLocation, type IMouseLocationControlOption } from './control/mouseLocation';
export { Scale, type IScaleControlOption } from './control/scale';
export { Swipe, type ISwipeControlOption } from './control/swipe';
export { Zoom, type IZoomControlOption } from './control/zoom';
export * from './interface';
export {
  LayerPopup,
  type ILayerPopupOption,
  type LayerField,
  type LayerPopupConfigItem,
} from './popup/layerPopup';
export { Popup } from './popup/popup';
export { Marker, MarkerLayer };
