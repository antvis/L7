import { SendOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import React from 'react';

export function Send() {
  return(
    <Button type='primary' icon={<SendOutlined rotate={-60} style={{color:'#fff'}}/>}>发布</Button>
  )
}
