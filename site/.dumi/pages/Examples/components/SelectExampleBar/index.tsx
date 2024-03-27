import { SearchOutlined } from '@ant-design/icons';
import { Button, Input, Select } from 'antd';
import React, { useMemo, useState } from 'react';
import styles from './index.module.less';

const SelectBar: React.FC<any> = ({ exampleTopics, onFilterChange }) => {
  const [selectValue, setSelectValue] = useState<string[]>([]);
  const [searchvalue, setSearchValue] = useState<string>('');

  const selectOptions = useMemo(() => {
    return exampleTopics.map((item) => {
      return {
        value: item.title.en,
        label: item.title.zh,
      };
    });
  }, [exampleTopics]);

  const onReset = () => {
    setSelectValue([]);
    setSearchValue('');
    onFilterChange('', []);
  };

  return (
    <div className={styles.main}>
      <Input
        addonBefore={<SearchOutlined />}
        onChange={(v) => {
          setSearchValue(v.target.value);
          onFilterChange(v.target.value, selectValue);
        }}
        value={searchvalue}
        allowClear
        style={{ width: '200px' }}
        placeholder="搜索"
      />
      <Select
        mode="multiple"
        allowClear
        style={{ width: '100%' }}
        placeholder="选择类型"
        defaultValue={[]}
        value={selectValue}
        onChange={(value) => {
          setSelectValue(value);
          onFilterChange(searchvalue, value);
        }}
        style={{ width: 400 }}
        options={selectOptions}
      />
      <Button type="primary" onClick={onReset}>
        重置
      </Button>
    </div>
  );
};

export default SelectBar;
