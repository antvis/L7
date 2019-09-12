import * as THREE from '../../../core/three';
import { MeshLineMaterial } from '../../../geom/material/lineMaterial';
import { getBuffer } from '../../../geom/buffer/';

export default function DrawLine(layerData, layer, buffer) {

  const style = layer.get('styleOptions');
  const animateOptions = layer.get('animateOptions');
  const activeOption = layer.get('activedOptions');
  if (!buffer) {
    const geometryBuffer = getBuffer(layer.type, layer.shapeType);
    buffer = new geometryBuffer({
      layerData,
      shapeType: 'line',
      style,
      imagePos: layer.scene.image.imagePos
    });

  }
  const { attributes, indexArray, hasPattern } = buffer;


  const geometry = new THREE.BufferGeometry();
  geometry.setIndex(new THREE.Uint32BufferAttribute(indexArray, 1));
  geometry.addAttribute('pickingId', new THREE.Float32BufferAttribute(attributes.pickingIds, 1));
  geometry.addAttribute('position', new THREE.Float32BufferAttribute(attributes.positions, 3));
  geometry.addAttribute('a_color', new THREE.Float32BufferAttribute(attributes.colors, 4));
  geometry.addAttribute('a_size', new THREE.Float32BufferAttribute(attributes.sizes, 1));
  geometry.addAttribute('normal', new THREE.Float32BufferAttribute(attributes.normals, 3));
  geometry.addAttribute('a_miter', new THREE.Float32BufferAttribute(attributes.miters, 1));
  geometry.addAttribute('a_distance', new THREE.Float32BufferAttribute(attributes.attrDistance, 1));
  geometry.addAttribute('a_dash_array', new THREE.Float32BufferAttribute(attributes.dashArray, 1));
  geometry.addAttribute('a_texture_coord', new THREE.Float32BufferAttribute(attributes.patterns, 2));
  geometry.addAttribute('a_total_distance', new THREE.Float32BufferAttribute(attributes.totalDistances, 1));
  const lineMaterial = new MeshLineMaterial({
    u_opacity: style.opacity,
    u_zoom: layer.scene.getZoom(),
    u_time: 0,
    u_dash_offset: style.dashOffset,
    u_dash_ratio: style.dashRatio,
    activeColor: activeOption.fill,
    u_pattern_spacing: style.patternSpacing || 0,
    u_texture: hasPattern ? layer.scene.image.texture : null,
    blending: style.blending
  }, {
    SHAPE: false,
    ANIMATE: false,
    DASHLINE: style.lineType === 'dash',
    TEXTURE: hasPattern
  });
  const lineMesh = new THREE.Mesh(geometry, lineMaterial);
  if (animateOptions.enable) {
    layer.scene.startAnimate();
    const {
      duration = 2,
      interval = 0.5,
      trailLength = 0.5,
      repeat = Infinity
    } = animateOptions;
    layer.animateDuration =
    layer.scene._engine.clock.getElapsedTime() + duration * repeat;
    lineMaterial.updateUninform({
      u_duration: duration,
      u_interval: interval,
      u_trailLength: trailLength
    });
    lineMaterial.setDefinesvalue('ANIMATE', true);
    // lineMaterial.setDefinesvalue('DASHLINE', true);
  }
  return lineMesh;
}
