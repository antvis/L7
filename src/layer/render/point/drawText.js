import * as THREE from '../../../core/three';
import TextMaterial from '../../../geom/material/textMaterial';
export default function DrawText(attributes, style) {
  const instancedGeometry = new THREE.InstancedBufferGeometry();
  // instancedGeometry.copy(new buildTextbufferGeometry());
  instancedGeometry.copy(new THREE.PlaneBufferGeometry(2, 2));
  const { strokeWidth, width, stroke, height, opacity, activeColor } = style;
  instancedGeometry.addAttribute('a_position', new THREE.InstancedBufferAttribute(new Float32Array(attributes.vertices), 3));
  instancedGeometry.addAttribute('a_textSize', new THREE.InstancedBufferAttribute(new Float32Array(attributes.textSizes), 2));
  instancedGeometry.addAttribute('a_textOffset', new THREE.InstancedBufferAttribute(new Float32Array(attributes.textOffsets), 2));
  instancedGeometry.addAttribute('a_color', new THREE.InstancedBufferAttribute(new Float32Array(attributes.colors), 4));
  instancedGeometry.addAttribute('a_size', new THREE.InstancedBufferAttribute(new Float32Array(attributes.textSizes), 1));
  instancedGeometry.addAttribute('pickingId', new THREE.InstancedBufferAttribute(new Float32Array(attributes.pickingIds), 1));
  instancedGeometry.addAttribute('textUv', new THREE.InstancedBufferAttribute(new Float32Array(attributes.textUv), 4));
  const material = new TextMaterial({
    name: this.layerId,
    u_texture: attributes.texture,
    u_strokeWidth: strokeWidth,
    u_stroke: stroke,
    u_textTextureSize: [ attributes.fontAtlas.width, attributes.fontAtlas.height ],
    u_gamma: 0.02,
    u_buffer: 0.75,
    u_opacity: opacity,
    u_glSize: [ width, height ],
    u_activeColor: activeColor
  });
  const textMesh = new THREE.Mesh(instancedGeometry, material);
  return textMesh;
}
