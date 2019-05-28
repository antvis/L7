/**
 * @author lzxue
 * @email lzx199065@gmail.com
 * @create date 2018-11-29 16:07:24
 * @modify date 2018-11-29 16:07:24
 * @desc [description] 绘制点图层的面状填充，圆，三角形，六边形
*/
import * as THREE from '../../../core/three';
import PolygonMaterial from '../../../geom/material/polygonMaterial';
export default function DrawFill(attributes, style) {
  const { opacity, activeColor } = style;
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
    u_opacity: opacity,
    u_activeColor: activeColor
  }, {
    SHAPE: true
  });
  material.setDefinesvalue('SHAPE', true);
  material.depthTest = false;
  const fillMesh = new THREE.Mesh(geometry, material);
  // const fillMesh = new THREE.Mesh(instancedGeometry, material);
  return fillMesh;

}
