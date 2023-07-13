import Marker from './marker';
import MarkerLayer from './marker-layer';

import './assets/iconfont/iconfont.js';
// 引入样式
import './css/index.css';

export * from './control/baseControl';
export { ExportImage, IExportImageControlOption } from './control/exportImage';
export { Fullscreen, IFullscreenControlOption } from './control/fullscreen';
export { GeoLocate, IGeoLocateOption } from './control/geoLocate';
export { ILayerSwitchOption, LayerSwitch } from './control/layerSwitch';
export { ILogoControlOption, Logo } from './control/logo';
export { MapTheme } from './control/mapTheme';
export {
  IMouseLocationControlOption,
  MouseLocation,
} from './control/mouseLocation';
export { IScaleControlOption, Scale } from './control/scale';
export { IZoomControlOption, Zoom } from './control/zoom';
export * from './interface';
export {
  ILayerPopupOption,
  LayerField,
  LayerPopup,
  LayerPopupConfigItem,
} from './popup/layerPopup';
export { Popup } from './popup/popup';
export { Marker, MarkerLayer };
