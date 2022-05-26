/*
 * 判断是否是一个合法的瓦片请求模版
 */
export function isURLTemplate(s: string) {
  return /(?=.*{z})(?=.*{x})(?=.*({y}|{-y}))/.test(s);
}

/*
 * 获取瓦片请求地址
 */
export function getURLFromTemplate(
  template: string | string[],
  properties: { x: number; y: number; z: number },
) {
  if (!template || !template.length) {
    throw new Error('url is not allowed to be empty');
  }

  const { x, y, z } = properties;

  if (Array.isArray(template)) {
    const index = Math.abs(x + y) % template.length;
    template = template[index];
  }

  return template
    .replace(/\{x\}/g, x.toString())
    .replace(/\{y\}/g, y.toString())
    .replace(/\{z\}/g, z.toString())
    .replace(/\{-y\}/g, (Math.pow(2, z) - y - 1).toString());
}
