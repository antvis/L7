// tslint:disable-next-line:no-submodule-imports
import merge from 'lodash/merge';
let DataConfig: { [key: string]: any } = {
  world: {
    fill: {
      type: 'pbf',
      url:
        'https://gw.alipayobjects.com/os/bmw-prod/cc78dddf-28ca-49a1-955a-33fa0525be6b.bin',
    },
    label: {
      type: 'pbf',
      url:
        'https://gw.alipayobjects.com/os/bmw-prod/90c51eb3-04d7-402f-bd05-95e4bd27dd62.bin',
      parser: {
        type: 'geojson',
      },
    },
    nationalBoundaries: {
      type: 'json',
      url:
        'https://gw.alipayobjects.com/os/bmw-prod/ee493a41-0558-4c0e-bee6-520276c4f1a8.json',
    },
  },
  country: {
    CHN: {
      1: {
        fill: {
          type: 'pbf',
          url:
            'https://gw.alipayobjects.com/os/bmw-prod/4f359a06-439e-435f-b74a-20ef867e1f50.bin',
        },
        line: {
          type: 'json',
          url:
            'https://gw.alipayobjects.com/os/bmw-prod/06212bc5-2927-4f95-a1c1-32ec380fdffa.json',
        },
        label: {
          type: 'json',
          url:
            'https://gw.alipayobjects.com/os/bmw-prod/36832a45-68f8-4b51-b006-9dec71f92a23.json',
        },
      },
      2: {
        fill: {
          type: 'pbf',
          url:
            'https://gw.alipayobjects.com/os/bmw-prod/c631009a-fe19-4a05-8c59-100532ae5383.bin',
        },
      },
      3: {
        fill: {
          type: 'pbf',
          url:
            'https://gw.alipayobjects.com/os/bmw-prod/53e53fc2-5476-4d22-9725-898ad91b0fdf.bin',
        },
      },
      nationalBoundaries: {
        type: 'json',
        url:
          'https://gw.alipayobjects.com/os/bmw-prod/ee493a41-0558-4c0e-bee6-520276c4f1a8.json',
      },
      nationalBoundaries2: {
        type: 'json',
        url:
          'https://gw.alipayobjects.com/os/bmw-prod/f2189cc4-662b-4358-8573-36f0f918b7ca.json',
      },
      island: {
        type: 'json',
        url:
          'https://gw.alipayobjects.com/os/bmw-prod/fe49b393-1147-4769-94ed-70471f4ff15d.json',
      },
    },
  },
  province: {
    110000: '',
  },
};

function setDataConfig(config: any) {
  DataConfig = merge(DataConfig, config);
}

export { setDataConfig, DataConfig };
