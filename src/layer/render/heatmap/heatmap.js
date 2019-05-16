import HeatmapBuffer from '../../../geom/buffer/heatmap/heatmap';
import { createColorRamp } from '../../../geom/buffer/heatmap/heatmap';
import { HeatmapIntensityMaterial, HeatmapColorizeMaterial } from '../../../geom/material/heatmapMaterial';
// import Renderpass from '../../../core/engine/renderpass.bak';
import RenderPass from '../../../core/engine/render-pass';
import ShaderPass from '../../../core/engine/shader-pass';
import EffectComposer from '../../../core/engine/effect-composer';
import * as THREE from '../../../core/three';

export default function DrawHeatmap(layerdata, layer) {

  const colors = layer.get('styleOptions').rampColors;

  layer.rampColors = createColorRamp(colors);
  const heatmap = new heatmapPass(layerdata, layer);
  const copy = new copyPass(layer);
  copy.renderToScreen = true;
  const composer = new EffectComposer(layer.scene._engine._renderer, layer.scene._container);
  composer.addPass(heatmap);
  composer.addPass(copy);
  layer.scene._engine.update();
  layer._updateStyle = style => {
    if (style.rampColors) {
      style.rampColors = createColorRamp(style.rampColors);
    }
    const newOption = { };
    for (const key in style) {
      newOption['u_' + key] = style[key];
    }
    heatmap.scene.children[0].material.updateUninform(newOption);
    copy.scene.children[0].material.updateUninform(newOption);
  };
  return composer;

}

function heatmapPass(layerdata, layer) {
  const scene = new THREE.Scene();
  const style = layer.get('styleOptions');
  const data = layerdata;
  const camera = layer.scene._engine._camera;
  // get attributes data
  const buffer = new HeatmapBuffer({
    data
  });
  const attributes = buffer.attributes;
  // create geometery
  const geometry = new THREE.BufferGeometry();
  // geometry.setIndex(attributes.indices);
  geometry.addAttribute('position', new THREE.Float32BufferAttribute(attributes.vertices, 3));
  geometry.addAttribute('a_dir', new THREE.Float32BufferAttribute(attributes.dirs, 2));
  geometry.addAttribute('a_weight', new THREE.Float32BufferAttribute(attributes.weights, 1));
  const material = new HeatmapIntensityMaterial({
    u_intensity: style.intensity,
    u_radius: style.radius,
    u_zoom: layer.scene.getZoom()
  }, {});
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);
  scene.onBeforeRender = () => { // 每次渲染前改变状态
    const zoom = layer.scene.getZoom();
    mesh.material.setUniformsValue('u_zoom', zoom);
  };
  const pass = new RenderPass(scene, camera);
  return pass;
}
function copyPass(layer) {
  const style = layer.get('styleOptions');
  const material = new HeatmapColorizeMaterial({
    u_rampColors: layer.rampColors,
    u_opacity: style.opacity || 1.0
  }, {});
  const copyPass = new ShaderPass(material, 'u_texture');
  return copyPass;
}
