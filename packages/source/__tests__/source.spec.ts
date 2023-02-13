import Source from '../src/';
import Point from './data/point';
import Polygon from './data/polygon';

describe('source constructor', () => {
  it('source.constructor', () => {
    const source = new Source(Polygon);
    expect(source.extent).toEqual([
      114.24373626708983, 30.55560910664438, 114.32424545288086,
      30.60807236997211,
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
    expect(source.data.dataArray.length).toEqual(110);
    source.updateClusterData(3);
    expect(source.data.dataArray.length).toEqual(217);
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
    expect(source.data.dataArray.length).toEqual(1438);
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
    expect(source.data.dataArray.length).toEqual(1934);
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
