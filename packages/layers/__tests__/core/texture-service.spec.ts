jest.mock('@antv/l7-utils', () => {
  // 各 generator 返回差异化 ImageData-like（data/w/h 各异），便于断言
  // getColorRampBar 分支 dispatch 与 createTexture2D 接收的 opts 来源。
  // TextureService 仅运行时依赖这 5 个 generator（IColorRamp 为 type-only
  // import，被 TS 擦除），故 factory 只需声明 5 函数。
  const make = (seed: number, width: number, height: number) => ({
    data: new Uint8ClampedArray([seed, seed + 1, seed + 2, seed + 3]),
    width,
    height,
  });
  return {
    generateCatRamp: jest.fn(() => make(10, 4, 1)),
    generateQuantizeRamp: jest.fn(() => make(20, 5, 1)),
    generateCustomRamp: jest.fn(() => make(30, 6, 2)),
    generateLinearRamp: jest.fn(() => make(40, 7, 3)),
    generateColorRamp: jest.fn(() => make(50, 8, 4)),
  };
});

import type { IColorRamp } from '@antv/l7-utils';
import {
  generateCatRamp,
  generateColorRamp,
  generateCustomRamp,
  generateLinearRamp,
  generateQuantizeRamp,
} from '@antv/l7-utils';
import TextureService from '../../src/core/TextureService';

/**
 * 阶段 6.1：纹理协调器（`TextureService`，阶段 1.6/1.7 抽出）独立特征化 spec。
 * 该 delegate 仅依赖 `layer.getContainer().rendererService.createTexture2D` 与
 * `@antv/l7-utils` 的 5 个 ramp 生成器。本 spec 用满足窄依赖面的 mock layer
 * （rendererService.createTexture2D 为 jest.fn，每次返回带 destroy 的新纹理）
 * 与全量 jest.mock 的 ramp 生成器（各有确定性返回值）直连 delegate，锁定契约：
 *
 *   ctor：layer.getContainer() 仅 ctor 调用一次解析 rendererService 并存储，
 *     后续 getColorTexture 不再 re-resolve container。
 *   getColorTexture：以 getTextureKey(ramp, domain) 为缓存键。键未命中
 *     （含首次 this.key===undefined）→ createColorTexture → createTexture2D
 *     创建新纹理 + 更新 this.key；键命中 → 直接返回缓存 colorTexture，不再调
 *     createTexture2D。
 *   getTextureKey：格式 `colors.join('_')_positions.join('_')_type_domain.join('_')`，
 *     type/domain undefined 时分别以字符串 "undefined" 落入键（历史 quirk，锁定）。
 *   createColorTexture：createTexture2D 接收
 *     {data: new Uint8Array(imageData.data), width/height=generator 返回值,
 *      flipY:false, unorm:true}。
 *   getColorRampBar：switch 分发 cat/quantize/custom/linear/default；custom 与
 *     linear 分支将 domain 直接透传（domain undefined 时亦透传 undefined，cast
 *     `as [number, number]` 仅类型层，运行时原样）。
 *   setColorTexture：直接注入纹理 + 经 getTextureKey 设 this.key，后续
 *     getColorTexture 同 ramp+domain 命中返回注入纹理（不再创建）。
 *   destroy：colorTexture?.destroy()（无纹理时 no-op）；destroy 不清 this.key
 *     与 colorTexture 引用 —— 之后 getColorTexture 同 ramp+domain 仍命中缓存
 *     返回已 destroy 的纹理（历史 quirk，锁定）。
 *
 * 任何后续 delegate 改动破坏键格式 / 缓存命中 / 5 分支 dispatch /
 * createTexture2D opts / 注入路径 / destroy 不清缓存等契约即应使本 spec 失败。
 */

interface MockTexture {
  destroy: jest.Mock;
}

interface MockRendererService {
  createTexture2D: jest.Mock;
}

interface MockContainer {
  rendererService: MockRendererService;
}

interface MockLayer {
  getContainer: jest.Mock<MockContainer, []>;
}

interface Setup {
  service: TextureService;
  layer: MockLayer;
  createTexture2D: jest.Mock;
}

const RAMP_DEFAULT: IColorRamp = {
  type: undefined,
  positions: [0, 1],
  colors: ['#ff0000', '#0000ff'],
};

function makeService(): Setup {
  const createTexture2D: jest.Mock = jest.fn((): MockTexture => ({
    destroy: jest.fn(),
  }));
  const rendererService: MockRendererService = { createTexture2D };
  const container: MockContainer = { rendererService };
  const layer: MockLayer = { getContainer: jest.fn(() => container) };
  const service = new TextureService(layer as unknown as never);
  return { service, layer, createTexture2D };
}

// getTextureKey 为 private：运行时为正常原型方法，经 as any 直访以锁定键格式。
const getTextureKey = (s: TextureService, ramp: IColorRamp, domain?: [number, number]) =>
  (
    s as unknown as { getTextureKey: (r: IColorRamp, d?: [number, number]) => string }
  ).getTextureKey(ramp, domain);

describe('TextureService (stage-6 6.1 delegate characterization)', () => {
  let service: TextureService;
  let layer: MockLayer;
  let createTexture2D: jest.Mock;

  beforeEach(() => {
    // clearAllMocks：清调用历史但保留 generator mock 的 make() 实现。
    jest.clearAllMocks();
    ({ service, layer, createTexture2D } = makeService());
  });

  it('ctor：getContainer() 仅调一次解析 rendererService 并存储，后续不 re-resolve', () => {
    service.getColorTexture(RAMP_DEFAULT, [0, 1]);
    service.getColorTexture(RAMP_DEFAULT, [0, 1]);
    expect(layer.getContainer).toHaveBeenCalledTimes(1);
    expect(createTexture2D).toHaveBeenCalledTimes(1);
  });

  it('getColorTexture 首次（键未命中，this.key===undefined）→ 创建新纹理 + 更新 key', () => {
    const tex = service.getColorTexture(RAMP_DEFAULT, [0, 1]);
    expect(createTexture2D).toHaveBeenCalledTimes(1);
    // 返回的纹理即 createTexture2D 产物
    expect(tex).toBe(createTexture2D.mock.results[0].value);
  });

  it('getColorTexture 缓存命中：同 ramp+domain 二次调 → 不再 createTexture2D，返回同一引用', () => {
    const first = service.getColorTexture(RAMP_DEFAULT, [0, 1]);
    const second = service.getColorTexture(RAMP_DEFAULT, [0, 1]);
    expect(createTexture2D).toHaveBeenCalledTimes(1);
    expect(second).toBe(first);
  });

  it('getColorTexture domain 变 → 键变 → 重新创建', () => {
    service.getColorTexture(RAMP_DEFAULT, [0, 1]);
    expect(createTexture2D).toHaveBeenCalledTimes(1);
    service.getColorTexture(RAMP_DEFAULT, [0, 2]);
    expect(createTexture2D).toHaveBeenCalledTimes(2);
  });

  it('getColorTexture colors 变 → 键变 → 重新创建', () => {
    service.getColorTexture(RAMP_DEFAULT, [0, 1]);
    const ramp2: IColorRamp = { type: undefined, positions: [0, 1], colors: ['#00ff00'] };
    service.getColorTexture(ramp2, [0, 1]);
    expect(createTexture2D).toHaveBeenCalledTimes(2);
  });

  it('getColorTexture positions 变 → 键变 → 重新创建', () => {
    service.getColorTexture(RAMP_DEFAULT, [0, 1]);
    const ramp2: IColorRamp = {
      type: undefined,
      positions: [0, 0.5],
      colors: ['#ff0000', '#0000ff'],
    };
    service.getColorTexture(ramp2, [0, 1]);
    expect(createTexture2D).toHaveBeenCalledTimes(2);
  });

  it('getTextureKey：colors_positions_type_domain 格式，type/domain undefined 落 "undefined"', () => {
    // 4 字段以 _ 连接；positions 经 ?.join，domain 经 ?.join。
    expect(getTextureKey(service, RAMP_DEFAULT, undefined)).toBe(
      '#ff0000_#0000ff_0_1_undefined_undefined',
    );
    expect(getTextureKey(service, RAMP_DEFAULT, [0, 1])).toBe('#ff0000_#0000ff_0_1_undefined_0_1');
    const linear: IColorRamp = {
      type: 'linear',
      positions: [0, 0.25, 1],
      colors: ['#ff0000', '#00ff00', '#0000ff'],
    };
    expect(getTextureKey(service, linear, [10, 20])).toBe(
      '#ff0000_#00ff00_#0000ff_0_0.25_1_linear_10_20',
    );
  });

  it('createColorTexture：createTexture2D 接收 data=Uint8Array(imageData.data)/width/height/flipY:false/unorm:true', () => {
    const rampCat: IColorRamp = { type: 'cat', positions: [0, 255], colors: ['#f00', '#00f'] };
    service.getColorTexture(rampCat, [0, 1]);
    const opts = createTexture2D.mock.calls[0][0] as {
      data: unknown;
      width: number;
      height: number;
      flipY: boolean;
      unorm: boolean;
    };
    expect(opts.data).toBeInstanceOf(Uint8Array);
    // new Uint8Array(Uint8ClampedArray) 复制；长度 4 = generator make(10) 的 data 长度
    expect(opts.data).toHaveLength(4);
    expect(Array.from(opts.data as Uint8Array)).toEqual([10, 11, 12, 13]);
    // 宽高来自 generator 返回值（cat → make(10,4,1)）
    expect(opts.width).toBe(4);
    expect(opts.height).toBe(1);
    expect(opts.flipY).toBe(false);
    expect(opts.unorm).toBe(true);
  });

  it('getColorRampBar：5 分支 dispatch 各调对应 generator 一次（cat/quantize/custom/linear/default）', () => {
    const cat: IColorRamp = { type: 'cat', positions: [0, 255], colors: ['#f00', '#00f'] };
    const quantize: IColorRamp = { type: 'quantize', positions: [0, 1], colors: ['#f00', '#00f'] };
    const custom: IColorRamp = { type: 'custom', positions: [0, 0.5, 1], colors: ['#f00', '#00f'] };
    const linear: IColorRamp = { type: 'linear', positions: [0, 1], colors: ['#f00', '#00f'] };
    const def: IColorRamp = { type: undefined, positions: [0, 1], colors: ['#f00', '#00f'] };

    service.getColorTexture(cat, [0, 1]);
    service.getColorTexture(quantize, [0, 1]);
    service.getColorTexture(custom, [0, 1]);
    service.getColorTexture(linear, [0, 1]);
    service.getColorTexture(def, [0, 1]);

    expect(generateCatRamp).toHaveBeenCalledTimes(1);
    expect(generateQuantizeRamp).toHaveBeenCalledTimes(1);
    expect(generateCustomRamp).toHaveBeenCalledTimes(1);
    expect(generateLinearRamp).toHaveBeenCalledTimes(1);
    expect(generateColorRamp).toHaveBeenCalledTimes(1);
    // createTexture2D 被调 5 次（5 个 distinct key）
    expect(createTexture2D).toHaveBeenCalledTimes(5);
  });

  it('getColorRampBar：custom/linear 分支将 domain 直接透传（undefined 亦透传）', () => {
    const custom: IColorRamp = { type: 'custom', positions: [0, 0.5, 1], colors: ['#f00', '#00f'] };
    // domain undefined → generateCustomRamp 收到 undefined（cast as 仅类型层）
    service.getColorTexture(custom, undefined);
    expect(generateCustomRamp).toHaveBeenCalledWith(custom, undefined);

    const linear: IColorRamp = { type: 'linear', positions: [0, 1], colors: ['#f00', '#00f'] };
    service.getColorTexture(linear, [10, 20]);
    expect(generateLinearRamp).toHaveBeenCalledWith(linear, [10, 20]);
  });

  it('setColorTexture：注入纹理 + 经 getTextureKey 设 key，后续 getColorTexture 命中不再创建', () => {
    const injected: MockTexture = { destroy: jest.fn() };
    service.setColorTexture(injected as unknown as never, RAMP_DEFAULT, [0, 1] as [number, number]);
    const got = service.getColorTexture(RAMP_DEFAULT, [0, 1]);
    expect(got).toBe(injected);
    expect(createTexture2D).not.toHaveBeenCalled();
  });

  it('destroy：colorTexture 存在 → 调其 destroy() 一次', () => {
    service.getColorTexture(RAMP_DEFAULT, [0, 1]);
    const tex = createTexture2D.mock.results[0].value as MockTexture;
    service.destroy();
    expect(tex.destroy).toHaveBeenCalledTimes(1);
  });

  it('destroy：初始无 colorTexture → no-op（?. 短路），不 throw', () => {
    expect(() => service.destroy()).not.toThrow();
    expect(createTexture2D).not.toHaveBeenCalled();
  });

  it('destroy 不清 key/colorTexture 引用：之后 getColorTexture 同键仍命中返回已 destroy 的纹理（历史 quirk）', () => {
    const tex = service.getColorTexture(RAMP_DEFAULT, [0, 1]);
    service.destroy();
    // 二次 getColorTexture：key 仍等于 currentkey → 直接返回缓存（已 destroy 过）
    const again = service.getColorTexture(RAMP_DEFAULT, [0, 1]);
    expect(again).toBe(tex);
    expect(createTexture2D).toHaveBeenCalledTimes(1);
  });
});
