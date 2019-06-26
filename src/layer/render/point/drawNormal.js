/**
 * 原生点绘制
 */
import * as THREE from '../../../core/three';
import * as PointBuffer from '../../../geom/buffer/point/index';
import PointMaterial from '../../../geom/material/pointMaterial';
export default function DrawNormal(layerData, layer) {
  const geometry = new THREE.BufferGeometry();
  const style = layer.get('styleOptions');
  const activeOption = layer.get('activedOptions');
  const { opacity } = style;
  const attributes = PointBuffer.NormalBuffer(layerData, style);
  geometry.addAttribute('position', new THREE.Float32BufferAttribute(attributes.vertices, 3));
  geometry.addAttribute('a_color', new THREE.Float32BufferAttribute(attributes.colors, 4));
  geometry.addAttribute('pickingId', new THREE.Float32BufferAttribute(attributes.pickingIds, 1));
  geometry.addAttribute('a_size', new THREE.Float32BufferAttribute(attributes.sizes, 1));
  const material = new PointMaterial({
    u_opacity: opacity,
    u_activeColor: activeOption.fill
  }, {
    SHAPE: false,
    TEXCOORD_0: false
  });
  const strokeMesh = new THREE.Points(geometry, material);
  return strokeMesh;
}
