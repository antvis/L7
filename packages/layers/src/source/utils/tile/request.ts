import type { ITileBand, SourceTile, TileLoadParams } from '@antv/l7-utils';
import { getURLFromTemplate } from '@antv/l7-utils';

/**
 * 根据不同的输入，将对应的 url 路径进行转化
 * https://{a-c}.xxx.ccc => https://a.xxx.ccc
 * https://{a-c}.xxx.ccc => https://b.xxx.ccc
 * https://{a-c}.xxx.ccc => https://c.xxx.ccc
 * @param url
 * 'https://a.xxx.ccc '
 * or
 * ['https://a.xxx.ccc', 'https://c.ddd.ccc']
 * or
 * [
 *  {
 *    url: 'https://a.xxx.ccc',
 *    bands: [0]
 *  },
 * ...
 * ]
 * @param tileParams
 * @returns
 */
export function getTileUrl(url: string | string[] | ITileBand[], tileParams: TileLoadParams) {
  if (Array.isArray(url)) {
    if (typeof url[0] === 'string') {
      return (url as string[]).map((src) => getURLFromTemplate(src, tileParams));
    } else {
      return (url as ITileBand[]).map((o) => {
        return {
          url: getURLFromTemplate(o.url, tileParams),
          bands: o.bands || [0],
        };
      });
    }
  } else {
    return getURLFromTemplate(url, tileParams);
  }
}

/**
 * 处理 url 中的波段参数，将不同的 url 格式处理成统一格式
 * @param urlBandParam
 * 'https://a.bb.xxx'
 * or
 * [
 * 'https://a.bb.xxx',
 * 'https://a.bb.xxx'
 * ]
 * or
 * [
 *  {
 *    url: 'https://a.bb.xxx',
 *    bands: [0, 1]
 *  },
 *  ...
 * ]
 * @returns
 */
export function getTileBandParams(urlBandParam: string | string[] | ITileBand[]): ITileBand[] {
  if (typeof urlBandParam === 'string') {
    return [
      {
        url: urlBandParam,
        bands: [0],
      },
    ];
  } else if (typeof urlBandParam[0] === 'string') {
    return urlBandParam.map((param) => {
      return {
        url: param as string,
        bands: [0],
      };
    });
  } else {
    return urlBandParam as ITileBand[];
  }
}

/**
 * 设置 tile 文件请求的取消函数
 * @param tile
 * @param xhrList
 */
export function bindCancel(tile: SourceTile, xhrList: any[]) {
  tile.xhrCancel = () => {
    xhrList.map((xhr) => {
      xhr.abort();
    });
  };
}
