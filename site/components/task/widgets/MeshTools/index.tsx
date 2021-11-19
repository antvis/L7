import React, { useMemo, useState, useRef } from 'react';
import styles from './index.less'
import { MeshSplitSvg, MeshMergeSvg } from './SvgElement';
import { useLayerGroup } from '@antv/dipper'
import { Input, message, Modal, Popconfirm, Tooltip } from 'antd';


export function MeshTools() {
  const { selectFeatures = [] } = useLayerGroup('grid')
  const [visible, setVisible] = useState(false)
  const refs = useRef()

  const disable = { cursor: 'pointer', opacity: 1 }
  const noDisable = { cursor: 'not-allowed', opacity: 0.25 }

  const cssPropsSplit = useMemo(() => {
    if (selectFeatures.length === 1) return disable;
    return noDisable;
  }, [JSON.stringify(selectFeatures)]);

  const cssPropsMerge = useMemo(() => {
    if (selectFeatures.length >= 2) {
      return disable
    }
    return noDisable;
  }, [JSON.stringify(selectFeatures)]);

  const splitMesh = () => {
    // TODO 根据业务实现
  }

  const mergrMesh = () => {
    // @ts-ignore
    const value = refs.current.state.value
    if (!value) {
      return message.error('请输入要合并后的名称')
    }
    // TODO 根据业务实现
    setVisible(false)
  }

  return (
    <div className={styles.meshTools}>
      <Tooltip placement="left"
        title={selectFeatures.length === 1 ? '选择单个网格，可以拆分' : null}>
        <Popconfirm
          disabled={selectFeatures.length !== 1}
          placement='left'
          title='该网格将被拆分成xx个基础网格，你确定要拆分吗？'
          onConfirm={splitMesh}
          okText='确定'
          trigger='click'
          cancelText='取消'
        >
          <div style={{ ...cssPropsSplit }}>
            <MeshSplitSvg />
            <div style={{ width: 32 }}>网格拆分</div>
          </div>
        </Popconfirm>

      </Tooltip>

      <Tooltip placement='left'
        title={selectFeatures.length >= 2 ? '选择多个网格，可以合并' : null}>
        <div style={{ ...cssPropsMerge }} onClick={() => setVisible(true)}>
          <MeshMergeSvg />
          <div style={{ width: 32 }}>网格合并</div>
        </div>
      </Tooltip>

      <Modal title='网格合并'
        okText='确认' cancelText='取消'
        visible={visible} onOk={mergrMesh}
        onCancel={() => setVisible(false)}
      >
        <h4>合并后的新网格名称</h4>
        <Input ref={refs} placeholder='请输入名称' />
      </Modal>

    </div>
  )
}
