import { registerRender, getRender } from './factory';
// polygon
import DrawFill from './polygon/drawFill';
import DrawLine from './polygon/drawLine';
import DrawAnimate from './polygon/drawAnimate';
import Draw3DShape from './point/draw_3d_shape';
import DrawText from './text/drawText';

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
// import DrawPointFill from './point/drawFill';
import DrawPointImage from './point/drawImage';
import DrawPointNormal from './point/drawNormal';
import DrawPointStroke from './point/drawStroke';
import DrawPointCircle from './point/drawCircle';
import DrawHexagon from './heatmap/hexagon';

// registerRender('point', 'fill', DrawPointFill);
registerRender('point', 'image', DrawPointImage);
registerRender('point', 'normal', DrawPointNormal);
registerRender('point', 'stroke', DrawPointStroke);
registerRender('point', 'text', DrawText);
registerRender('point', 'fill', DrawPointCircle);
registerRender('point', 'shape', Draw3DShape);
registerRender('point', 'extrude', Draw3DShape);


// heatmap

import DrawGrid from './heatmap/gird';
import DrawHeatmap from './heatmap/heatmap';


registerRender('heatmap', 'square', DrawGrid);
registerRender('heatmap', 'squareColumn', DrawGrid);
registerRender('heatmap', 'heatmap', DrawHeatmap);
registerRender('heatmap', 'shape', DrawHexagon);

// image

import DrawImage from './image/drawImage';

registerRender('image', 'image', DrawImage);

// image

registerRender('text', 'text', DrawText);

export { getRender };
