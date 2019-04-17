import * as THREE from '../../../core/three';
import ImageMaterial from '../../../geom/material/imageMaterial';
export default function DrawImage(attributes, style) {
  this.geometry = new THREE.BufferGeometry();
  this.geometry.addAttribute('position', new THREE.Float32BufferAttribute(attributes.vertices, 3));
  this.geometry.addAttribute('uv', new THREE.Float32BufferAttribute(attributes.uvs, 2));
  const { opacity } = style;
  const material = new ImageMaterial({
    u_texture: attributes.texture,
    u_opacity: opacity
  });
  return new THREE.Mesh(this.geometry, material);
}
