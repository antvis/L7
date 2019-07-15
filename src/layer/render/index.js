import { registerRender, getRender } from './factory';
// polygon
import DrawFill from './polygon/drawFill';
import DrawLine from './polygon/drawLine';
import DrawAnimate from './polygon/drawAnimate';

registerRender('polygon', 'fill', DrawFill);
registerRender('polygon', 'extrude', DrawFill);
registerRender('polygon', 'line', DrawLine);
registerRender('polygon', 'animate', DrawAnimate);

// line
import DrawMeshLine from './line/drawMeshLine';
import DrawArcLine from './line/drawArc';

registerRender('line', 'line', DrawMeshLine);
registerRender('line', 'arc', DrawArcLine);
registerRender('line', 'greatCircle', DrawArcLine);

// point
import DrawPointFill from './point/drawFill';
import DrawPointImage from './point/drawImage';
import DrawPointNormal from './point/drawNormal';
import DrawPointStroke from './point/drawStroke';
import DrawPointText from './point/drawText';
import DrawPointCircle from './point/drawCircle';

registerRender('point', 'fill', DrawPointFill);
registerRender('point', 'image', DrawPointImage);
registerRender('point', 'normal', DrawPointNormal);
registerRender('point', 'stroke', DrawPointStroke);
registerRender('point', 'text', DrawPointText);
registerRender('point', 'circle', DrawPointCircle);

// heatmap

import DrawGrid from './heatmap/gird';
import DrawHeatmap from './heatmap/heatmap';
import DrawHexagon from './heatmap/hexagon';

registerRender('heatmap', 'grid', DrawGrid);
registerRender('heatmap', 'heatmap', DrawHeatmap);
registerRender('heatmap', 'hexagon', DrawHexagon);

// image

import DrawImage from './image/drawImage';

registerRender('image', 'image', DrawImage);

export { getRender };
