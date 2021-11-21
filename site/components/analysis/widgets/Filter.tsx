import { Select } from 'antd';
import React from 'react';
import { useConfigService } from '@antv/dipper';
import { brandOption } from '../configs/mock';

const { Option } = Select;

export const Filter = () => {
  const { setWidgetsValue } = useConfigService();

  const onBrandChange = (e: any) => {
    setWidgetsValue('brand', e);
  };

  return (
    <div style={{ background: '#fff', borderRadius: 3 }}>
      <Select
        defaultValue="全部地区"
        style={{ width: 100, color: 'rgba(0,0,0,0.65)' }}
        bordered={false}
      >
        <Option value="全部地区">全部地区</Option>
        <Option value="示例地区1">示例地区1</Option>
        <Option value="示例地区2">示例地区2</Option>
      </Select>
      <Select
        defaultValue="1"
        style={{ width: 100, color: 'rgba(0,0,0,0.65)' }}
        bordered={false}
        onChange={(e) => onBrandChange(e)}
      >
        {brandOption.map((item) => {
          return (
            <Option key={item.label} value={item.value}>
              {item.label}
            </Option>
          );
        })}
      </Select>
    </div>
  );
};
