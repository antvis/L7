import Layer from '../core/layer';
import { getRender } from './render/';
import CollisionIndex from '../util/collision-index';
export default class TextLayer extends Layer {
  shape(textField, shape = 'text') {
    this.textField = textField;
    this.shape = shape;

    // 创建碰撞检测索引
    const { width, height } = this.scene.getSize();
    this.collisionIndex = new CollisionIndex(width, height);

    // 相机变化，需要重新构建索引，由于文本可见性的改变，也需要重新组装顶点数据
    this.scene.on('cameraloaded', () => {
      this.collisionIndex = new CollisionIndex(width, height);

      this.layerMesh.geometry = getRender(this.type, this.shape)(this.layerData, this, true);
      this.layerMesh.geometry.needsUpdate = true;
    });

    return this;
  }
  draw() {
    this.init();
    this.type = 'text';
    this.add(getRender(this.type, this.shape)(this.layerData, this));
  }
}
