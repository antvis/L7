/**
 * compact: true
 * inline: true
 */
import { DownloadOutlined } from '@ant-design/icons';
import type { MenuProps, TabsProps } from 'antd';
import { Button, Dropdown, Tabs } from 'antd';
import React, { useState } from 'react';
import { downloadData } from '../utils/util';
import City from './city';
import County from './county';
import Province from './province';
import World from './world';

const App: React.FC<{ locale?: 'zh' | 'en' }> = ({ locale = 'zh' }) => {
  const isZh = locale === 'zh';
  const [selectTab, setSelectTab] = useState('province');
  const [districtData, setDistrictData] = useState({});
  const onChange = (key: string) => {
    setSelectTab(key);
  };
  const onDataLoad = (data: any) => {
    setDistrictData((previous) => ({ ...previous, ...data }));
  };
  const items: TabsProps['items'] = [
    {
      key: 'province',
      label: isZh ? '省级' : 'Provinces',
      children: <Province onDataLoad={onDataLoad} />,
    },
    {
      key: 'city',
      label: isZh ? '市级' : 'Cities',
      children: <City onDataLoad={onDataLoad} />,
    },
    {
      key: 'county',
      label: isZh ? '县级' : 'Counties',
      children: <County onDataLoad={onDataLoad} />,
    },
    {
      key: 'world',
      label: isZh ? '世界地图' : 'World',
      children: <World onDataLoad={onDataLoad} />,
    },
  ];

  const dropDownItems: MenuProps['items'] = [
    {
      key: 'CSV',
      label: isZh ? 'CSV 格式' : 'CSV',
    },
    {
      key: 'JSON',
      label: isZh ? 'JSON 格式' : 'JSON',
    },
  ];

  return (
    <div className="min-w-0">
      <Tabs
        tabBarExtraContent={{
          right: (
            <Dropdown
              menu={{
                items: dropDownItems,
                onClick: ({ key }) => {
                  downloadData(selectTab, districtData[selectTab], key as 'CSV' | 'JSON');
                },
              }}
              placement="bottom"
            >
              <Button
                className="bg-[var(--brand)] hover:bg-[var(--brand-strong)]"
                type="primary"
                shape="round"
                icon={<DownloadOutlined />}
                size={'middle'}
              >
                {isZh ? '导出数据' : 'Export data'}
              </Button>
            </Dropdown>
          ),
        }}
        defaultActiveKey="province"
        items={items}
        size={'large'}
        style={{ height: '650px' }}
        onChange={onChange}
      />
    </div>
  );
};

export default App;
