/**
 * @author lzxue
 * @email lzx199065@gmail.com
 * @create date 2018-11-29 16:07:24
 * @modify date 2018-11-29 16:07:24
 * @desc [description] 绘制点图层的面状填充，圆，三角形，六边形
*/
import * as THREE from '../../../core/three';
import * as PointBuffer from '../../../geom/buffer/point/index';
import DrawStroke from './drawStroke';
import PolygonMaterial from '../../../geom/material/polygonMaterial';
import { generateLightingUniforms } from '../../../util/shaderModule';
export default function DrawFill(layerData, layer) {
  const style = layer.get('styleOptions');
  const activeOption = layer.get('activedOptions');
  const attributes = PointBuffer.FillBuffer(layerData, style);
  const geometry = new THREE.BufferGeometry();
  geometry.addAttribute('position', new THREE.Float32BufferAttribute(attributes.vertices, 3));
  geometry.addAttribute('a_color', new THREE.Float32BufferAttribute(attributes.colors, 4));
  geometry.addAttribute('pickingId', new THREE.Float32BufferAttribute(attributes.pickingIds, 1));
  geometry.addAttribute('normal', new THREE.Float32BufferAttribute(attributes.normals, 3));
  geometry.addAttribute('a_shape', new THREE.Float32BufferAttribute(attributes.shapePositions, 3));
  geometry.addAttribute('a_size', new THREE.Float32BufferAttribute(attributes.a_size, 3));

  // const instancedGeometry = new THREE.InstancedBufferGeometry();

  // instancedGeometry.addAttribute('normal', new THREE.Float32BufferAttribute(attributes.normals, 3));
  // instancedGeometry.addAttribute('a_shape', new THREE.Float32BufferAttribute(attributes.shapePositions, 3));
  // // instanced attributes
  // instancedGeometry.addAttribute('position', new THREE.InstancedBufferAttribute(new Float32Array(attributes.vertices), 3));
  // instancedGeometry.addAttribute('a_color', new THREE.InstancedBufferAttribute(new Float32Array(attributes.colors), 4));
  // instancedGeometry.addAttribute('pickingId', new THREE.InstancedBufferAttribute(new Float32Array(attributes.pickingIds), 1));
  // instancedGeometry.addAttribute('a_size', new THREE.InstancedBufferAttribute(new Float32Array(attributes.a_size), 3));

  const material = new PolygonMaterial({
    u_opacity: style.opacity,
    u_activeColor: activeOption.fill,
    u_zoom: layer.scene.getZoom(),
    ...generateLightingUniforms(style.lights)
  }, {
    SHAPE: true,
    LIGHTING: true
  });
  material.setDefinesvalue('SHAPE', true);
  material.depthTest = false;
  material.setBending(style.blending);
  const fillMesh = new THREE.Mesh(geometry, material);
  if (style.stroke !== 'none') {
    // 是否绘制边界
    const meshStroke = DrawStroke(layerData, layer);
    fillMesh.add(meshStroke);
  }
  // const fillMesh = new THREE.Mesh(instancedGeometry, material);
  return fillMesh;

}
