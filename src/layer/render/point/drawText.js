import * as THREE from '../../../core/three';
import TextMaterial from '../../../geom/material/textMaterial';

export default function DrawText(attributes, style) {
  const geometry = new THREE.BufferGeometry();
  geometry.addAttribute(
    'position',
    new THREE.Float32BufferAttribute(attributes.originPoints, 3)
  );
  geometry.addAttribute(
    'uv',
    new THREE.Float32BufferAttribute(attributes.textureElements, 2)
  );
  geometry.addAttribute(
    'a_txtsize',
    new THREE.Float32BufferAttribute(attributes.textSizes, 2)
  );
  geometry.addAttribute(
    'a_txtOffsets',
    new THREE.Float32BufferAttribute(attributes.textOffsets, 2)
  );
  geometry.addAttribute(
    'a_color',
    new THREE.Float32BufferAttribute(attributes.colors, 4)
  );
  geometry.addAttribute(
    'pickingId',
    new THREE.Float32BufferAttribute(attributes.pickingIds, 1)
  );
  const { strokeWidth, width, stroke, height, opacity, activeColor } = style;
  const material = new TextMaterial({
    name: this.layerId,
    u_texture: attributes.texture,
    u_strokeWidth: strokeWidth,
    u_stroke: stroke,
    u_textTextureSize: [
      attributes.fontAtlas.width,
      attributes.fontAtlas.height
    ],
    u_gamma: (1.0 / 12.0) * (1.4142135623730951 / (2.0)),
    u_buffer: 0.75,
    u_opacity: opacity,
    u_glSize: [ width, height ],
    u_activeColor: activeColor
  });
  const mesh = new THREE.Mesh(geometry, material);
  return mesh;
}
