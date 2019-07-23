
// Polygon

import FillBuffer from './polygon/fill_buffer';
import LineBuffer from './polygon/line_buffer';
import ExtrudeBuffer from './polygon/extrude_buffer';

// Line
import MeshLineBuffer from './line/meshline';
import ArcLineBuffer from './line/arcline';

import { registerBuffer, getBuffer } from './factory';

registerBuffer('polygon', 'fill', FillBuffer);
registerBuffer('polygon', 'extrude', ExtrudeBuffer);
registerBuffer('polygon', 'line', LineBuffer);

// line
registerBuffer('line', 'line', MeshLineBuffer);
registerBuffer('line', 'arc', ArcLineBuffer);
registerBuffer('line', 'greatCircle', ArcLineBuffer);

export { getBuffer };
