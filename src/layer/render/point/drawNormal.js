
import * as THREE from '../../../core/three';
import PointMaterial from '../../../geom/material/pointMaterial';
export default function DrawNormal(attributes, style) {
  const geometry = new THREE.BufferGeometry();
  const { opacity } = style;
  geometry.addAttribute('position', new THREE.Float32BufferAttribute(attributes.vertices, 3));
  geometry.addAttribute('a_color', new THREE.Float32BufferAttribute(attributes.colors, 4));
  geometry.addAttribute('pickingId', new THREE.Float32BufferAttribute(attributes.pickingIds, 1));
  geometry.addAttribute('a_size', new THREE.Float32BufferAttribute(attributes.sizes, 1));
  const material = new PointMaterial({
    u_opacity: opacity
  }, {
    SHAPE: false,
    TEXCOORD_0: false
  });
  const strokeMesh = new THREE.Points(geometry, material);
  return strokeMesh;
}
