import * as THREE from '../../../core/three';
import TextMaterial from '../../../geom/material/textMaterial';
import TextBuffer from '../../../geom/buffer/point/text';
import ColorUtil from '../../../attr/color-util';
import CollisionIndex from '../../../util/collision-index';
const defaultTextStyle = {
  fontWeight: 500,
  textAnchor: 'center',
  textOffset: [ 0, 0 ],
  spacing: 2,
  padding: [ 4, 4 ],
  strokeColor: 'white',
  strokeWidth: 2,
  strokeOpacity: 1.0
};
export default function DrawText(layerData, layer) {
  const style = {
    ...defaultTextStyle,
    ...layer.get('styleOptions')
  };
  layer.set('styleOptions', style);
  const activeOption = layer.get('activedOptions');
  const { strokeWidth, strokeColor, opacity } = style;

  const { width, height } = layer.scene.getSize();
  const { geometry, texture, fontAtlas } = _updateGeometry(layerData, layer);
  layer.scene.on('camerachange', () => {
    const { geometry } = _updateGeometry(layerData, layer);
    layer.layerMesh.geometry = geometry;
    layer.layerMesh.geometry.needsUpdate = true;
  });


  const material = new TextMaterial({
    name: layer.layerId,
    u_sdf_map: texture,
    u_halo_color: ColorUtil.toRGB(strokeColor).map(e => e / 255),
    u_halo_width: strokeWidth,
    u_halo_blur: 0.5,
    u_font_opacity: opacity,
    u_sdf_map_size: [ fontAtlas.width, fontAtlas.height ],
    u_viewport_size: [ width, height ],
    u_activeColor: activeOption.fill
  });
  const mesh = new THREE.Mesh(geometry, material);

  // 更新 viewport
  window.addEventListener('resize', () => {
    const { width, height } = layer.scene.getSize();
    material.uniforms.u_viewport_size.value = [ width, height ];
    material.uniforms.needsUpdate = true;
  }, false);

  // 关闭视锥裁剪
  mesh.frustumCulled = false;
  return mesh;
}

function _updateGeometry(layerData, layer) {
  const style = layer.get('styleOptions');
  const {
    fontFamily, fontWeight, spacing, textAnchor, textOffset, padding } = style;
  const { width, height } = layer.scene.getSize();
  const collisionIndex = new CollisionIndex(width, height);
  const { _camera: { projectionMatrix, matrixWorldInverse } } = layer.scene._engine;

  // 计算 MVP 矩阵
  const mvpMatrix = new THREE.Matrix4()
    .copy(projectionMatrix)
    .multiply(matrixWorldInverse);

  const {
    index,
    positions,
    pickingIds,
    texture,
    colors,
    textUVs,
    textOffsets,
    textSizes,
    fontAtlas
  } = new TextBuffer(
    layerData,
    layerData,
    {
      fontFamily,
      fontWeight,
      spacing,
      textAnchor,
      textOffset,
      padding
    },
    layer.scene.fontAtlasManager,
    collisionIndex,
    mvpMatrix
  );

  const geometry = new THREE.BufferGeometry();
  geometry.setIndex(index);
  geometry.addAttribute(
    'a_pos',
    new THREE.Float32BufferAttribute(positions, 2)
  );
  geometry.addAttribute(
    'pickingId',
    new THREE.Float32BufferAttribute(pickingIds, 1)
  );
  geometry.addAttribute(
    'a_color',
    new THREE.Float32BufferAttribute(colors, 4)
  );
  geometry.addAttribute(
    'a_tex',
    new THREE.Float32BufferAttribute(textUVs, 2)
  );
  geometry.addAttribute(
    'a_offset',
    new THREE.Float32BufferAttribute(textOffsets, 2)
  );
  geometry.addAttribute(
    'a_size',
    new THREE.Float32BufferAttribute(textSizes, 1)
  );
  return { geometry, texture, fontAtlas };
}
