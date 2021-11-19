import { DownOutlined } from "@ant-design/icons";
import { Dropdown, Menu, Switch } from "antd";
import React from "react";
import style from './index.less'

export function MapExhibit() {
  const onChange = (e) => {
    // TODO 根据业务实现
    console.log(e)
  }
  const menu = (
    <Menu>
      <Menu.Item key="1">
        <div className={style.exhibititem}>
          <div style={{ marginRight: 50 }}>地图放大展示分配人员</div>
          <Switch defaultChecked size='small' onChange={onChange} />
        </div>
      </Menu.Item>
    </Menu>
  );

  return (
    <Dropdown overlay={menu}>
      <div className={style.dropdown} >
        地图展示<DownOutlined className={style.dropicon} />
      </div>
    </Dropdown>
  )
}
