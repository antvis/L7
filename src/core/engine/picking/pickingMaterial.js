import Material from '../../../geom/material/material';
import picking_frag from './picking_frag.glsl';
// import picking_vert from './picking_vert.glsl';

export default function PickingMaterial(options) {
  const material = new Material({
    uniforms: {
      u_zoom: { value: options.u_zoom || 1 }
    },
    vertexShader: options.vs,
    fragmentShader: picking_frag,
    transparent: false
  });
  return material;
}
