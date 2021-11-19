import { Select } from 'antd';
import React,{ useState,useEffect } from 'react';
import { StatusOption } from '../configs/mock';

const { Option } = Select

export function Status() {

  const [status,setStatus] = useState<string>()

  useEffect(()=>{
    setStatus(StatusOption[0].value)
  },[])

  return(
    <Select value={status} bordered={false}
    onChange={(e)=> setStatus(e)}>
      { StatusOption.map((item)=>{
        return(
          <Option value={item.value} key={item.label}>{item.label}</Option>
        )
      })}
    </Select>
  )
}
