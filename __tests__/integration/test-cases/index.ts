type TestCase = {
  type: string;
  snapshots?: boolean;
  demos: Array<{
    name: string;
    sleepTime?: number;
    snapshots?: boolean;
  }>;
};

export const TEST_CASES: TestCase[] = [
  {
    type: 'Point',
    demos: [
      {
        name: 'billboard',
      },
      {
        name: 'column',
      },
      {
        name: 'fill_image',
      },
      {
        name: 'fill',
      },
      // {
      //   name: 'image',
      // },
      {
        name: 'text',
      },
    ],
  },
  {
    type: 'Line',
    snapshots: true,
    demos: [
      {
        name: 'arc',
      },
      {
        name: 'arc_plane',
        sleepTime: 500,
      },

      {
        name: 'flow',
      },
      {
        name: 'arc',
      },
      {
        name: 'dash',
        sleepTime: 500,
      },
    ],
  },
  {
    type: 'Polygon',
    demos: [
      {
        name: 'extrude',
      },
      {
        name: 'fill',
      },
      {
        name: 'ocean',
        snapshots: false,
      },
      {
        name: 'texture',
        snapshots: false,
      },
      {
        name: 'water',
        snapshots: false,
      },
    ],
  },
  {
    type: 'HeatMap',
    snapshots: false,
    demos: [
      {
        name: 'grid',
        sleepTime: 200,
      },
      {
        name: 'hexagon',
        sleepTime: 200,
      },
      {
        name: 'normal',
        sleepTime: 200,
      },
    ],
  },
  {
    type: 'Raster',
    snapshots: false,
    demos: [
      {
        name: 'tiff',
        sleepTime: 200,
      },
      {
        name: 'image',
      },
    ],
  },
  {
    type: 'Mask',
    demos: [
      {
        name: 'single',
      },
    ],
  },
  {
    type: 'Gallery',
    demos: [
      {
        name: 'fujian',
        sleepTime: 500,
      },
    ],
  },
];
