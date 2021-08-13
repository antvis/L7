export default {
  documentElement: {
    style: [],
  },
  createElementNS: (namespaceURI: string, tagName: string) => {
    return null;
  },
  createElement: (tagName: string) => {
    if (tagName === 'canvas') {
      // 当创建 canvas 对象的时候使用小程序提供的方法创建离屏 canvas
      // @ts-ignore
      return my.createOffscreenCanvas(124, 124, '2d');
    }
    return {
      className: [],
    };
  },
  removeEventListener: () => {
    return '';
  },
};
