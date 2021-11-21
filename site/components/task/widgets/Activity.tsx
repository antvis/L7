import { Select } from 'antd';
import React, { useState,useEffect } from 'react';
import { ActivityOption } from '../configs/mock';

const { Option } = Select

export function Activity() {

  const [active,setActive] = useState<string>()

  useEffect(()=>{
    setActive(ActivityOption[0].value)
  },[])

  return(
    <Select value={active} bordered={false}
    onChange={(e)=> setActive(e)}>
      { ActivityOption.map((item)=>{
        return(
          <Option value={item.value} key={item.label}>{item.label}</Option>
        )
      })}
    </Select>
  )
}
