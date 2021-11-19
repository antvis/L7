import React, { useState, useMemo } from 'react'
import { useLayerGroup } from '@antv/dipper'
import { Alert, Button, Select } from 'antd'
import { personOption, selectActivityItem } from '../../configs/mock'
import style from './index.less'

const { Option } = Select

export function ActivityTask() {
  const selecticon = 'https://gw.alipayobjects.com/mdn/rms_58ab56/afts/img/A*kyI9T7Lrej4AAAAAAAAAAAAAARQnAQ'
  const emptyicon = 'https://gw.alipayobjects.com/mdn/rms_58ab56/afts/img/A*H9dxSp69pi0AAAAAAAAAAAAAARQnAQ'
  const { selectFeatures = [] } = useLayerGroup('grid')
  const [current, setCurrent] = useState(selectActivityItem[0]?.value)

  const selectItem = (item) => {
    setCurrent(item)
  }

  const alertMsg = useMemo(() => {
    if (selectFeatures.length === 2) {
      return '勾选多个网格中，批量分配后将一起更新数据'
    }
    if (selectFeatures.length >= 3) {
      return '你当前多选网格中包含已分配网格，无法批量分配，建议选择单个网格、或选择多个未分配网格的批量操作'
    }
    return '';
  }, [JSON.stringify(selectFeatures)]);

  const HasSelectFeature = () => {
    return (
      <div>
        <div style={{ margin: '0 20px 20px' }}>
          {selectFeatures.length >= 2 && <Alert
            style={{ display:'flex', alignItems:'baseline' }}
            message={alertMsg}
            type="warning" showIcon
          />}
        </div>
        <div className={style.selectactivity}>
          <h4>选择活动</h4>
          <div className={style.select}>
            {selectActivityItem && selectActivityItem.map((item) => {
              return (
                <div key={item.label}
                  onClick={() => selectItem(item.value)}
                  style={{
                    border: current === item.value ? '1px solid #1E73F8' : '1px solid rgba(0,0,0,0.15)',
                  }}
                  className={style.selectitem}>
                  <img className={style.icon} src={item.icon} />
                  <span>{item.label}</span>
                  {current === item.value && <img className={style.selecticon} src={selecticon} />}
                </div>
              )
            })}
          </div>
        </div>
        <div style={{ margin: '0 20px' }}>
          <h4>分配人员</h4>
          <Select mode="multiple" style={{ width: '100%' }}
            showArrow defaultValue={['吴家豪', '周星星']}>
            {personOption().map((item) => {
              return (
                <Option key={item.label} value={item.value}>{item.label}</Option>
              )
            })}
          </Select>
        </div>
        <div className={style.submit}>
          <Button style={{ marginRight: 8 }}>取消</Button>
          <Button type='primary'>确定</Button>
        </div>
      </div>
    )
  }

  const Empty = () => {
    return (
      <div className={style.empty}>
        <img src={emptyicon} />
        <span>暂无数据</span>
      </div>
    )
  }

  return (
    <div className={style.task}>
      {!selectFeatures.length ? <Empty /> : <HasSelectFeature />}
    </div>
  )
}
