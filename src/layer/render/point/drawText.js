import * as THREE from '../../../core/three';
import TextMaterial from '../../../geom/material/textMaterial';
export default function DawText(attributes, style) {
  const geometry = new THREE.BufferGeometry();
  const { strokeWidth, stroke, opacity } = style;
  geometry.addAttribute('position', new THREE.Float32BufferAttribute(attributes.originPoints, 3));
  geometry.addAttribute('uv', new THREE.Float32BufferAttribute(attributes.textureElements, 2));
  geometry.addAttribute('a_txtsize', new THREE.Float32BufferAttribute(attributes.textSizes, 2));
  geometry.addAttribute('a_txtOffsets', new THREE.Float32BufferAttribute(attributes.textOffsets, 2));
  geometry.addAttribute('a_color', new THREE.Float32BufferAttribute(attributes.colors, 4));
  const material = new TextMaterial({
    name: this.layerId,
    u_texture: buffer.bufferStruct.textTexture,
    u_strokeWidth: 1,
    u_stroke: stroke,
    u_textSize: buffer.bufferStruct.textSize,
    u_gamma: 0.11,
    u_buffer: 0.8,
    u_color: color,
    u_glSize: [ width, height ]
  });
  const mesh = new THREE.Mesh(geometry, material);
}
