import * as THREE from '../../../core/three';
import { LineMaterial } from '../../../geom/material/lineMaterial';
export default function DrawPolygonLine(attributes, style) {
  const { opacity } = style;
  const geometry = new THREE.BufferGeometry();
  geometry.addAttribute('position', new THREE.Float32BufferAttribute(attributes.vertices, 3));
  geometry.addAttribute('a_color', new THREE.Float32BufferAttribute(attributes.colors, 4));
  geometry.addAttribute('pickingId', new THREE.Float32BufferAttribute(attributes.pickingIds, 1));
  const lineMaterial = new LineMaterial({
    u_opacity: opacity
  }, {
    SHAPE: false
  });
  const polygonLineMesh = new THREE.LineSegments(geometry, lineMaterial);
  return polygonLineMesh;
}
