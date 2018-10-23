import geom from '../../geom/geom';
import { GeoBuffer, bufferGeometry, Material } from '../../geom/index';


// geom shape buffer geometry material
// shape name type()
// buffer  1:n  geometry
// geometry
//
export default function polygonGeom(shape, coordinates, properties, layerid) {
  const polygongeom = geom.polygon;
  const { buffer, geometry, material } = polygongeom[shape];// polygon 映射表
  const bufferData = new GeoBuffer[buffer]({
    coordinates,
    properties,
    shape
  });
  bufferData.bufferStruct.name = layerid;
  const bg = new bufferGeometry[geometry](bufferData.bufferStruct);
  const mtl = Material[material]();
  return {
    geometry: bg,
    mtl
  };
}

export function pointGeom(shape, bufferData) {
  const pointgeom = geom.point;
  const { geometry, material } = pointgeom[shape];
  const bg = new bufferGeometry[geometry](bufferData.bufferStruct);
  const mtl = Material[material]();
  return {
    geometry: bg,
    mtl
  };
}
