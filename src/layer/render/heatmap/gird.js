import * as THREE from '../../../core/three';
import gridBuffer from '../../../geom/buffer/heatmap/grid';
import GridMaterial from '../../../geom/material/grid';
export default function DrawGrid(layerdata, layer, source) {
  const { opacity, coverage } = layer.get('styleOptions');
  const activeOption = layer.get('activedOptions');
  const { xOffset, yOffset } = source.data;
  const attributes = new gridBuffer(layerdata);
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
    u_activeColor: activeOption.fill
  }, {
    SHAPE: false
  });
  const gridMesh = new THREE.Mesh(geometry, material);
  return gridMesh;
}

