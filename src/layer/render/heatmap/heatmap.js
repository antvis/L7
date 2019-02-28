import HeatmapBuffer from '../../../geom/buffer/heatmap/heatmap';
import { createColorRamp } from '../../../geom/buffer/heatmap/heatmap';
import { HeatmapIntensityMaterial, HeatmapColorizeMaterial } from '../../../geom/material/heatmapMateial';
import Renderpass from '../../../core/engine/renderpass';
import * as THREE from '../../../core/three';

export default function drawHeatmap(layer) {
  const bbox = calBoundingBox(layer.layerData);
  const colors = layer.get('styleOptions').rampColors;
  layer.colorRamp = createColorRamp(colors);
  createIntensityPass(layer, bbox);
  createColorizePass(layer, bbox);
}

function createIntensityPass(layer, bbox) {
  const style = layer.get('styleOptions');
  const data = layer.layerData;
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
    // set material
  const material = new HeatmapIntensityMaterial({
    intensity: style.intensity,
    radius: style.radius,
    zoom: layer.scene.getZoom()
  });
  const mesh = new THREE.Mesh(geometry, material);
    // set camera
  const passOrth = new THREE.OrthographicCamera(bbox.width / -2, bbox.width / 2, bbox.height / 2, bbox.height / -2, 1, 10000);
  passOrth.position.set(bbox.minX + bbox.width / 2, bbox.minY + bbox.height / 2, 1000);
    // renderpass
  const renderer = layer.scene._engine._renderer;
  // get extension for bilinear texture interpolation:https://threejs.org/docs/#api/en/textures/DataTexture
  const gl = renderer.domElement.getContext('webgl') ||
    renderer.domElement.getContext('experimental-webgl');
  gl.getExtension('OES_texture_float_linear');
  const renderpass = new Renderpass({
    renderer,
    camera: passOrth,
    size: {
      width: 2000,
      height: 2000 * (bbox.height / bbox.width)
    },
    clear: {
      clearColor: 0x000000,
      clearAlpha: 0.0
    },
    renderCfg: {
      wrapS: THREE.ClampToEdgeWrapping,
      wrapT: THREE.ClampToEdgeWrapping,
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      format: THREE.RGBAFormat,
      stencilBuffer: false,
      depthBuffer: false
    }
  });
  renderpass.add(mesh);
  renderpass.render();
  layer.intensityPass = renderpass;
  const scene = layer.scene;
  render();
  function render() {
    requestAnimationFrame(render);
    const zoom = scene.getZoom();
    mesh.material.uniforms.u_zoom.value = zoom;
    const passWidth = Math.min(10000, Math.pow(zoom, 2.0) * 200);
    const passHeight = passWidth * (bbox.height / bbox.width);
    renderpass.pass.setSize(passWidth, passHeight);
    renderpass.render();
  }
}
function createColorizePass(layer, bbox) {
    // create plane geometry
  const geometery = new THREE.PlaneBufferGeometry(bbox.width, bbox.height);
  const material = new HeatmapColorizeMaterial({
    texture: layer.intensityPass.texture,
    colorRamp: layer.colorRamp
  });
  const mesh = new THREE.Mesh(geometery, material);
  mesh.position.set(bbox.minX + bbox.width / 2, bbox.minY + bbox.height / 2, 0.0);
  layer.add(mesh);
}

function calBoundingBox(data) {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  for (let i = 0; i < data.length; i++) {
    const p = data[i].coordinates;
    if (p[0] < minX) {
      minX = p[0];
    } else if (p[0] > maxX) {
      maxX = p[0];
    }
    if (p[1] < minY) {
      minY = p[1];
    } else if (p[1] > maxY) {
      maxY = p[1];
    }
  }
  const width = maxX - minX;
  const height = maxY - minY;

  return {
    minX,
    maxX,
    minY,
    maxY,
    width,
    height
  };
}

