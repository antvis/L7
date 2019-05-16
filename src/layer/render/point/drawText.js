import * as THREE from '../../../core/three';
import TextMaterial from '../../../geom/material/textMaterial';
import TextBuffer from '../../../geom/buffer/point/text';

export default function DrawText(layerData, layer) {
  const style = layer.get('styleOptions');
  const activeOption = layer.get('activedOptions');
  const { width, height } = layer.scene.getSize();
  const attributes = new TextBuffer(
    layerData,
    layer.scene.fontAtlasManager
  );
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
  const { strokeWidth, stroke, opacity } = style;
  const material = new TextMaterial({
    name: layer.layerId,
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
    u_activeColor: activeOption.fill
  });
  const mesh = new THREE.Mesh(geometry, material);
  return mesh;
}
