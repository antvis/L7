import BaseLayer from '../../src/core/BaseLayer';
import LineLayer from '../../src/line';
import PointLayer from '../../src/point';
import PolygonLayer from '../../src/polygon';

/**
 * 阶段 3.3：编码样式收敛契约（`enableShaderEncodeStyles` / `enableDataEncodeStyles`
 * 两个平行 string[] 收敛为内部单一真源 `encodeStyles: Map<string,EncodeStyleKind>`，
 * 公开数组 getter 维持 `ILayer` 契约）。
 */
describe('encode-styles (stage-3 3.3)', () => {
  it('PointLayer 注册 shader + data 编码样式', () => {
    const layer = new PointLayer();
    const root = layer as unknown as { encodeStyles: Map<string, string> };
    expect(root.encodeStyles.get('stroke')).toBe('shader');
    expect(root.encodeStyles.get('offsets')).toBe('shader');
    expect(root.encodeStyles.get('opacity')).toBe('shader');
    expect(root.encodeStyles.get('rotation')).toBe('shader');
    expect(root.encodeStyles.get('anchor')).toBe('shader');
    expect(root.encodeStyles.get('textOffset')).toBe('data');
    expect(root.encodeStyles.get('textAnchor')).toBe('data');
  });

  it('PointLayer 公开数组 getter 从 Map 派生', () => {
    const layer = new PointLayer();
    expect(layer.enableShaderEncodeStyles).toEqual([
      'stroke',
      'offsets',
      'opacity',
      'rotation',
      'anchor',
    ]);
    expect(layer.enableDataEncodeStyles).toEqual(['textOffset', 'textAnchor']);
  });

  it('LineLayer 仅注册 shader 编码样式', () => {
    const layer = new LineLayer();
    expect(layer.enableShaderEncodeStyles).toEqual(['stroke', 'offsets', 'opacity', 'thetaOffset']);
    expect(layer.enableDataEncodeStyles).toEqual([]);
  });

  it('PolygonLayer 注册 shader 编码样式', () => {
    const layer = new PolygonLayer();
    expect(layer.enableShaderEncodeStyles).toEqual([
      'opacity',
      'extrusionBase',
      'rotation',
      'offsets',
      'stroke',
    ]);
    expect(layer.enableDataEncodeStyles).toEqual([]);
  });

  it('BaseLayer 默认空编码样式', () => {
    const layer = new BaseLayer({ name: 'BaseLayer' });
    expect(layer.enableShaderEncodeStyles).toEqual([]);
    expect(layer.enableDataEncodeStyles).toEqual([]);
  });

  it('公开数组 getter 返回浅拷贝，内部 mutate 不泄漏引用', () => {
    const layer = new PointLayer();
    const a = layer.enableShaderEncodeStyles;
    const b = layer.enableShaderEncodeStyles;
    expect(a).not.toBe(b); // 每次调用新数组（getter derive）
    expect(a).toEqual(b);
  });

  it('shader 与 data 两轨互斥且经 setEncodeStyles 覆盖', () => {
    const layer = new BaseLayer({ name: 'BaseLayer' });
    const typed = layer as unknown as {
      setEncodeStyles: (kind: 'shader' | 'data', keys: string[]) => void;
      encodeStyles: Map<string, string>;
    };
    typed.setEncodeStyles('shader', ['color', 'size']);
    expect(typed.encodeStyles.get('color')).toBe('shader');
    expect(typed.encodeStyles.get('size')).toBe('shader');
    typed.setEncodeStyles('data', ['color']); // 同名后写覆盖先写
    expect(typed.encodeStyles.get('color')).toBe('data');
    expect(typed.encodeStyles.get('size')).toBe('shader'); // 未被覆盖项保留
    expect(layer.enableShaderEncodeStyles).toEqual(['size']);
    expect(layer.enableDataEncodeStyles).toEqual(['color']);
  });
});
