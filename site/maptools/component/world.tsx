import { Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import geobuf from 'geobuf';
import Pbf from 'pbf';
import React, { useEffect, useState } from 'react';

interface DataType {
  name: string;
  adcode: number;
  name_en: string;
  name_var: string;
  city_type: string;
  city_adcode: string;
  province: string;
  province_adcode: string;
  province_type: string;
}

const columns: ColumnsType<DataType> = [
  {
    title: 'NAME_CHN',
    dataIndex: 'NAME_CHN',
    sorter: true,
  },
  {
    title: 'NAME_ENG',
    dataIndex: 'NAME_ENG',
  },
  {
    title: 'SOC',
    dataIndex: 'SOC',
  },
  {
    title: 'NR_C',
    dataIndex: 'NR_C',
  },
];

interface IProps {
  onDataLoad: (data: any) => void;
}

const App: React.FC<IProps> = (props: IProps) => {
  const [data, setData] = useState<DataType[]>();
  const [loading, setLoading] = useState(false);

  const fetchData = () => {
    setLoading(true);
    fetch('https://npm.elemecdn.com/xingzhengqu@2.0.8/data/world_polygon.pbf')
      .then((response) => response.arrayBuffer())
      .then((data) => {
        // 数据解码为geojson
        const gejson = geobuf.decode(new Pbf(data));
        props?.onDataLoad({ city: gejson });
        // @ts-ignore
        const results = gejson.features.map((feature: any) => {
          return feature.properties;
        });
        setData(results);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Table
      columns={columns}
      rowKey={(record) => record.adcode}
      dataSource={data}
      loading={loading}
      size="small"
      scroll={{ x: 1000, y: 500 }}
      pagination={{
        pageSize: 20,
        simple: true,
      }}
    />
  );
};

export default App;
