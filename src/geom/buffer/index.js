import PolygonBuffer from './polygon';
import LineBuffer from './line';
// export { default as textBuffer } from './textBuffer';
import { registerBuffer, getBuffer } from './factory';
registerBuffer('polygon', 'fill', PolygonBuffer);
registerBuffer('polygon', 'extrude', PolygonBuffer);
registerBuffer('polygon', 'line', PolygonBuffer);
registerBuffer('line', 'line', LineBuffer);

export { getBuffer };
