import { lineAtOffset } from '../src/lineAtOffset/index';

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
        id: 0,
      },
    ],
  },
};

describe('lineAtOffset', () => {
  it('arcOffsetPoint', () => {
    const arcOffsetPoint = lineAtOffset(arcSource, {
      shape: 'arc',
      offset: 0.1,
    });

    expect(arcOffsetPoint).toEqual([
      {
        coordinates: [
          [99.228515625, 37.43997405227057],
          [100.72265625, 27.994401411046148],
        ],
        offset: 0.3,
        id: 0,
        lng: 99.66757224332352,
        lat: 36.507847734146466,
        height: 0,
      },
    ]);
  });

  it('arcOffsetPoint thetaOffset', () => {
    const arcOffsetPoint2 = lineAtOffset(arcSource, {
      shape: 'arc',
      offset: 0.1,
      thetaOffset: 0.314,
    });

    expect(arcOffsetPoint2).toEqual([
      {
        coordinates: [
          [99.228515625, 37.43997405227057],
          [100.72265625, 27.994401411046148],
        ],
        offset: 0.3,
        id: 0,
        lat: 36.507847734146466,
        lng: 99.66757224332352,
        height: 0,
      },
    ]);
  });

  it('arcOffsetPoint featureId', () => {
    const arcOffsetPoint3 = lineAtOffset(arcSource, {
      shape: 'arc',
      offset: 0.1,
      thetaOffset: 0.314,
      featureId: 0,
    });

    expect(arcOffsetPoint3).toEqual([
      {
        coordinates: [
          [99.228515625, 37.43997405227057],
          [100.72265625, 27.994401411046148],
        ],
        height: 0,
        id: 0,
        lat: 36.507847734146466,
        lng: 99.66757224332352,
        offset: 0.3,
      },
    ]);
  });

  it('greatCircleOffsetPoint', () => {
    const greatCircleOffsetPoint = lineAtOffset(arcSource, {
      shape: 'greatcircle',
      offset: 0.1,
    });

    expect(greatCircleOffsetPoint).toEqual([
      {
        coordinates: [
          [99.228515625, 37.43997405227057],
          [100.72265625, 27.994401411046148],
        ],
        offset: 0.3,
        id: 0,
        lng: 99.39897617955312,
        lat: 36.46373143064039,
        height: undefined,
      },
    ]);
  });

  it('lineOffsetPoint', () => {
    const lineOffsetPoint = lineAtOffset(arcSource, {
      shape: 'line',
      offset: 0.1,
    });

    expect(lineOffsetPoint).toEqual([
      {
        coordinates: [
          [99.228515625, 37.43997405227057],
          [100.72265625, 27.994401411046148],
        ],
        offset: 0.3,
        id: 0,
        lng: 99.3779296875,
        lat: 36.495416788148134,
        height: 0,
      },
    ]);
  });
});
