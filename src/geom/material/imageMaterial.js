import * as THREE from '../../core/three';
import image_frag from '../shader/image_frag.glsl';
import image_vert from '../shader/image_vert.glsl';
export default function ImageMaterial(options) {
  const material = new THREE.ShaderMaterial({
    uniforms: {
      u_opacity: { value: options.u_opacity },
      u_texture: { value: options.u_texture }
    },
    vertexShader: image_vert,
    fragmentShader: image_frag,
    transparent: true
  });
    // material.roughness = 1;
    // material.metalness = 0.1;
    // material.envMapIntensity = 3;
  return material;
}
