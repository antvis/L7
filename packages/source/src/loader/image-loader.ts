import type { RequestParameters } from '@antv/l7-utils';
import { getImage, isImageBitmap } from '@antv/l7-utils';

/**
 * 影像加载器 —— 阶段 3.3（image.ts parser 去 fetch）。
 *
 * 核心思想（与 3.1.x / 3.2.1 同构）：**parser = 数据形状转换；loader = 数据
 * 获取**。把原 `parser/image.ts` 里的 `loadData` 闭包（`getImage` fetch 编排
 * + Promise 构造）抽进本类的 `load()`，parser 只剩「extent 默认 / coordinates
 * → imageCoord / 组装 IParserData」+ 委托 loader。**parser 源码不再 import
 * `getImage`**（满足 PLAN 3.3「不再自己 fetch」目标）。
 *
 * `load()` 返回 `Promise<Array<HTMLImageElement | ImageBitmap>>`，parser 把它
 * 赋给 `IParserData.images` —— **字段形状不变**，4 处消费方（image model /
 * ocean / earth base / rasterTerrainRgb）`await source.data.images` 零改动。
 *
 * ⚠️ 既有失败语义不对称（机械保留，属 latent bug，不在本阶段修正）：
 * - **string url 取数失败**（`getImage` err / 无 img）→ `done` 永不调用 →
 *   Promise **永不 resolve**（消费方 `await` 永挂）。
 * - **string[] 多 url**：无论单张失败与否，全部 `getImage` 回调计数到
 *   `imageCount` 时调 `done(imageDatas)`（可能 `[]`）→ Promise **resolve**。
 *   （成功的 img 入 `imageDatas`，失败的跳过，顺序为 push 顺序）
 *
 * 替换语义（`HTMLImageElement` / `ImageBitmap` 直传）：同步 `resolve([data])`，
 * 不走 `getImage` —— 与迁移前等价。
 *
 * 机械搬运要点（零行为变化）：
 * - 变量名 `imageDatas` / `imageindex`（原拼写，非 imageIndex）/ `imageCount`
 *   原样保留；
 * - 原 `loadData` 末尾 `return image;`（引用模块级 hoisted 默认导出函数名，
 *   死代码 —— 调用方 `loadData(data, rp, resolve)` 不取返回值）迁入类方法
 *   后该引用消失，机械丢弃（零行为变化）；
 * - `requestParameters` 透传进每次 `getImage` 入参（`{ ...rp, url: item }`）。
 *
 * 重构参考：docs/refactoring/source/PLAN.md › 阶段 3.3
 */
export class ImageLoader {
  constructor(
    private readonly data: string | string[] | HTMLImageElement | ImageBitmap,
    private readonly requestParameters: Omit<RequestParameters, 'url'>,
  ) {}

  public load(): Promise<Array<HTMLImageElement | ImageBitmap>> {
    return new Promise((resolve) => {
      if (this.data instanceof HTMLImageElement || isImageBitmap(this.data)) {
        resolve([this.data]);
        return;
      }
      this.fetchUrls(this.data, this.requestParameters, resolve);
    });
  }

  /**
   * 机械搬自原 `loadData`：string 走单次 `getImage`；string[] 走并发
   * `forEach` + 计数。**失败语义不对称见类 JSDoc。**
   */
  private fetchUrls(
    url: string | string[],
    requestParameters: Omit<RequestParameters, 'url'>,
    done: (res: Array<HTMLImageElement | ImageBitmap>) => void,
  ): void {
    const imageDatas: Array<HTMLImageElement | ImageBitmap> = [];
    if (typeof url === 'string') {
      getImage({ ...requestParameters, url }, (err, img) => {
        if (img) {
          imageDatas.push(img);
          done(imageDatas);
        }
      });
    } else {
      const imageCount = url.length;
      let imageindex = 0;
      url.forEach((item) => {
        getImage({ ...requestParameters, url: item }, (err, img) => {
          imageindex++;
          if (img) {
            imageDatas.push(img);
          }
          if (imageindex === imageCount) {
            done(imageDatas);
          }
        });
      });
    }
  }
}
