import Util from '../../util';
import { updateObjecteUniform } from '../../util/object3d-util';
export default class BufferController {
  constructor(cfg) {
    // defs 列定义
    Util.assign(this, cfg);
    if (!this.mesh) this.mesh = this.layer;
  }

  _updateColorAttributes() {
    const filterData = this.mesh.layerData;
    const colorKey = {};
    for (let e = 0; e < filterData.length; e++) {
      const item = filterData[e];
      colorKey[item.id] = item.color;
    }
    this.layer._activeIds = null; // 清空选中元素xwxw
    const colorAttr = this.mesh.mesh.geometry.attributes.a_color;
    const pickAttr = this.mesh.mesh.geometry.attributes.pickingId;
    pickAttr.array.forEach((id, index) => {
      id = Math.abs(id);
      const color = colorKey[id];
      id = Math.abs(id);
      const item = filterData[id - 1];
      if (item.hasOwnProperty('filter') && item.filter === false) {
        colorAttr.array[index * 4 + 0] = 0;
        colorAttr.array[index * 4 + 1] = 0;
        colorAttr.array[index * 4 + 2] = 0;
        colorAttr.array[index * 4 + 3] = 0;
        pickAttr.array[index] = -id; // 通过Id数据过滤 id<0 不显示
      } else {
        colorAttr.array[index * 4 + 0] = color[0];
        colorAttr.array[index * 4 + 1] = color[1];
        colorAttr.array[index * 4 + 2] = color[2];
        colorAttr.array[index * 4 + 3] = color[3];
        pickAttr.array[index] = id;
      }
    });
    colorAttr.needsUpdate = true;
    pickAttr.needsUpdate = true;
  }
  _updateStyle(option) {
    const newOption = { };
    for (const key in option) {
      newOption['u_' + key] = option[key];
    }
    updateObjecteUniform(this.mesh._object3D, newOption);
  }
}
