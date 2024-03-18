import { Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
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
    title: 'NAME',
    dataIndex: 'NAME',
    sorter: true,
  },
  {
    title: 'type',
    dataIndex: 'type',
  },
];

interface IProps {
  onDataLoad: (data: any) => void;
}

const App: React.FC<IProps> = () => {
  const [data, setData] = useState<DataType[]>();

  const fetchData = () => {
    fetch(
      `https://mdn.alipayobjects.com/afts/file/A*zMVuS7mKBI4AAAAAAAAAAAAADrd2AQ/%E5%85%A8%E5%9B%BD%E8%BE%B9%E7%95%8C.json`,
    )
      .then((response) => response.json())
      .then((data) => {
        // 数据解码为geojson
        // @ts-ignore
        const results = data.features.map((feature: any) => {
          return feature.properties;
        });
        setData(results);
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
