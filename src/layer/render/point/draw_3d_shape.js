import * as THREE from '../../../core/three';
import GridMaterial from '../../../geom/material/hexagon';
import { getBuffer } from '../../../geom/buffer/';
import { generateLightingUniforms } from '../../../util/shaderModule';
export default function Draw3DShape(layerData, layer, source) {
  const style = layer.get('styleOptions');
  const { fill } = layer.get('activedOptions');
  const { radius } = source.data;
  // const attributes = new hexagonBuffer(layerdata);
  const { opacity, angle, coverage, lights } = style;
  const geometryBuffer = getBuffer('shape', 'extrude');
  const buffer = new geometryBuffer({
    layerData,
    shapeType: layer.shapeType
  });
  const { attributes, indexArray } = buffer;
  const geometry = new THREE.BufferGeometry();
  geometry.setIndex(new THREE.Uint32BufferAttribute(indexArray, 1));
  geometry.addAttribute('position', new THREE.Float32BufferAttribute(attributes.positions, 3));
  geometry.addAttribute('miter', new THREE.Float32BufferAttribute(attributes.miters, 3));
  geometry.addAttribute('a_color', new THREE.Float32BufferAttribute(attributes.colors, 4));
  geometry.addAttribute('pickingId', new THREE.Float32BufferAttribute(attributes.pickingIds, 1));
  geometry.addAttribute('normal', new THREE.Float32BufferAttribute(attributes.normals, 3));
  geometry.addAttribute('a_size', new THREE.Float32BufferAttribute(attributes.sizes, 1));


  const material = new GridMaterial({
    u_opacity: opacity,
    u_radius: radius,
    u_angle: angle / 180 * Math.PI,
    u_coverage: coverage,
    u_activeColor: fill,
    ...generateLightingUniforms(lights)
  }, {
    SHAPE: false,
    LIGHTING: true
  });
  const hexgonMesh = new THREE.Mesh(geometry, material);
  return hexgonMesh;
}

