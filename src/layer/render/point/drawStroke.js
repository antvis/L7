/**
 * @author lzxue
 * @email lzx199065@gmail.com
 * @create date 2018-11-29 16:35:34
 * @modify date 2018-11-29 16:35:34
 * @desc [description] 绘制图形的边框
*/

import PointLineMaterial from '../../../geom/material/pointLineMaterial';
import * as PointBuffer from '../../../geom/buffer/point/index';
import * as THREE from '../../../core/three';
export default function DrawStroke(layerData, layer) {
  const style = layer.get('styleOptions');
  const activeOption = layer.get('activedOptions');
  const { strokeWidth, stroke, strokeOpacity } = style;
  const attributes = PointBuffer.StrokeBuffer(layerData, style);
  const geometry = new THREE.BufferGeometry();
  geometry.setIndex(attributes.indexArray);
  geometry.addAttribute('position', new THREE.Float32BufferAttribute(attributes.positions, 3));
  geometry.addAttribute('a_shape', new THREE.Float32BufferAttribute(attributes.shapes, 3));
  geometry.addAttribute('a_size', new THREE.Float32BufferAttribute(attributes.sizes, 3));
  geometry.addAttribute('normal', new THREE.Float32BufferAttribute(attributes.normal, 3));
  geometry.addAttribute('a_miter', new THREE.Float32BufferAttribute(attributes.miter, 1));
  geometry.addAttribute('pickingId', new THREE.Float32BufferAttribute(attributes.pickingIds, 1));
  geometry.addAttribute('a_color', new THREE.Float32BufferAttribute(attributes.colors, 4));
  const material = new PointLineMaterial({
    u_strokeOpacity: strokeOpacity,
    u_stroke: stroke,
    u_strokeWidth: strokeWidth,
    u_activeColor: activeOption.fill
  });
  const strokeMesh = new THREE.Mesh(geometry, material);
  return strokeMesh;
}
