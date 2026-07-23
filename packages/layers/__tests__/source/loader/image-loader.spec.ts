jest.mock('@antv/l7-utils', () => ({
  getImage: jest.fn(),
  isImageBitmap: jest.fn(),
}));

import { getImage, isImageBitmap } from '@antv/l7-utils';
import { ImageLoader } from '../../../src/source/loader/image-loader';

// 刷微任务队列：若 Promise 已 resolve，.then 回调在微任务里执行。
// 用 setTimeout(0) 而非 setImmediate（jsdom 环境无 setImmediate）。
const flushMicro = () => new Promise((r) => setTimeout(r, 0));

describe('ImageLoader (stage 3.3)', () => {
  beforeEach(() => {
    // resetAllMocks（非 clearAllMocks）：清 mockReturnValue/mockImplementation，
    // 否则 case 2 的 isImageBitmap.mockReturnValue(true) 泄露到后续 case，
    // 让 string 输入误走 isImageBitmap 分支跳过 getImage。
    jest.resetAllMocks();
  });

  it('HTMLImageElement 直传 → resolve [data]，不调 getImage / isImageBitmap', async () => {
    const img = new Image();
    const result = await new ImageLoader(img, {}).load();
    expect(result).toEqual([img]);
    expect(getImage).not.toHaveBeenCalled();
    // instanceof HTMLImageElement 命中，短路 || 第二项不触发
    expect(isImageBitmap).not.toHaveBeenCalled();
  });

  it('ImageBitmap 直传（isImageBitmap=true）→ resolve [data]，不调 getImage', async () => {
    const bitmap = {} as ImageBitmap;
    (isImageBitmap as unknown as jest.Mock).mockReturnValue(true);
    const result = await new ImageLoader(bitmap, {}).load();
    expect(isImageBitmap).toHaveBeenCalledWith(bitmap);
    expect(result).toEqual([bitmap]);
    expect(getImage).not.toHaveBeenCalled();
  });

  it('单个 string url → getImage 成功 → resolve [img]，requestParameters 透传', async () => {
    const img = new Image();
    (getImage as jest.Mock).mockImplementation((_p: any, cb: (e: any, i: any) => void) =>
      cb(null, img),
    );
    const rp = { headers: { Authorization: 'Bearer t' } };
    const result = await new ImageLoader('http://t.png', rp).load();

    expect(getImage).toHaveBeenCalledTimes(1);
    expect(getImage).toHaveBeenCalledWith(
      { url: 'http://t.png', headers: { Authorization: 'Bearer t' } },
      expect.any(Function),
    );
    expect(result).toEqual([img]);
  });

  it('单个 string url getImage 失败（err/无 img）→ Promise 永不 resolve（既存行为保留）', async () => {
    (getImage as jest.Mock).mockImplementation((_p: any, cb: (e: any, i: any) => void) =>
      cb(new Error('net'), null),
    );
    const loader = new ImageLoader('http://t.png', {});
    let resolved = false;
    loader
      .load()
      .then(() => {
        resolved = true;
      })
      .catch(() => {
        resolved = true;
      });
    // getImage mock 同步触发回调；done 永不被调用 → Promise 永挂
    await flushMicro();
    expect(resolved).toBe(false);
    expect(getImage).toHaveBeenCalled();
  });

  it('多个 string[] url → 全部成功 → resolve 含全部 img', async () => {
    const img0 = new Image();
    const img1 = new Image();
    (getImage as jest.Mock).mockImplementation((_p: any, cb: (e: any, i: any) => void) => {
      const url = _p.url;
      cb(null, url === 'http://a.png' ? img0 : img1);
    });
    const result = await new ImageLoader(['http://a.png', 'http://b.png'], {}).load();
    expect(getImage).toHaveBeenCalledTimes(2);
    expect(getImage).toHaveBeenCalledWith({ url: 'http://a.png' }, expect.any(Function));
    expect(getImage).toHaveBeenCalledWith({ url: 'http://b.png' }, expect.any(Function));
    expect(result).toHaveLength(2);
    expect(result).toContain(img0);
    expect(result).toContain(img1);
  });

  it('多个 string[] url 部分失败 → resolve 只含成功的 img（计数到 imageCount 即 done）', async () => {
    const img0 = new Image();
    (getImage as jest.Mock).mockImplementation((_p: any, cb: (e: any, i: any) => void) => {
      const url = _p.url;
      if (url === 'http://a.png') cb(null, img0);
      else cb(new Error('net'), null); // b 失败，img 不入 imageDatas
    });
    const result = await new ImageLoader(['http://a.png', 'http://b.png'], {}).load();
    expect(getImage).toHaveBeenCalledTimes(2);
    // b 失败仍计数，imageindex 到 2 → done 触发 → resolve 只含 a 的 img
    expect(result).toEqual([img0]);
  });

  it('多 url 全部失败 → resolve []（与单 url 失败的「永不 resolve」不对称——既存行为保留）', async () => {
    (getImage as jest.Mock).mockImplementation((_p: any, cb: (e: any, i: any) => void) =>
      cb(new Error('net'), null),
    );
    const result = await new ImageLoader(['http://a.png', 'http://b.png'], {}).load();
    expect(getImage).toHaveBeenCalledTimes(2);
    expect(result).toEqual([]);
  });
});
