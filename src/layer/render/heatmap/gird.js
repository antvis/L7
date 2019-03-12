import * as THREE from '../../../core/three';
import GridMaterial from '../../../geom/material/grid';
export default function DrawGrid(attributes, style) {
  const { opacity, xOffset, yOffset, coverage, activeColor } = style;
  const geometry = new THREE.BufferGeometry();
  geometry.addAttribute('position', new THREE.Float32BufferAttribute(attributes.vertices, 3));
  geometry.addAttribute('miter', new THREE.Float32BufferAttribute(attributes.miter, 2));
  geometry.addAttribute('a_color', new THREE.Float32BufferAttribute(attributes.colors, 4));
  geometry.addAttribute('pickingId', new THREE.Float32BufferAttribute(attributes.pickingIds, 1));
  const material = new GridMaterial({
    u_opacity: opacity,
    u_xOffset: xOffset,
    u_yOffset: yOffset,
    u_coverage: coverage,
    u_activeColor: activeColor
  }, {
    SHAPE: false
  });
  const gridMesh = new THREE.Mesh(geometry, material);
  return gridMesh;
}

