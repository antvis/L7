import * as THREE from '../../../core/three';
import { ArcLineMaterial } from '../../../geom/material/lineMaterial';
export default function DrawArcLine(attributes, cfg, layer) {
  const { style, activeOption } = cfg;
  const { opacity, zoom } = style;
  const geometry = new THREE.BufferGeometry();
  geometry.setIndex(attributes.indexArray);
  geometry.addAttribute('position', new THREE.Float32BufferAttribute(attributes.positions, 3));
  geometry.addAttribute('a_color', new THREE.Float32BufferAttribute(attributes.colors, 4));
  geometry.addAttribute('a_instance', new THREE.Float32BufferAttribute(attributes.instances, 4));
  geometry.addAttribute('a_size', new THREE.Float32BufferAttribute(attributes.sizes, 1));
  const lineMaterial = new ArcLineMaterial({
    u_opacity: opacity,
    u_zoom: zoom,
    activeColor: activeOption.fill
  }, {
    SHAPE: false
  });
  const arcMesh = new THREE.Mesh(geometry, lineMaterial);
  layer.add(arcMesh);
}
