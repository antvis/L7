import React, { useState, useEffect } from "react";
import { Dropdown, Input, Menu, Select } from 'antd';
import { SearchOutlined } from "@ant-design/icons";
import { personOption } from "../configs/mock";

const { Search } = Input
const { Option } = Select

// 此功能 仅做展示，以实际业务为准
export function SearchPerson() {

  const [persons, setPersons] = useState([])
  const [visible, setVisible] = useState(false)

  const onSearch = (e) => {
    const value = e.target.value
    setTimeout(() => {
      if (value) {
        setPersons(personOption())
        setVisible(true)
      } else {
        setPersons([])
        setVisible(false)
      }

    }, 300)
  }

  // 人员搜索
  const onSelect = (value) =>{
    // TODO 根据业务实现
  }

  const menu = (
    <Menu>
      <Menu.Item key="1">
        {persons && persons.map((item) => {
          return (
            <div key={item.label}
              onClick={()=>onSelect(item.value)}
              style={{ paddingBottom: '5px' }}
            >{item.label}</div>
          )
        })}
      </Menu.Item>
    </Menu>
  );

  return (
    <div style={{ background:'#fff'}}>
      <Dropdown overlay={menu} visible={visible}>
        <Input bordered={false}
          placeholder="搜索网格名称/人员名称"
          prefix={<SearchOutlined />}
          onChange={onSearch}
        />
      </Dropdown>
    </div>
  )
}
