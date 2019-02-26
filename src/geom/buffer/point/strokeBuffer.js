import * as polygonPath from '../../shape/path';
import * as polygonShape from '../../shape/polygon';
import * as lineShape from '../../shape/line';
import { pointShape } from '../../../global';
import Util from '../../../util';
export default function StrokeBuffer(layerData, style) {
  const attribute = {
    shapes: [],
    normal: [],
    miter: [],
    indexArray: [],
    sizes: [],
    positions: [],
    pickingIds: [],
    colors: []
  };
  const { stroke, strokeWidth } = style;
  layerData.forEach(item => {
    let { size, shape, id, coordinates } = item;
    const path = polygonPath[shape]();
    const positionsIndex = attribute.miter.length;
    let polygon = null;
    if (pointShape['2d'].indexOf(shape) !== -1) {
      Util.isArray(size) || (size = [ size, size, 0 ]);
      polygon = lineShape.Line([ path ], { size: [ strokeWidth, 0 ], color: stroke, id }, positionsIndex);
    } else if (pointShape['3d'].indexOf(shape) !== -1) {
      Util.isArray(size) || (size = [ size, size, size ]);
      const polygonExtrudePath = polygonShape.extrudeline([ path ]);
            // TODO 3d line
      polygon = lineShape.Line([ polygonExtrudePath ], { size: [ strokeWidth, 0 ], color: stroke, id }, positionsIndex);


    } else {
      throw new Error('Invalid shape type: ' + shape);
    }
    polygonLineBuffer(polygon, coordinates, size, attribute);

  });
  return attribute;
}
function polygonLineBuffer(polygon, geo, size, attribute) {
  attribute.shapes.push(...polygon.positions);
  attribute.normal.push(...polygon.normal);
  attribute.miter.push(...polygon.miter);
  attribute.pickingIds.push(...polygon.pickingIds);
  attribute.indexArray.push(...polygon.indexArray);
  attribute.colors.push(...polygon.colors);
  polygon.miter.forEach(() => {
    attribute.positions.push(...geo); // 多边形位置
    attribute.sizes.push(...size); // 多边形大小
  });

}
