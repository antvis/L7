export const TestDemoList: Array<{
  type: string;
  snapshots?: boolean;
  demos: Array<{
    name: string;
    sleepTime?: number;
    snapshots?: boolean;
  }>;
}> = [
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
      },

      {
        name: 'flow',
      },
      {
        name: 'arc',
      },
      {
        name: 'dash',
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
        sleepTime: 2,
      },
      {
        name: 'hexagon',
        sleepTime: 2,
      },
      {
        name: 'normal',
        sleepTime: 2,
      },
    ],
  },
  {
    type: 'Raster',
    snapshots: false,
    demos: [
      {
        name: 'tiff',
        sleepTime: 2,
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
        sleepTime: 2,
      },
    ],
  },
];
