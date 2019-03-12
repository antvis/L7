import Material from './material';
import { getModule } from '../../util/shaderModule';
export default function ImageMaterial(options) {
  const { vs, fs } = getModule('raster');
  const material = new Material({
    uniforms: {
      u_opacity: { value: options.u_opacity },
      u_texture: { value: options.u_texture },
      u_colorTexture: { value: options.u_colorTexture },
      u_min: { value: options.u_min },
      u_max: { value: options.u_max },
      u_extent: { value: options.u_extent },
      u_dimension: { value: options.u_dimension }

    },
    vertexShader: vs,
    fragmentShader: fs,
    transparent: false
  });
  // material.roughness = 1;
  // material.metalness = 0.1;
  // material.envMapIntensity = 3;
  return material;
}
