/**
 * 绘制 SDF，不仅是圆形
 * 手动构建点阵坐标系，便于实现描边、反走样效果
 */
import * as THREE from '../../../core/three';
import CircleMaterial from '../../../geom/material/circleMaterial';
import { getBuffer } from '../../../geom/buffer/';
export default function drawCircle(layerData, layer, buffer) {
  const style = layer.get('styleOptions');
  const activeOption = layer.get('activedOptions');
  if (!buffer) {
    const geometryBuffer = getBuffer(layer.type, layer.shapeType);
    buffer = new geometryBuffer({
      layerData
    });

  }
  // const { aPosition, aPackedData } = buffer.attributes;
  const { attributes, indexArray } = buffer;
  const geometry = new THREE.BufferGeometry();

  if (buffer.indexArray) {
    geometry.setIndex(new THREE.Uint32BufferAttribute(indexArray, 1));
  }
  // geometry.addAttribute('position', new THREE.Float32BufferAttribute(aPosition, 3));
  geometry.addAttribute('position', new THREE.Float32BufferAttribute(attributes.positions, 3));
  geometry.addAttribute('a_color', new THREE.Float32BufferAttribute(attributes.colors, 4));
  geometry.addAttribute('pickingId', new THREE.Float32BufferAttribute(attributes.pickingIds, 1));
  geometry.addAttribute('miter', new THREE.Float32BufferAttribute(attributes.miters, 2));
  geometry.addAttribute('a_size', new THREE.Float32BufferAttribute(attributes.sizes, 1));
  geometry.addAttribute('a_shape', new THREE.Float32BufferAttribute(attributes.shapes, 1));
  // geometry.addAttribute('a_packed_data', new THREE.Float32BufferAttribute(aPackedData, 4));
  const material = new CircleMaterial({
    u_opacity: style.opacity,
    u_activeColor: activeOption.fill,
    u_zoom: layer.scene.getZoom(),
    u_stroke: style.stroke,
    u_strokeWidth: style.strokeWidth,
    u_strokeOpacity: style.strokeOpacity
  });
  material.depthTest = false;
  material.setBending(style.blending || 'normal');
  const fillMesh = new THREE.Mesh(geometry, material);
  return fillMesh;
}
