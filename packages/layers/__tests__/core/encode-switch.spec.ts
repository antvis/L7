import { AttributeType, gl, type ILayer } from '@antv/l7-core';
import { rgb2arr } from '@antv/l7-utils';
import BaseModel from '../../src/core/BaseModel';
import {
  COMMON_ATTRIBUTE_LOCATION,
  getCommonStyleAttributeOptions,
} from '../../src/core/CommonStyleAttribute';
import { DefaultUniformStyleType, DefaultUniformStyleValue } from '../../src/core/constant';

/**
 * 阶段 6.2：交互编码开关（`enableShaderEncodeStyles` / `enableDataEncodeStyles`）
 * 运行时分流契约特征化 spec。3.3 `encode-styles.spec` 已锁定 Map 收敛与公开
 * 数组 getter 派生（数据结构层）；本 spec 锁定**运行时分流**——即每个 shader 通道
 * 样式属性，依据是否被数据映射（`layer.encodeStyleAttribute[key]` 存在与否），
 * 在 BaseModel 三个消费点产生双模行为：
 *
 *   getInject() → getDynamicStyleInject(shaderKeys, styleAttribute)：
 *     - 未数据映射（styleAttribute[key] falsy）→ uniform 模式：推 `u_<key>` 入
 *       `AttributeUniforms` std140 block + vs/fs decl + vs:#main-start `#else u_<key>`
 *     - 已数据映射（styleAttribute[key] truthy）→ attribute 模式：`#define
 *       USE_ATTRIBUTE_<KEY> 0.0` + 不推 uniform + vs:#main-start `#ifdef a_<Key>`
 *     - camelCase→UPPER_SNAKE（textOffset→TEXT_OFFSET）；首字母大写 a_<Key>
 *   getStyleAttribute()：仅 shader 通道且未数据映射的 key → `u_<key>` 默认值解析
 *     （DefaultUniformStyleValue 或 layerConfig 覆盖；stroke→rgb2arr、
 *     anchor→anchorToNumber 变换）；数据映射 key 跳过
 *   registerStyleAttribute()：每个 encodeStyleAttribute key →
 *     getCommonStyleAttributeOptions(key) 命中 → styleAttributeService 注册一次；
 *     未命中（unknown）跳过
 *   getCommonStyleAttributeOptions(name)（纯导出）：data 通道属性注册表，覆盖
 *     rotation/stroke/opacity/offsets/anchor；未知 → undefined
 *
 * 用满足窄依赖面的 StubModel（override registerBuiltinAttributes 为 no-op，
 * 规避重 DI 虚函数 ctor 抛错）+ mock layer 直连 BaseModel 三个 protected 方法，
 * 不依赖真实 map/scene/container。纯测试刀，零产线改动。
 *
 * 任何后续改动破坏 uniform/attribute 双模判定 / camelCase 命名 / uniform 默认值
 * 解析 / stroke/anchor 变换 / data 通道注册表 / register 跳过 unknown 即应失败。
 */

interface StyleAttrOptions {
  field?: string | number;
  value?: unknown;
  [k: string]: unknown;
}

interface MockStyleAttributeService {
  registerStyleAttribute: jest.Mock;
}

interface MockRendererService {
  createTexture2D: jest.Mock;
}

interface MockContainer {
  globalConfigService: unknown;
  rendererService: MockRendererService;
  pickingService: unknown;
  shaderModuleService: unknown;
  styleAttributeService: MockStyleAttributeService;
  mapService: unknown;
  iconService: unknown;
  fontService: unknown;
  cameraService: unknown;
  layerService: unknown;
}

interface LayerConfig {
  animateOption: { enable: boolean };
  [key: string]: unknown;
}

interface MockLayer {
  getContainer: () => MockContainer;
  getLayerConfig: () => LayerConfig;
  enableShaderEncodeStyles: string[];
  encodeStyleAttribute: Record<string, StyleAttrOptions>;
}

// StubModel：override registerBuiltinAttributes 为 no-op（base 抛
// 'Method not implemented.'），暴露 protected 三方法供直连。
class StubModel extends BaseModel {
  constructor(layer: ILayer) {
    super(layer);
  }
  protected registerBuiltinAttributes() {
    /* no-op */
  }
  public callGetInject() {
    return this.getInject();
  }
  public callGetStyleAttribute() {
    return this.getStyleAttribute();
  }
  public callRegisterStyleAttribute() {
    this.registerStyleAttribute();
  }
}

interface Setup {
  model: StubModel;
  layer: MockLayer;
  cfg: LayerConfig;
  styleAttributeService: MockStyleAttributeService;
}

function makeSetup(
  init: Pick<MockLayer, 'enableShaderEncodeStyles' | 'encodeStyleAttribute'> &
    Partial<Pick<LayerConfig, never>> & { cfg?: LayerConfig },
): Setup {
  const registerStyleAttribute: jest.Mock = jest.fn();
  const styleAttributeService: MockStyleAttributeService = { registerStyleAttribute };
  const createTexture2D: jest.Mock = jest.fn(() => ({}));
  const container: MockContainer = {
    globalConfigService: {},
    rendererService: { createTexture2D },
    pickingService: {},
    shaderModuleService: {},
    styleAttributeService,
    mapService: {},
    iconService: {},
    fontService: {},
    cameraService: {},
    layerService: {},
  };
  const cfg: LayerConfig = { animateOption: { enable: false }, ...init.cfg };
  const layer: MockLayer = {
    getContainer: () => container,
    getLayerConfig: () => cfg,
    enableShaderEncodeStyles: init.enableShaderEncodeStyles,
    encodeStyleAttribute: init.encodeStyleAttribute,
  };
  const model = new StubModel(layer as unknown as ILayer);
  // ctor 已调一次 registerStyleAttribute（对 ctor 期 encodeStyleAttribute）。
  // 清场以便每个 registerStyleAttribute 用例从干净态起步。
  registerStyleAttribute.mockClear();
  return { model, layer, cfg, styleAttributeService };
}

const KNOWN_STYLE_ATTRS = ['rotation', 'stroke', 'opacity', 'offsets', 'anchor'] as const;

describe('encode-switch (stage-6 6.2 — shader/data 编码分流)', () => {
  describe('getCommonStyleAttributeOptions — data 通道属性注册表（纯导出）', () => {
    it.each(KNOWN_STYLE_ATTRS)(
      '%s 命中 → 返回 a_<Name> descriptor + COMMON_ATTRIBUTE_LOCATION',
      (name) => {
        const opts = getCommonStyleAttributeOptions(name);
        expect(opts).toBeDefined();
        expect(opts!.type).toBe(AttributeType.Attribute);
        const desc = opts!.descriptor!;
        const cap = name.charAt(0).toUpperCase() + name.slice(1);
        expect(desc.name).toBe(`a_${cap}`);
        expect(desc.shaderLocation).toBe(
          COMMON_ATTRIBUTE_LOCATION[name.toUpperCase() as keyof typeof COMMON_ATTRIBUTE_LOCATION],
        );
        expect(desc.buffer!.type).toBe(gl.FLOAT);
      },
    );

    it('size 字段锁定：stroke→4, offsets→2, rotation/opacity/anchor→1', () => {
      expect(getCommonStyleAttributeOptions('stroke')!.descriptor!.size).toBe(4);
      expect(getCommonStyleAttributeOptions('offsets')!.descriptor!.size).toBe(2);
      expect(getCommonStyleAttributeOptions('rotation')!.descriptor!.size).toBe(1);
      expect(getCommonStyleAttributeOptions('opacity')!.descriptor!.size).toBe(1);
      expect(getCommonStyleAttributeOptions('anchor')!.descriptor!.size).toBe(1);
    });

    it('未知 name → undefined（thetaOffset/extrusionBase/textOffset 均未注册）', () => {
      expect(getCommonStyleAttributeOptions('thetaOffset')).toBeUndefined();
      expect(getCommonStyleAttributeOptions('extrusionBase')).toBeUndefined();
      expect(getCommonStyleAttributeOptions('textOffset')).toBeUndefined();
    });
  });

  describe('getInject → getDynamicStyleInject — uniform/attribute 双模', () => {
    it('shader key 未数据映射 → uniform 模式：u_<key> 入 AttributeUniforms + 不发 #define', () => {
      const { model } = makeSetup({
        enableShaderEncodeStyles: ['opacity'],
        encodeStyleAttribute: {},
      });
      const inj = model.callGetInject();
      const decl = inj['vs:#decl'];
      const main = inj['vs:#main-start'];
      // uniform 推入 std140 block
      expect(decl).toContain('layout(std140) uniform AttributeUniforms');
      expect(decl).toContain(`${DefaultUniformStyleType.opacity} u_opacity;`);
      // 未发 attribute 模式 define
      expect(decl).not.toContain('#define USE_ATTRIBUTE_OPACITY');
      // attribute 声明仍存在（#ifdef 守卫）
      expect(decl).toContain('layout(location = ATTRIBUTE_LOCATION_OPACITY) in float a_Opacity;');
      // vs:#main-start 双分支
      expect(main).toContain('#ifdef USE_ATTRIBUTE_OPACITY');
      expect(main).toContain('float opacity = a_Opacity;');
      expect(main).toContain('#else');
      expect(main).toContain('float opacity = u_opacity;');
      // fs:#decl 在 uniform 模式下含 AttributeUniforms block（fsDeclInjection 既是
      // fs:#decl 值，又拼回 vs:#decl 末尾——历史双写）
      expect(inj['fs:#decl']).toContain('layout(std140) uniform AttributeUniforms');
      expect(inj['fs:#decl']).toContain('float u_opacity;');
    });

    it('shader key 已数据映射 → attribute 模式：#define USE_ATTRIBUTE_<KEY> 0.0 + 不推 uniform + 无 block', () => {
      const { model } = makeSetup({
        enableShaderEncodeStyles: ['opacity'],
        encodeStyleAttribute: { opacity: { field: 'value' } },
      });
      const inj = model.callGetInject();
      const decl = inj['vs:#decl'];
      // attribute 模式 define
      expect(decl).toContain('#define USE_ATTRIBUTE_OPACITY 0.0');
      // 未推 uniform → 无 AttributeUniforms block
      expect(decl).not.toContain('uniform AttributeUniforms');
      expect(decl).not.toContain('u_opacity;');
      // attribute 声明仍在
      expect(decl).toContain('in float a_Opacity;');
      // uniforms 空 → fs:#decl 为空字符串
      expect(inj['fs:#decl']).toBe('');
    });

    it('混合：opacity(uniform) + stroke(data) → block 仅含 u_opacity，不含 u_stroke', () => {
      const { model } = makeSetup({
        enableShaderEncodeStyles: ['opacity', 'stroke'],
        encodeStyleAttribute: { stroke: { field: 'x' } },
      });
      const inj = model.callGetInject();
      const decl = inj['vs:#decl'];
      expect(decl).toContain('uniform AttributeUniforms');
      expect(decl).toContain('float u_opacity;');
      expect(decl).not.toContain('vec4 u_stroke;');
      // stroke 走 attribute 模式
      expect(decl).toContain('#define USE_ATTRIBUTE_STROKE 0.0');
      // opacity 未发 define
      expect(decl).not.toContain('#define USE_ATTRIBUTE_OPACITY');
    });

    it('camelCase→UPPER_SNAKE + a_<Key> 首字母大写：textOffset → TEXT_OFFSET / a_TextOffset', () => {
      const { model } = makeSetup({
        enableShaderEncodeStyles: ['textOffset'],
        encodeStyleAttribute: {},
      });
      const inj = model.callGetInject();
      const decl = inj['vs:#decl'];
      expect(decl).toContain('USE_ATTRIBUTE_TEXT_OFFSET');
      expect(decl).toContain(`${DefaultUniformStyleType.textOffset} u_textOffset;`);
      expect(decl).toContain(`in ${DefaultUniformStyleType.textOffset} a_TextOffset;`);
    });

    it('DefaultUniformStyleType 类型查找：opacity→float, stroke→vec4, offsets→vec2, anchor→float', () => {
      const { model } = makeSetup({
        enableShaderEncodeStyles: ['opacity', 'stroke', 'offsets', 'anchor'],
        encodeStyleAttribute: {},
      });
      const decl = model.callGetInject()['vs:#decl'];
      expect(decl).toContain('float u_opacity;');
      expect(decl).toContain('vec4 u_stroke;');
      expect(decl).toContain('vec2 u_offsets;');
      expect(decl).toContain('float u_anchor;');
    });

    it('空 shaderEncodeStyles → 三个 inject key 均为空字符串', () => {
      const { model } = makeSetup({
        enableShaderEncodeStyles: [],
        encodeStyleAttribute: {},
      });
      const inj = model.callGetInject();
      expect(inj['vs:#decl']).toBe('');
      expect(inj['fs:#decl']).toBe('');
      expect(inj['vs:#main-start']).toBe('');
    });

    it('Inject 仅含三个 key：vs:#decl / fs:#decl / vs:#main-start（无其他）', () => {
      const { model } = makeSetup({
        enableShaderEncodeStyles: ['opacity'],
        encodeStyleAttribute: {},
      });
      const inj = model.callGetInject();
      expect(Object.keys(inj).sort()).toEqual(['fs:#decl', 'vs:#decl', 'vs:#main-start']);
    });
  });

  describe('getStyleAttribute — u_<key> uniform 默认值解析（仅未数据映射的 shader key）', () => {
    it('无 layerConfig 覆盖 → 取 DefaultUniformStyleValue[key]', () => {
      const { model, cfg } = makeSetup({
        enableShaderEncodeStyles: ['opacity', 'offsets'],
        encodeStyleAttribute: {},
      });
      // 确保 cfg 无这两项（取默认）
      delete cfg.opacity;
      delete cfg.offsets;
      const out = model.callGetStyleAttribute();
      expect(out.u_opacity).toBe(DefaultUniformStyleValue.opacity);
      expect(out.u_offsets).toEqual(DefaultUniformStyleValue.offsets);
    });

    it('layerConfig 覆盖 → 取 layerConfig 值（非 stroke/anchor 不变换）', () => {
      const { model, cfg } = makeSetup({
        enableShaderEncodeStyles: ['opacity', 'offsets'],
        encodeStyleAttribute: {},
      });
      cfg.opacity = 0.5;
      cfg.offsets = [1, 2];
      const out = model.callGetStyleAttribute();
      expect(out.u_opacity).toBe(0.5);
      expect(out.u_offsets).toEqual([1, 2]);
    });

    it('stroke → rgb2arr 变换：layerConfig.stroke="#ff0000" → [1,0,0,1]', () => {
      const { model, cfg } = makeSetup({
        enableShaderEncodeStyles: ['stroke'],
        encodeStyleAttribute: {},
      });
      cfg.stroke = '#ff0000';
      const out = model.callGetStyleAttribute();
      expect(out.u_stroke).toEqual(rgb2arr('#ff0000'));
      expect(out.u_stroke).toEqual([1, 0, 0, 1]);
    });

    it('anchor → anchorToNumber 变换：layerConfig.anchor="top" → 1', () => {
      const { model, cfg } = makeSetup({
        enableShaderEncodeStyles: ['anchor'],
        encodeStyleAttribute: {},
      });
      cfg.anchor = 'top';
      const out = model.callGetStyleAttribute();
      expect(out.u_anchor).toBe(1);
    });

    it('anchor="bottom-right" → 4; anchor 数字透传', () => {
      const { model, cfg } = makeSetup({
        enableShaderEncodeStyles: ['anchor'],
        encodeStyleAttribute: {},
      });
      cfg.anchor = 'bottom-right';
      expect(model.callGetStyleAttribute().u_anchor).toBe(4);
      cfg.anchor = 7;
      expect(model.callGetStyleAttribute().u_anchor).toBe(7);
    });

    it('已数据映射的 shader key → 跳过（不出现在 u_<key> 输出）', () => {
      const { model, cfg } = makeSetup({
        enableShaderEncodeStyles: ['opacity', 'stroke'],
        encodeStyleAttribute: { opacity: { field: 'v' } }, // opacity 走 attribute
      });
      cfg.stroke = '#00ff00';
      const out = model.callGetStyleAttribute();
      expect(out).not.toHaveProperty('u_opacity');
      expect(out.u_stroke).toEqual(rgb2arr('#00ff00'));
    });

    it('空 enableShaderEncodeStyles → 空对象', () => {
      const { model } = makeSetup({
        enableShaderEncodeStyles: [],
        encodeStyleAttribute: {},
      });
      expect(model.callGetStyleAttribute()).toEqual({});
    });
  });

  describe('registerStyleAttribute — data 通道注册 dispatch', () => {
    it('每个 encodeStyleAttribute key 命中 getCommonStyleAttributeOptions → 注册一次', () => {
      const { model, layer, styleAttributeService } = makeSetup({
        enableShaderEncodeStyles: [],
        encodeStyleAttribute: {},
      });
      // ctor 已清场，手动设置后调
      layer.encodeStyleAttribute = {
        stroke: { field: 's' },
        opacity: { field: 'o' },
        offsets: { field: 'oo' },
      };
      model.callRegisterStyleAttribute();
      expect(styleAttributeService.registerStyleAttribute).toHaveBeenCalledTimes(3);
      const names = styleAttributeService.registerStyleAttribute.mock.calls.map(
        (c: [unknown]) => (c[0] as { name: string }).name,
      );
      expect(names).toEqual(['stroke', 'opacity', 'offsets']);
    });

    it('未知 key（getCommonStyleAttributeOptions 返回 undefined）→ 跳过，不调 register', () => {
      const { model, layer, styleAttributeService } = makeSetup({
        enableShaderEncodeStyles: [],
        encodeStyleAttribute: {},
      });
      layer.encodeStyleAttribute = {
        thetaOffset: { field: 't' }, // 未在注册表
        stroke: { field: 's' }, // 命中
        extrusionBase: { field: 'e' }, // 未在注册表
      };
      model.callRegisterStyleAttribute();
      expect(styleAttributeService.registerStyleAttribute).toHaveBeenCalledTimes(1);
      expect(
        (styleAttributeService.registerStyleAttribute.mock.calls[0][0] as { name: string }).name,
      ).toBe('stroke');
    });

    it('空 encodeStyleAttribute → 不调 register', () => {
      const { model, layer, styleAttributeService } = makeSetup({
        enableShaderEncodeStyles: [],
        encodeStyleAttribute: {},
      });
      layer.encodeStyleAttribute = {};
      model.callRegisterStyleAttribute();
      expect(styleAttributeService.registerStyleAttribute).not.toHaveBeenCalled();
    });
  });
});
