// tslint:disable-next-line:no-submodule-imports
import merge from 'lodash/merge';
let DataConfig: { [key: string]: any } = {
  world: {
    fill: {
      type: 'pbf',
      url:
        'https://gw.alipayobjects.com/os/bmw-prod/d666a08d-fce1-48e2-913a-87d81772bcc9.bin',
    },
    line: {
      type: 'pbf',
      url:
        'https://gw.alipayobjects.com/os/bmw-prod/62f61f5f-cca7-4137-845d-13c8f9969664.bin',
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
            'https://gw.alipayobjects.com/os/bmw-prod/25228941-b2ac-4591-b07d-8261ac08d06f.bin',
        },
        line: {
          type: 'pbf',
          url:
            'https://gw.alipayobjects.com/os/bmw-prod/70ec087e-c48a-4b76-8825-6452f17bae7a.bin',
        },
        provinceLine: {
          type: 'pbf',
          url:
            'https://gw.alipayobjects.com/os/bmw-prod/0024caaf-86b2-4e75-a3d1-6d2146490b67.bin',
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
            'https://gw.alipayobjects.com/os/bmw-prod/522c6496-c711-4581-88db-c3741cd39abd.bin',
        },
        line: {
          type: 'pbf',
          url:
            'https://gw.alipayobjects.com/os/bmw-prod/f6a4e2b1-359b-43a6-921c-39d2088d1dab.bin',
        },
        cityLine: {
          type: 'pbf',
          url:
            'https://gw.alipayobjects.com/os/bmw-prod/f6a4e2b1-359b-43a6-921c-39d2088d1dab.bin',
        },
        provinceLine: {
          type: 'pbf',
          url:
            'https://gw.alipayobjects.com/os/bmw-prod/0024caaf-86b2-4e75-a3d1-6d2146490b67.bin',
        },
      },
      3: {
        fill: {
          type: 'pbf',
          url:
            'https://gw.alipayobjects.com/os/bmw-prod/516b2703-d692-44e6-80dd-b3f5df0186e7.bin',
        },
        line: {
          type: 'pbf',
          url:
            'https://gw.alipayobjects.com/os/bmw-prod/bc97875a-90f2-42c0-a62c-43d2efd7460d.bin',
        },
        countryLine: {
          type: 'pbf',
          url:
            'https://gw.alipayobjects.com/os/bmw-prod/bc97875a-90f2-42c0-a62c-43d2efd7460d.bin',
        },
        cityLine: {
          type: 'pbf',
          url:
            'https://gw.alipayobjects.com/os/bmw-prod/8bfbfe7e-bd0e-4bbe-84d8-629f4dc7abc4.bin',
        },
        provinceLine: {
          type: 'pbf',
          url:
            'https://gw.alipayobjects.com/os/bmw-prod/778ad7ba-5a3f-4ed6-a94a-b8ab8acae9d6.bin',
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
