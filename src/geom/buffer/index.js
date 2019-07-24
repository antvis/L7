
// Polygon

import FillBuffer from './polygon/fill_buffer';
import LineBuffer from './polygon/line_buffer';
import ExtrudeBuffer from './polygon/extrude_buffer';

// Line
import MeshLineBuffer from './line/meshline';
import ArcLineBuffer from './line/arcline';

// heatmap

import Grid3D from './heatmap/grid_3d';

import { registerBuffer, getBuffer } from './factory';

registerBuffer('polygon', 'fill', FillBuffer);
registerBuffer('polygon', 'extrude', ExtrudeBuffer);
registerBuffer('polygon', 'line', LineBuffer);

// line
registerBuffer('line', 'line', MeshLineBuffer);
registerBuffer('line', 'arc', ArcLineBuffer);
registerBuffer('line', 'greatCircle', ArcLineBuffer);

// heatmap

registerBuffer('heatmap', 'square', Grid3D);
registerBuffer('heatmap', 'squareColumn', Grid3D);

export { getBuffer };
