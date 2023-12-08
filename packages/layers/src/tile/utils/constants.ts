// TileLayer 需要代理的子图层的方法
// 一般都是在 BaseLayer 上的方法
export const ProxyFuncs = [
  /**
   * 1. 需要作用到所属子图层才会生效的方法
   * 2. 不需要主动重新创建 model 的方法
   */
  'shape',
  'color',
  'size',
  'style',
  'animate',
  'filter',
  'rotate',
  'scale',
  'setBlend',
  'setSelect',
  'setActive',
  'disableMask',
  'enableMask',
  'addMask',
  'removeMask',
];
