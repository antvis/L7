import { processRelativeCoordinates } from '@antv/l7-utils';
import type BaseLayer from '../../src/core/BaseLayer';
import LayerRelativeCoords from '../../src/core/LayerRelativeCoords';

/**
 * 阶段 6.3：相对坐标 delegate（`LayerRelativeCoords`，阶段 1.4 抽出）独立
 * 特征化 spec。当前该 delegate 仅经 BaseLayer 子类渲染路径间接覆盖；本 spec
 * 以满足窄依赖面的 mock layer 直连 delegate，锁定其可观测契约：
 *
 *   - guards：`enableRelativeCoordinates` 假 / `getSource()` 空 / source 无
 *     `data` / `getLayerConfig()` 空（经可选链）→ 均 no-op（不快照、不 mutate）
 *   - 默认初值：absoluteData=[]、relativeOrigin=[0,0]、originalExtent=[0,0,0,0]
 *   - 使能路径：快照调用时 source 现存数据（浅拷贝，原始项引用保留）→
 *     经 `@antv/l7-utils processRelativeCoordinates` 转换 → **替换**
 *     `source.data.dataArray` 为相对坐标数组、写入 relativeOrigin/originalExtent
 *   - `getAbsoluteData` 返回转换前快照（绝对坐标，交互用）
 *
 * 任何后续 delegate 改动破坏 wiring/guard/快照时序即应使本 spec 失败。
 */

type RelCoordsLayer = Pick<BaseLayer, 'getLayerConfig' | 'getSource'>;

interface MockSource {
  // data 可选，用于刻画 guard：source 无 data 字段
  data?: { dataArray: Array<{ coordinates: number[]; id: string }> };
}

function makeLayer(opts: {
  enableRelativeCoordinates?: boolean;
  source?: MockSource;
}): RelCoordsLayer {
  return {
    getLayerConfig: () => ({ enableRelativeCoordinates: opts.enableRelativeCoordinates }),
    getSource: () => opts.source,
  } as unknown as RelCoordsLayer;
}

function twoPointSource(): MockSource {
  return {
    data: {
      dataArray: [
        { coordinates: [100, 40], id: 'a' },
        { coordinates: [110, 50], id: 'b' },
      ],
    },
  };
}

describe('relative-coords delegate (stage-6 6.3)', () => {
  it('默认初值：空绝对数据 + 零原点 + 零范围', () => {
    const rc = new LayerRelativeCoords(makeLayer({ source: twoPointSource() }));
    expect(rc.getAbsoluteData()).toEqual([]);
    expect(rc.getRelativeOrigin()).toEqual([0, 0]);
    expect(rc.getOriginalExtent()).toEqual([0, 0, 0, 0]);
  });

  it('guard：enableRelativeCoordinates 假 → 不快照、不 mutate source', () => {
    const source = twoPointSource();
    const rc = new LayerRelativeCoords(makeLayer({ enableRelativeCoordinates: false, source }));
    rc.processRelativeCoordinates();
    expect(rc.getAbsoluteData()).toEqual([]);
    expect(source.data?.dataArray).toEqual([
      { coordinates: [100, 40], id: 'a' },
      { coordinates: [110, 50], id: 'b' },
    ]);
    expect(rc.getRelativeOrigin()).toEqual([0, 0]);
  });

  it('guard：getSource() 返回 undefined → no-op', () => {
    const rc = new LayerRelativeCoords(
      makeLayer({ enableRelativeCoordinates: true, source: undefined }),
    );
    expect(() => rc.processRelativeCoordinates()).not.toThrow();
    expect(rc.getAbsoluteData()).toEqual([]);
  });

  it('guard：source 无 data 字段 → no-op', () => {
    const rc = new LayerRelativeCoords(makeLayer({ enableRelativeCoordinates: true, source: {} }));
    expect(() => rc.processRelativeCoordinates()).not.toThrow();
    expect(rc.getAbsoluteData()).toEqual([]);
  });

  it('guard：getLayerConfig() 返回 undefined → no-op（经可选链）', () => {
    const source = twoPointSource();
    const layer = {
      getLayerConfig: () => undefined,
      getSource: () => source,
    } as unknown as RelCoordsLayer;
    const rc = new LayerRelativeCoords(layer);
    rc.processRelativeCoordinates();
    expect(rc.getAbsoluteData()).toEqual([]);
    expect(source.data?.dataArray).toEqual([
      { coordinates: [100, 40], id: 'a' },
      { coordinates: [110, 50], id: 'b' },
    ]);
  });

  it('使能路径：替换 source 为相对坐标 + 写入原点/范围（wiring 锁定）', () => {
    const source = twoPointSource();
    const rc = new LayerRelativeCoords(makeLayer({ enableRelativeCoordinates: true, source }));
    const expected = processRelativeCoordinates(source.data!.dataArray, {
      enableRelativeCoordinates: true,
    });

    rc.processRelativeCoordinates();

    // source.data.dataArray 被替换为相对坐标数组（经 utils 透传）
    expect(source.data?.dataArray).toEqual(expected.dataArray);
    // origin/extent wiring
    expect(rc.getRelativeOrigin()).toEqual(expected.relativeOrigin);
    expect(rc.getOriginalExtent()).toEqual(expected.originalExtent);
  });

  it('使能路径：确定性具体值（bbox 中心 + 边界 + 相对坐标）', () => {
    const source = twoPointSource();
    const rc = new LayerRelativeCoords(makeLayer({ enableRelativeCoordinates: true, source }));
    rc.processRelativeCoordinates();
    expect(rc.getRelativeOrigin()).toEqual([105, 45]); // (100+110)/2, (40+50)/2
    expect(rc.getOriginalExtent()).toEqual([100, 40, 110, 50]); // minLng,minLat,maxLng,maxLat
    expect(source.data?.dataArray).toEqual([
      { coordinates: [-5, -5], id: 'a' }, // 100-105, 40-45
      { coordinates: [5, 5], id: 'b' }, // 110-105, 50-45
    ]);
  });

  it('getAbsoluteData 返回转换前快照（绝对坐标，原始项引用保留）', () => {
    const source = twoPointSource();
    const originalItems = source.data!.dataArray.slice();
    const rc = new LayerRelativeCoords(makeLayer({ enableRelativeCoordinates: true, source }));
    rc.processRelativeCoordinates();
    const abs = rc.getAbsoluteData();
    expect(abs).toEqual([
      { coordinates: [100, 40], id: 'a' },
      { coordinates: [110, 50], id: 'b' },
    ]);
    // 浅拷贝：快照项仍是原始引用（utils 转换产生新对象，未 mutate 原项）
    expect(abs[0]).toBe(originalItems[0]);
    expect(abs[1]).toBe(originalItems[1]);
    // 转换后 source 项是新对象（非原引用）
    expect(source.data?.dataArray[0]).not.toBe(originalItems[0]);
  });
});
