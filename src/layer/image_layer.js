import Layer from '../core/layer';
import * as THREE from '../core/three';
import ImageBuffer from '../geom/buffer/image';
// import ImageGeometry from '../geom/bufferGeometry/image';
import ImageMaterial from '../geom/material/imageMaterial';
export default class imageLayer extends Layer {
  draw() {
    this.type = 'image';
    const source = this.layerSource;
    const { opacity } = this.get('styleOptions');
    // 加载 完成事件
    source.originData.images.then(images => {
      this.layerData[0].images = images;
      const buffer = new ImageBuffer({
        layerData: this.layerData
      });
      this.initGeometry(buffer.attributes);
      const material = new ImageMaterial({
        u_texture: buffer.texture,
        u_opacity: opacity
      });
      const imageMesh = new THREE.Mesh(this.geometry, material);
      this.add(imageMesh);

    });
    return this;
  }
  initGeometry(attributes) {
    this.geometry = new THREE.BufferGeometry();
    this.geometry.addAttribute('position', new THREE.Float32BufferAttribute(attributes.vertices, 3));
    this.geometry.addAttribute('uv', new THREE.Float32BufferAttribute(attributes.uvs, 2));
  }
}
