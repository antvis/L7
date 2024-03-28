import type { ChoroplethLayerProps, LarkMapProps, LineLayerProps } from '@antv/larkmap';
import type { FeatureCollection } from '@turf/turf';
import { message } from 'antd';
import type { DataLevel, SourceType } from 'district-data';
import { RDBSource } from 'district-data';

export const layerOptions: Omit<ChoroplethLayerProps, 'source'> = {
  autoFit: true,
  fillColor: '#377eb8',
  opacity: 0.3,
  strokeColor: 'blue',
  lineWidth: 0.5,
  lineOpacity: 1,
  state: {
    active: { strokeColor: 'green', lineWidth: 1.5, lineOpacity: 0.8 },
    select: { strokeColor: 'red', lineWidth: 1.5, lineOpacity: 0.8 },
  },
};

export const lineLayerOptions: Omit<LineLayerProps, 'source'> = {
  shape: 'line' as const,
  size: 0.8,
  color: {
    scale: {
      type: 'cat',
      domain: ['0', '2', '7', '9'],
      // [0, 1, 2, 7, 8, 9, 10, 11],
    },
    // 9 中国陆上边界
    // 7 中国海上边界
    // 0 海洋界线
    // 2 国界
    field: 'type',
    value: ['#084081', '#09f', '#377eb8', '#e41a1c'],
  },

  style: {
    opacity: 0.8,
    lineType: 'solid' as const,
  },
};

export const lineLayerOptions2: Omit<LineLayerProps, 'source'> = {
  shape: 'line' as const,
  size: 0.8,
  color: {
    scale: {
      type: 'cat',
      domain: ['1', '8', '10', '11'],
    },
    // 9 中国陆上边界
    // 7 中国海上边界
    // 0 海洋界线
    // 2 国界
    field: 'type',
    value: ['#084081', '#e41a1c', '#377eb8', '#09f'],
  },

  style: {
    opacity: 1,
    lineType: 'dash' as const,
    dashArray: [1, 1],
  },
};

export const config: LarkMapProps = {
  mapType: 'Gaode',
  mapOptions: {
    style: 'light',
    center: [120.210792, 30.246026],
    zoom: 3,
    maxZoom: 10,
    doubleClickZoom: false,
  },
};

export const worldConfig: LarkMapProps = {
  mapType: 'Gaode',
  mapOptions: {
    style: 'light',
    center: [120.210792, 30.246026],
    zoom: 3,
    maxZoom: 5,
    doubleClickZoom: false,
  },
};

export const DrillingType: Record<any, any> = {
  country: 'province',
  province: 'city',
  city: 'district',
};

export const RollupType: Record<any, any> = {
  district: 'city',
  city: 'province',
  province: 'country',
  country: '',
  jiuduanxian: '',
};

export const copy = (data: any) => {
  const oInput = document.createElement('input');
  oInput.value = data;
  document.body.appendChild(oInput);
  oInput.select();
  document.execCommand('Copy');
  oInput.style.display = 'none';
  message.success('复制成功');
};

export const item = () => {
  return [
    {
      layer: 'myChoroplethLayer',
      fields: [
        {
          field: 'name',
          formatField: () => '名称',
        },
        {
          field: 'adcode',
          formatField: '行政编号',
        },
      ],
    },
  ];
};

export const sourceOptions = [
  { value: 'DataVSource', label: 'dataV数据源' },
  { value: 'RDBSource', label: '数据源' },
];

export type DataType =
  | 'GeoJSON'
  | 'TopoJSON'
  // | 'Shapefiles'
  | 'JSON'
  | 'CSV'
  | 'KML';
export const downloadDataType = [
  { key: 'GeoJSON', value: 'GeoJSON', label: 'GeoJSON' },
  { key: 'TopoJSON', value: 'TopoJSON', label: 'TopoJSON' },
  // { key: 'Shapefiles', value: 'Shapefiles', label: 'Shapefiles' },
  { key: 'JSON', value: 'JSON', label: 'JSON' },
  { key: 'CSV', value: 'CSV', label: 'CSV' },
  { key: 'KML', value: 'KML', label: 'KML' },
];

export const downloadDataLevel = [
  { value: 'country', label: '国家' },
  { value: 'province', label: '省' },
  { value: 'city', label: '市' },
  { value: 'county', label: '县' },
];

export const editionOptions = {
  DataVSource: [
    { value: 'areas_v3', label: 'areas_v3' },
    { value: 'areas_v2', label: 'areas_v2' },
  ],
  RDBSource: [
    { value: '2024', label: '2024' },
    { value: '2023', label: '2023' },
    { value: '2022', label: '2022' },
    { value: '2021', label: '2021' },
    { value: '2020', label: '2020' },
    { value: '2019', label: '2019' },
    { value: '2018', label: '2018' },
    { value: '2017', label: '2017' },
    { value: '2016', label: '2016' },
    { value: '2015', label: '2015' },
  ],
};

export const accuracyOption = [
  { value: 'low', label: '低' },
  { value: 'middle', label: '中' },
  { value: 'high', label: '高' },
];

export interface IDataInfo {
  sourceType: SourceType;
  sourceVersion: string;
  currentName: string;
  currentLevel: DataLevel;
  currentCode: number;
  hasSubChildren: boolean;
  childrenLevel: DataLevel;
  datatype: DataType;
  dataLevel: DataLevel;
}
export const defaultDataInfo: IDataInfo = {
  sourceType: 'RDBSource',
  sourceVersion: '2024',
  currentLevel: 'country',
  currentName: '中国',
  currentCode: 100000,
  hasSubChildren: true,
  childrenLevel: 'province',
  datatype: 'GeoJSON',
  dataLevel: 'country',
};

export const getParentLevel = (level: DataLevel): DataLevel | undefined => {
  switch (level) {
    case 'country':
      return 'country';
    case 'province':
      return 'country';
    case 'city':
      return 'province';
    case 'county':
      return 'city';
    default:
      return undefined;
  }
};

export const getChildrenLevel = (level: DataLevel): DataLevel | undefined => {
  switch (level) {
    case 'country':
      return 'province';
    case 'province':
      return 'city';
    case 'city':
      return 'county';
    case 'county':
      return 'county';
    default:
      return undefined;
  }
};

export const getChildrenList = (level: DataLevel): DataLevel[] => {
  switch (level) {
    case 'country':
      return ['province', 'city', 'county'];
    case 'province':
      return ['city', 'county'];
    case 'city':
      return ['county'];
    default:
      return [];
  }
};

export const getRawData = async (level: DataLevel): FeatureCollection => {
  const source = new RDBSource({
    version: '1',
  });
  return source.getData({ level });
};
