import * as THREE from '../../../core/three';
import PolygonMaterial from '../../../geom/material/polygonMaterial';
export default function DrawPolygonFill(attributes, style) {
  const { opacity } = style;
  const geometry = new THREE.BufferGeometry();
  geometry.addAttribute('position', new THREE.Float32BufferAttribute(attributes.vertices, 3));
  geometry.addAttribute('a_color', new THREE.Float32BufferAttribute(attributes.colors, 4));
  geometry.addAttribute('pickingId', new THREE.Float32BufferAttribute(attributes.pickingIds, 1));
  geometry.addAttribute('normal', new THREE.Float32BufferAttribute(attributes.normals, 3));
  const material = new PolygonMaterial({
    u_opacity: opacity
  }, {
    SHAPE: false
  });
  const fillPolygonMesh = new THREE.Mesh(geometry, material);
  return fillPolygonMesh;
}

