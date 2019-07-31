
// Polygon

import FillBuffer from './polygon/fill_buffer';
import LineBuffer from './polygon/line_buffer';
import ExtrudeBuffer from './polygon/extrude_buffer';

// Line
import MeshLineBuffer from './line/meshline';
import ArcLineBuffer from './line/arcline';

// heatmap

import Grid3D from './heatmap/grid_3d';
import Hexagon3D from './heatmap/hexagon_3d';

// 3D Shape
import Shape_3D from './heatmap/hexagon';

import { registerBuffer, getBuffer } from './factory';

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

// 3D Shape

registerBuffer('shape', 'extrude', Shape_3D);
export { getBuffer };
