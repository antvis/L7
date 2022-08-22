import { Version } from '../src/interface/map';
import { lineAtOffset, lineAtOffsetAsyc } from '../src/lineAtOffset/index';
const arcSource = {
  inited: true,
  data: {
    dataArray: [
      {
        coordinates: [
          [99.228515625, 37.43997405227057],
          [100.72265625, 27.994401411046148],
        ],
        offset: 0.3,
        _id: 0
      }
    ]
  }
};

describe('lineAtOffset', () => {
  (async () => {
    const asyncOffsetPoint = await lineAtOffsetAsyc(arcSource, {
      shape: 'arc',
      offset: 0.1,
      mapVersion: Version['GAODE1.x']
    })
    it('asyncOffsetPoint', () => {
      expect(asyncOffsetPoint).toEqual(  [
        {
          coordinates: [ 
            [ 99.228515625, 37.43997405227057 ],
            [ 100.72265625, 27.994401411046148 ]
           ],
          offset: 0.3,
          _id: 0,
          _lng: 99.66757224332352,
          _lat: 36.507847734146466,
          _height: 0
        }
      ]);
    });

  })()
  const arcOffsetPoint = lineAtOffset(arcSource, {
    shape: 'arc',
    offset: 0.1,
    mapVersion: Version['GAODE1.x']
  })

  const arcOffsetPoint2 = lineAtOffset(arcSource, {
    shape: 'arc',
    offset: 0.1,
    mapVersion: Version['GAODE2.x'],
    thetaOffset: 0.314
  })

  const arcOffsetPoint3 = lineAtOffset(arcSource, {
    shape: 'arc',
    offset: 0.1,
    mapVersion: Version['GAODE2.x'],
    thetaOffset: 0.314,
    featureId: 0
  })

  const greatCircleOffsetPoint = lineAtOffset(arcSource, {
    shape: 'greatcircle',
    offset: 0.1,
    mapVersion: Version['GAODE1.x']
  })

  const greatCircleOffsetPoint2 = lineAtOffset(arcSource, {
    shape: 'greatcircle',
    offset: 0.1,
    mapVersion: Version['GAODE2.x']
  })

  const lineOffsetPoint = lineAtOffset(arcSource, {
    shape: 'line',
    offset: 0.1,
    mapVersion: Version['GAODE1.x']
  })

  it('arcOffsetPoint', () => {
    expect(arcOffsetPoint).toEqual(  [
      {
        coordinates: [ 
          [ 99.228515625, 37.43997405227057 ],
          [ 100.72265625, 27.994401411046148 ]
         ],
        offset: 0.3,
        _id: 0,
        _lng: 99.66757224332352,
        _lat: 36.507847734146466,
        _height: 0
      }
    ]);
  });

  it('arcOffsetPoint2', () => {
    expect(arcOffsetPoint2).toEqual(  [
      {
        coordinates: [ 
          [ 99.228515625, 37.43997405227057 ],
          [ 100.72265625, 27.994401411046148 ]
         ],
        offset: 0.3,
        _id: 0,
        _lng: 99.72191962749187,
        _lat: 36.54640697914567,
        _height: 0
      }
    ]);
  });

  it('arcOffsetPoint3', () => {
    expect(arcOffsetPoint3).toEqual(  [
      {
        coordinates: [ 
          [ 99.228515625, 37.43997405227057 ],
          [ 100.72265625, 27.994401411046148 ]
         ],
        offset: 0.3,
        _id: 0,
        _lng: 99.72191962749187,
        _lat: 36.54640697914567,
        _height: 0
      }
    ]);
  });

  it('greatCircleOffsetPoint', () => {
    expect(greatCircleOffsetPoint).toEqual(  [
      {
        coordinates: [ 
          [ 99.228515625, 37.43997405227057 ],
          [ 100.72265625, 27.994401411046148 ]
         ],
        offset: 0.3,
        _id: 0,
        _lng: 99.39897617955312,
        _lat: 36.46373143064039,
        _height: undefined
      }
    ]);
  });

  it('greatCircleOffsetPoint2', () => {
    expect(greatCircleOffsetPoint2).toEqual(  [
      {
        coordinates: [ 
          [ 99.228515625, 37.43997405227057 ],
          [ 100.72265625, 27.994401411046148 ]
         ],
        offset: 0.3,
        _id: 0,
        _lng: 1.7395272931153063,
        _lat: 0.6371821457776072,
        _height: 0
      }
    ]);
  });

  it('lineOffsetPoint', () => {
    expect(lineOffsetPoint).toEqual(  [
      {
        coordinates: [ 
          [ 99.228515625, 37.43997405227057 ],
          [ 100.72265625, 27.994401411046148 ]
         ],
        offset: 0.3,
        _id: 0,
        _lng: 99.3779296875,
        _lat: 36.495416788148134,
        _height: 0
      }
    ]);
  });
});
