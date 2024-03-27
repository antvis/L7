/**
 * compact: true
 * inline: true
 */
import { Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import geobuf from 'geobuf';
import Pbf from 'pbf';
import React, { useEffect, useState } from 'react';

interface DataType {
  name: string;
  name_en: string;
  name_var: string;
  adcode: number;
  province_adcode: string;
}

const columns: ColumnsType<DataType> = [
  {
    title: 'name',
    dataIndex: 'name',
    sorter: true,
    width: '20%',
  },
  {
    title: 'name_en',
    dataIndex: 'name_en',
    width: '20%',
  },
  {
    title: 'name_var',
    dataIndex: 'name_var',
  },
  {
    title: 'adcode',
    dataIndex: 'adcode',
  },
  {
    title: 'province_adcode',
    dataIndex: 'province_adcode',
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
    fetch('https://npm.elemecdn.com/xingzhengqu@2023/data/province.pbf')
      .then((response) => response.arrayBuffer())
      .then((data) => {
        // 数据解码为geojson
        const geojson = geobuf.decode(new Pbf(data));
        props?.onDataLoad({ province: geojson });
        // @ts-ignore
        const results = geojson.features.map((feature: any) => {
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
      pagination={{
        pageSize: 20,
      }}
      scroll={{ x: 1000, y: 500 }}
    />
  );
};

export default App;
