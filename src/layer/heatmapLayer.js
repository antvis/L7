import Layer from '../core/layer';
import HeatmapBuffer from '../geom/buffer/heatmap';
import { createColorRamp } from '../geom/buffer/heatmap';
import { HeatmapIntensityMaterial, HeatmapColorizeMaterial } from '../geom/material/heatmapMateial';
import Renderpass from '../core/engine/renderpass';
import * as THREE from '../core/three';

export default class HeatmapLayer extends Layer {

  render() {
    this.init();
    const bbox = this._calBoundingBox(this.layerData);
    const colors = this.get('styleOptions').rampColors;
    this.colorRamp = createColorRamp(colors);
    this._createIntensityPass(bbox);
    this._createColorizePass(bbox);
  }

  _createIntensityPass(bbox) {
    const style = this.get('styleOptions');
    const data = this.layerData;
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
      zoom: this.scene.getZoom()
    });
    const mesh = new THREE.Mesh(geometry, material);
    // set camera
    const passOrth = new THREE.OrthographicCamera(bbox.width / -2, bbox.width / 2, bbox.height / 2, bbox.height / -2, 1, 10000);
    passOrth.position.set(bbox.minX + bbox.width / 2, bbox.minY + bbox.height / 2, 1000);
    // renderpass
    const renderpass = new Renderpass({
      renderer: this.scene._engine._renderer,
      camera: passOrth,
      size: {
        width: 10000,
        height: 10000 * (bbox.height / bbox.width)
      },
      clear: {
        clearColor: 0x000000,
        clearAlpha: 1.0
      }
    });
    renderpass.add(mesh);
    renderpass.render();
    this.intensityPass = renderpass;
    const scene = this.scene;
    render();
    function render() {
      requestAnimationFrame(render);
      renderpass.render();
      mesh.material.uniforms.u_zoom.value = scene.getZoom();
    }
  }
  _createColorizePass(bbox) {
    // create plane geometry
    const geometery = new THREE.PlaneBufferGeometry(bbox.width, bbox.height);
    const material = new HeatmapColorizeMaterial({
      texture: this.intensityPass.texture,
      colorRamp: this.colorRamp
    });
    const mesh = new THREE.Mesh(geometery, material);
    mesh.position.set(bbox.minX + bbox.width / 2, bbox.minY + bbox.height / 2, 0.0);
    this.add(mesh);
  }

  _calBoundingBox(data) {
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


}
