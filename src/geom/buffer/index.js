
// Polygon

import FillBuffer from './polygon/fill_buffer';
import LineBuffer from './polygon/line_buffer';
import ExtrudeBuffer from './polygon/extrude_buffer';
// Point
import PointFillBuffer from './point/fill_buffer2';

// Line
import MeshLineBuffer from './line/meshline';
import ArcLineBuffer from './line/arcline';

// heatmap

import Hexagon3D from './heatmap/hexagon_3d';

// 3D Shape
import Shape_3D from './point/extrude_buffer';

import { registerBuffer, getBuffer } from './factory';

// Point
registerBuffer('point', 'fill', PointFillBuffer);

// polygon
registerBuffer('polygon', 'fill', FillBuffer);
registerBuffer('polygon', 'extrude', ExtrudeBuffer);
registerBuffer('polygon', 'line', LineBuffer);

// line
registerBuffer('line', 'line', MeshLineBuffer);
registerBuffer('line', 'arc', ArcLineBuffer);
registerBuffer('line', 'greatCircle', ArcLineBuffer);

// heatmap

// registerBuffer('heatmap', 'square', Grid3D);
// registerBuffer('heatmap', 'squareColumn', Grid3D);
registerBuffer('heatmap', 'shape', Hexagon3D);
registerBuffer('point', 'shape', Hexagon3D);
// 3D Shape

registerBuffer('shape', 'extrude', Shape_3D);
export { getBuffer };
