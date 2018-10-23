import * as THREE from '../../three';
import picking_frag from './picking_frag.glsl';
import picking_vert from './picking_vert.glsl';

// FROM: https://github.com/brianxu/GPUPicker/blob/master/GPUPicker.js
const PickingMaterial = function() {
  THREE.ShaderMaterial.call(this, {
    uniforms: {
      size: {
        type: 'f',
        value: 0.01
      },
      scale: {
        type: 'f',
        value: 400
      }
    },
    vertexShader: picking_vert,
    fragmentShader: picking_frag
  });

  this.linePadding = 2;
};

PickingMaterial.prototype = Object.create(THREE.ShaderMaterial.prototype);

PickingMaterial.prototype.constructor = PickingMaterial;

PickingMaterial.prototype.setPointSize = function(size) {
  this.uniforms.size.value = size;
};

PickingMaterial.prototype.setPointScale = function(scale) {
  this.uniforms.scale.value = scale;
};

export default PickingMaterial;
