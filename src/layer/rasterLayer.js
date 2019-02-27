import Layer from '../core/layer';
import * as THREE from '../core/three';
import RasterSource from '../source/rasterSource';
import RasterMaterial from '../geom/material/rasterMaterial';
import { RasterBuffer } from '../geom/buffer/raster';

export default class RasterLayer extends Layer {
  source(data, cfg = {}) {
    cfg.mapType = this.get('mapType');
    cfg.data = data;
    this.layerSource = new RasterSource(cfg);
    return this;
  }
  render() {
    this.type = 'raster';
    this.init();
    const source = this.layerSource;
    // 加载 完成事件
    const styleOptions = this.get('styleOptions');
    const buffer = new RasterBuffer({
      coordinates: source.geoData,
      raster: source.rasterData,
      rampColors: styleOptions.rampColors
    });
    this.initGeometry(buffer.attributes);
    const material = new RasterMaterial({
      u_texture: buffer.bufferStruct.u_raster,
      u_colorTexture: buffer.bufferStruct.u_colorTexture,
      u_opacity: 1.0,
      u_extent: buffer.bufferStruct.u_extent,
      u_min: source.rasterData.min,
      u_max: source.rasterData.max,
      u_dimension: buffer.attributes.dimension

    });

    const rasterMesh = new THREE.Mesh(this.geometry, material);
    this.add(rasterMesh);
    return this;
  }

  animateFunc() {
    const animateOptions = this.get('animateOptions');
    this.material.setValue('u_bands', this.animateData.index % 3);
    this.material.setValue('u_texture', this.animateData.rasters[ Math.floor(this.animateData.index / 3) % 8]);
    this.animateData.index++;
    if (animateOptions) {
      animateOptions(this.animateData.index);
    }
    setTimeout(() => {
      this.animateId = requestAnimationFrame(this.animateFunc.bind(this));
    }, 500);
  }
  cancelAnimate() {
    window.cancelAnimationFrame(this.animateId);
  }
  initGeometry(attributes) {
    this.geometry = new THREE.BufferGeometry();
    this.geometry.setIndex(attributes.indices);
    this.geometry.addAttribute('position', new THREE.Float32BufferAttribute(attributes.vertices, 3));
    this.geometry.addAttribute('uv', new THREE.Float32BufferAttribute(attributes.uvs, 2));
  }
}
