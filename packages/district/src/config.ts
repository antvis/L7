// tslint:disable-next-line:no-submodule-imports
import merge from 'lodash/merge';
let DataConfig: { [key: string]: any } = {
  world: {
    fill: {
      type: 'pbf',
      url:
        '//gw.alipayobjects.com/os/bmw-prod/21bdf832-1dfc-4cae-92d1-aa8d156df40f.bin',
    },
    provinceLine: {
      type: 'pbf',
      url:
        '//gw.alipayobjects.com/os/bmw-prod/76914518-e04c-42c9-8c4b-1ae71aabb024.bin',
    },
    label: {
      type: 'pbf',
      url:
        '//gw.alipayobjects.com/os/bmw-prod/90c51eb3-04d7-402f-bd05-95e4bd27dd62.bin',
      parser: {
        type: 'geojson',
      },
    },
    nationalBoundaries: {
      type: 'json',
      url:
        '//gw.alipayobjects.com/os/bmw-prod/ee493a41-0558-4c0e-bee6-520276c4f1a8.json',
    },
  },
  country: {
    CHN: {
      1: {
        fill: {
          type: 'pbf',
          url:
            '//gw.alipayobjects.com/os/bmw-prod/70ec087e-c48a-4b76-8825-6452f17bae7a.bin',
        },
        line: {
          type: 'pbf',
          url:
            '//gw.alipayobjects.com/os/bmw-prod/70ec087e-c48a-4b76-8825-6452f17bae7a.bin',
        },
        provinceLine: {
          type: 'pbf',
          url:
            '//gw.alipayobjects.com/os/bmw-prod/778ad7ba-5a3f-4ed6-a94a-b8ab8acae9d6.bin',
        },
        label: {
          type: 'json',
          url:
            '//gw.alipayobjects.com/os/bmw-prod/36832a45-68f8-4b51-b006-9dec71f92a23.json',
        },
      },
      2: {
        fill: {
          type: 'pbf',
          url:
            '//gw.alipayobjects.com/os/bmw-prod/561e2cfe-9460-42d1-a2f8-3fd2e1274c52.bin',
        },
        line: {
          type: 'pbf',
          url:
            '//gw.alipayobjects.com/os/bmw-prod/8bfbfe7e-bd0e-4bbe-84d8-629f4dc7abc4.bin',
        },
        cityLine: {
          type: 'pbf',
          url:
            '//gw.alipayobjects.com/os/bmw-prod/8bfbfe7e-bd0e-4bbe-84d8-629f4dc7abc4.bin',
        },
        provinceLine: {
          type: 'pbf',
          url:
            '//gw.alipayobjects.com/os/bmw-prod/778ad7ba-5a3f-4ed6-a94a-b8ab8acae9d6.bin',
        },
      },
      3: {
        fill: {
          type: 'pbf',
          url:
            '//gw.alipayobjects.com/os/bmw-prod/516b2703-d692-44e6-80dd-b3f5df0186e7.bin',
        },
        line: {
          type: 'pbf',
          url:
            '//gw.alipayobjects.com/os/bmw-prod/bc97875a-90f2-42c0-a62c-43d2efd7460d.bin',
        },
        countryLine: {
          type: 'pbf',
          url:
            '//gw.alipayobjects.com/os/bmw-prod/bc97875a-90f2-42c0-a62c-43d2efd7460d.bin',
        },
        cityLine: {
          type: 'pbf',
          url:
            '//gw.alipayobjects.com/os/bmw-prod/8bfbfe7e-bd0e-4bbe-84d8-629f4dc7abc4.bin',
        },
        provinceLine: {
          type: 'pbf',
          url:
            '//gw.alipayobjects.com/os/bmw-prod/778ad7ba-5a3f-4ed6-a94a-b8ab8acae9d6.bin',
        },
      },
      nationalBoundaries: {
        type: 'json',
        url:
          '//gw.alipayobjects.com/os/bmw-prod/ee493a41-0558-4c0e-bee6-520276c4f1a8.json',
      },
      nationalBoundaries2: {
        type: 'json',
        url:
          '//gw.alipayobjects.com/os/bmw-prod/f2189cc4-662b-4358-8573-36f0f918b7ca.json',
      },
      island: {
        type: 'json',
        url:
          '//gw.alipayobjects.com/os/bmw-prod/fe49b393-1147-4769-94ed-70471f4ff15d.json',
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
