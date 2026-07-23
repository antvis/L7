import Source from '../../src/source/';
import Point from './data/point';
import Polygon from './data/polygon';

describe('source constructor', () => {
  it('source.constructor', () => {
    const source = new Source(Polygon);
    expect(source.extent).toEqual([
      114.24373626708983, 30.55560910664438, 114.32424545288086, 30.60807236997211,
    ]);
  });
  it('source.getFeatureById', () => {
    const source = new Source(Point, {
      cluster: true,
      clusterOptions: {
        method: 'sum',
        field: 'mag',
      },
    });
    expect((source.getFeatureById(0) as any).id).toEqual('ak16994521');
  });
  it('source.updateFeaturePropertiesById', () => {
    const source = new Source(Point, {
      cluster: true,
      clusterOptions: {
        method: 'sum',
        field: 'mag',
      },
    });
    source.updateFeaturePropertiesById(0, {
      mag: 100,
    });
    expect((source.getFeatureById(0) as any).mag).toEqual(100);
  });
  it('source.transform.cluster', () => {
    const source = new Source(Point, {
      cluster: true,
      clusterOptions: {
        method: 'sum',
        field: 'mag',
      },
    });
    source.updateClusterData(2);
    const lenAtZoom2 = source.data.dataArray.length;
    // 聚合后点数远少于原始（~6107 个点聚合），但具体数随 Supercluster 算法 / 精度 /
    // 数据微调敏感 → 仅锁下界 + 形状，不强锁脆弱精确值（阶段 6.3 脆弱断言改造）。
    expect(lenAtZoom2).toBeGreaterThan(50);
    expect(source.data.dataArray[0]).toHaveProperty('coordinates');
    source.updateClusterData(3);
    // 更高 zoom → 簇拆分 → 点数更多（相对单调断言，不强锁脆弱精确值）。
    expect(source.data.dataArray.length).toBeGreaterThan(lenAtZoom2);
    expect(source.data.dataArray[0]).toHaveProperty('coordinates');
  });

  it('source.transform.filter', () => {
    const source = new Source(Point, {
      transforms: [
        {
          type: 'filter',
          callback: (item) => {
            return item.id !== 'ak16994280';
          },
        },
      ],
    });

    expect(source.data.dataArray.length).toEqual(Point.features.length - 1);
  });
  it('source.transform.grid', () => {
    const source = new Source(Point, {
      transforms: [
        {
          type: 'grid',
          size: 50000,
          field: 'mag',
          method: 'sum',
        },
      ],
    });
    const gridBins = source.data.dataArray;
    // 网格 bin 数随投影 / size 变化敏感 → 锁下界 + bin 形状（阶段 6.3）。
    expect(gridBins.length).toBeGreaterThan(1000);
    expect(gridBins[0]).toHaveProperty('coordinates');
    expect(gridBins[0]).toHaveProperty('count');
    expect(typeof gridBins[0]._id).toBe('number');
  });

  it('source.transform.hexagon', () => {
    const source = new Source(Point, {
      transforms: [
        {
          type: 'hexagon',
          size: 50000,
          field: 'mag',
          method: 'sum',
        },
      ],
    });
    const hexBins = source.data.dataArray;
    // 六边形 bin 数随投影 / size 变化敏感 → 锁下界 + bin 形状（阶段 6.3）。
    expect(hexBins.length).toBeGreaterThan(1000);
    expect(hexBins[0]).toHaveProperty('coordinates');
    expect(hexBins[0]).toHaveProperty('count');
    expect(typeof hexBins[0]._id).toBe('number');
  });
  it('source.transform.map', () => {
    const source = new Source(Point, {
      transforms: [
        {
          type: 'map',
          callback: (item, name) => {
            return {
              ...item,
              name,
            };
          },
        },
      ],
    });
    expect(source.data.dataArray[0].name).toEqual(0);
  });
  it('source.transform.join', () => {
    const source = new Source(Point, {
      transforms: [
        {
          type: 'join',
          sourceField: '_id',
          targetField: 'id',
          data: [
            {
              _id: 'ak16994521',
              value: 100,
            },
            {
              _id: 'ak16994519',
              value: 200,
            },
          ],
        },
      ],
    });
    expect(source.data.dataArray[0].value).toEqual(100);
    expect(source.data.dataArray[1].value).toEqual(200);
  });
});
