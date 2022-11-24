import { tileToBounds } from './lonlat-tile';
/*
 * 判断是否是一个合法的瓦片请求模版
 */
export function isURLTemplate(s: string) {
  return /(?=.*{z})(?=.*{x})(?=.*({y}|{-y}))/.test(s);
}

/**
 * https://github.com/openlayers/openlayers/blob/main/src/ol/tileurlfunction.js
 * @param {string} url URL.
 * @return {Array<string>} Array of urls.
 */
export function expandUrl(url: string) {
  const urls = [];
  let match = /\{([a-z])-([a-z])\}/.exec(url);
  if (match) {
    // char range
    const startCharCode = match[1].charCodeAt(0);
    const stopCharCode = match[2].charCodeAt(0);
    let charCode;
    for (charCode = startCharCode; charCode <= stopCharCode; ++charCode) {
      urls.push(url.replace(match[0], String.fromCharCode(charCode)));
    }
    return urls;
  }
  match = /\{(\d+)-(\d+)\}/.exec(url);
  if (match) {
    // number range
    const stop = parseInt(match[2], 10);
    for (let i = parseInt(match[1], 10); i <= stop; i++) {
      urls.push(url.replace(match[0], i.toString()));
    }
    return urls;
  }
  urls.push(url);
  return urls;
}

/*
 * 获取瓦片请求地址
 */
export function getURLFromTemplate(
  template: string,
  properties: { x: number; y: number; z: number },
) {
  if (!template || !template.length) {
    throw new Error('url is not allowed to be empty');
  }

  const { x, y, z } = properties;

  const urls = expandUrl(template);
  const index = Math.abs(x + y) % urls.length;
  const url = urls[index];

  return url
    .replace(/\{x\}/g, x.toString())
    .replace(/\{y\}/g, y.toString())
    .replace(/\{z\}/g, z.toString())
    .replace(/\{bbox\}/g, tileToBounds(x, y, z).join(','))
    .replace(/\{-y\}/g, (Math.pow(2, z) - y - 1).toString());
}

/**
 * wmts url
 */

export function getWMTSURLFromTemplate(
  template: string,
  properties: {
    x: number;
    y: number;
    z: number;
    layer: string;
    version?: string;
    style?: string;
    format: string;
    service?: string;
    tileMatrixset: string;
  },
) {
  const {
    x,
    y,
    z,
    layer,
    version = '1.0.0',
    style = 'default',
    format,
    service = 'WMTS',
    tileMatrixset,
  } = properties;
  const url = `${template}&SERVICE=${service}&REQUEST=GetTile&VERSION=${version}&LAYER=${layer}&STYLE=${style}&TILEMATRIXSET=${tileMatrixset}&FORMAT=${format}&TILECOL=${x}&TILEROW=${y}&TILEMATRIX=${z}`;
  return url;
}
