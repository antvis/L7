import Control from './control/BaseControl';
import Layers from './control/layer';
import Logo from './control/logo';
import Scale from './control/scale';
import Zoom from './control/zoom';
import Marker from './marker';
import MarkerLayer from './marker-layer';
import Popup from './popup';

// 引入样式
// TODO: 使用 Less 或者 Sass，每个组件单独引用自身样式
import './css/l7.css';

export { Control, Logo, Scale, Zoom, Layers, Marker, Popup, MarkerLayer };

export * from './interface';
