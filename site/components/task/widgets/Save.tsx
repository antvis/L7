import { SaveOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import React from 'react';

export function Save() {
  return (
    <Button type="text" icon={<SaveOutlined />}>
      保存
    </Button>
  );
}
