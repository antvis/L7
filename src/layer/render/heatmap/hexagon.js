import * as THREE from '../../../core/three';
import hexagonBuffer from '../../../geom/buffer/heatmap/hexagon';
import GridMaterial from '../../../geom/material/hexagon';
export default function DrawHexagon(layerdata, layer, source) {
  const style = layer.get('styleOptions');
  const { fill } = layer.get('activedOptions');
  const { radius } = source.data;
  const attributes = new hexagonBuffer(layerdata);
  const { opacity, angle, coverage } = style;
  const geometry = new THREE.BufferGeometry();
  geometry.addAttribute('position', new THREE.Float32BufferAttribute(attributes.vertices, 3));
  geometry.addAttribute('miter', new THREE.Float32BufferAttribute(attributes.miter, 2));
  geometry.addAttribute('a_color', new THREE.Float32BufferAttribute(attributes.colors, 4));
  geometry.addAttribute('pickingId', new THREE.Float32BufferAttribute(attributes.pickingIds, 1));
  const material = new GridMaterial({
    u_opacity: opacity,
    u_radius: radius,
    u_angle: angle / 180 * Math.PI,
    u_coverage: coverage,
    u_activeColor: fill
  }, {
    SHAPE: false
  });
  const hexgonMesh = new THREE.Mesh(geometry, material);
  return hexgonMesh;
}

