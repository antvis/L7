import ndi from '../../../src/source/parser/ndi';
import rgb from '../../../src/source/parser/rgb';

// rgb.ts 已补 extent 默认值（与 raster/ndi 一致），缺 coordinates 时由默认 extent
// 经 extentToCoord 推导坐标，不再读 extent! 崩。
const COORDS: [[number, number], [number, number], [number, number], [number, number]] = [
  [0, 1],
  [1, 1],
  [1, 0],
  [0, 0],
];

describe('parser.rgb (stage 6.2)', () => {
  it('三波段 + 显式 RMinMax/GMinMax/BMinMax → 交错 RGB 输出（Math.max(0, band - min)）', () => {
    const r = Float32Array.from([10, 20]);
    const g = Float32Array.from([8, 4]);
    const b = Float32Array.from([1, 2]);
    const result = rgb([r, g, b], {
      width: 2,
      height: 1,
      coordinates: COORDS,
      min: 0,
      max: 255,
      RMinMax: [5, 100] as [number, number],
      GMinMax: [3, 100] as [number, number],
      BMinMax: [0, 100] as [number, number],
    });
    expect(result.dataArray.length).toEqual(1);
    expect(result.dataArray[0].rMinMax).toEqual([5, 100]);
    expect(result.dataArray[0].gMinMax).toEqual([3, 100]);
    expect(result.dataArray[0].bMinMax).toEqual([0, 100]);
    // 交错：[R0,G0,B0, R1,G1,B1] = [max(0,10-5), max(0,8-3), max(0,1-0), max(0,20-5), max(0,4-3), max(0,2-0)]
    expect(result.dataArray[0].data).toEqual([5, 5, 1, 15, 1, 2]);
  });

  it('负值被钳为 0（Math.max(0, band-min)）', () => {
    const band = Float32Array.from([1]);
    const result = rgb([band, Float32Array.from([1]), Float32Array.from([1])], {
      width: 1,
      height: 1,
      coordinates: COORDS,
      min: 0,
      max: 255,
      RMinMax: [10, 100] as [number, number],
      GMinMax: [10, 100] as [number, number],
      BMinMax: [10, 100] as [number, number],
    });
    expect(result.dataArray[0].data).toEqual([0, 0, 0]);
  });

  it('自定义 bands 选取通道顺序', () => {
    const band0 = Float32Array.from([10]);
    const band1 = Float32Array.from([20]);
    const band2 = Float32Array.from([30]);
    const result = rgb([band0, band1, band2], {
      width: 1,
      height: 1,
      coordinates: COORDS,
      min: 0,
      max: 255,
      bands: [2, 1, 0], // R=band2, G=band1, B=band0
      RMinMax: [0, 100] as [number, number],
      GMinMax: [0, 100] as [number, number],
      BMinMax: [0, 100] as [number, number],
    });
    expect(result.dataArray[0].data).toEqual([30, 20, 10]);
  });

  it('未提供 MinMax → percentile 计算（输出长度 = 3 * bandsData[0].length）', () => {
    const band = Float32Array.from([0, 10, 20, 30]);
    const result = rgb(
      [Float32Array.from(band), Float32Array.from(band), Float32Array.from(band)],
      { width: 4, height: 1, coordinates: COORDS, min: 0, max: 255 },
    );
    expect(result.dataArray[0].data.length).toEqual(4 * 3);
  });

  it('不足 3 波段 → warn 后 early-return 空 dataArray（strictly-better guard，不再访问缺失波段致崩）', () => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    try {
      const result = rgb([Float32Array.from([1]), Float32Array.from([2])], {
        width: 1,
        height: 1,
        coordinates: COORDS,
        min: 0,
        max: 255,
      });
      expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('三个波段'));
      expect(result.dataArray).toEqual([]);
    } finally {
      warnSpy.mockRestore();
    }
  });

  it('未提供 coordinates → 经 extent 默认值推导坐标（rgb 补 extent 默认值）', () => {
    const band = Float32Array.from([10]);
    const result = rgb([band, Float32Array.from([1]), Float32Array.from([1])], {
      width: 1,
      height: 1,
      min: 0,
      max: 255,
      RMinMax: [0, 100] as [number, number],
      GMinMax: [0, 100] as [number, number],
      BMinMax: [0, 100] as [number, number],
    });
    expect(result.dataArray[0].coordinates).toEqual([
      [121.168, 30.4219],
      [121.384, 30.4219],
      [121.384, 30.2828],
      [121.168, 30.2828],
    ]);
  });
});

describe('parser.ndi (stage 6.2)', () => {
  it('两波段 → 归一化差值 (d - n) / (d + n)，extent 默认', () => {
    const n = Float32Array.from([2, 4]);
    const d = Float32Array.from([6, 2]);
    const result = ndi([n, d], { width: 2, height: 1, min: 0, max: 255 });
    expect(result.dataArray.length).toEqual(1);
    // [(6-2)/(6+2), (2-4)/(2+4)] = [0.5, -1/3]
    expect(result.dataArray[0].data).toEqual([0.5, -1 / 3]);
  });

  it('自定义 bands 选取 n/d 通道', () => {
    const band0 = Float32Array.from([6]);
    const band1 = Float32Array.from([2]);
    // bands=[1,0] → n=band1(2), d=band0(6) → (6-2)/(6+2)=0.5
    const result = ndi([band0, band1], {
      width: 1,
      height: 1,
      min: 0,
      max: 255,
      bands: [1, 0] as any,
    });
    expect(result.dataArray[0].data).toEqual([0.5]);
  });

  it('附加 rest cfg 字段透传（与 rgb 一致的 rest 展开）', () => {
    const result = ndi([Float32Array.from([2]), Float32Array.from([6])], {
      width: 1,
      height: 1,
      min: 0,
      max: 1,
    });
    expect(result.dataArray[0].min).toEqual(0);
    expect(result.dataArray[0].max).toEqual(1);
  });

  it('不足 2 波段 → warn 后 early-return 空 dataArray（strictly-better guard，不再访问缺失波段致崩）', () => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    try {
      const result = ndi([Float32Array.from([1])], { width: 1, height: 1, min: 0, max: 255 });
      expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('2'));
      expect(result.dataArray).toEqual([]);
    } finally {
      warnSpy.mockRestore();
    }
  });
});
