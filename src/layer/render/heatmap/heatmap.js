import HeatmapBuffer from '../../../geom/buffer/heatmap/heatmap';
import { createColorRamp } from '../../../geom/buffer/heatmap/heatmap';
import { HeatmapIntensityMaterial, HeatmapColorizeMaterial } from '../../../geom/material/heatmapMateial';
// import Renderpass from '../../../core/engine/renderpass.bak';
import RenderPass from '../../../core/engine/renderpass';
import ShaderPass from '../../../core/engine/ShaderPass';
import EffectComposer from '../../../core/engine/EffectComposer';
import * as THREE from '../../../core/three';

export function drawHeatmap(layer) {

  const colors = layer.get('styleOptions').rampColors;
  layer.colorRamp = createColorRamp(colors);
  const heatmap = new heatmapPass(layer);
  const copy = new copyPass(layer);
  copy.renderToScreen = true;
  const composer = new EffectComposer(layer.scene._engine._renderer, layer.scene._container);
  composer.addPass(heatmap);
  composer.addPass(copy);
  layer.add(composer);

}


function heatmapPass(layer) {
  const scene = new THREE.Scene();
  const style = layer.get('styleOptions');
  const data = layer.layerData;
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
    intensity: style.intensity,
    radius: style.radius,
    zoom: layer.scene.getZoom()
  });
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
    colorRamp: layer.colorRamp,
    opacity: style.opacity
  });
  const copyPass = new ShaderPass(material, 'u_texture');
  return copyPass;
}
