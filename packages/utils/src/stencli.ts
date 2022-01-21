// TODO: 提供模版配置
export function getMask(mask: boolean, maskInside: boolean) {
  return {
    enable: mask,
    mask: 0xff,
    func: {
      cmp: 514, // gl.EQUAL,
      ref: maskInside ? 1 : 0,
      mask: 0xff,
    },
  };
}
