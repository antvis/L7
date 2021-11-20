import React, {
  useRef,
  useState,
  useMemo,
  useCallback,
  useEffect,
} from 'react';
import { CheckOutlined, CloseOutlined, EditOutlined } from '@ant-design/icons';
import style from './index.module.css'
import { Input } from 'antd';
import { useLayerGroup, useConfigService } from '@antv/dipper';
import _ from 'loadsh';

export function MeshName() {
  const { selectFeatures, updateProperties } = useLayerGroup('grid');
  const [edit, setEdit] = useState(false);
  const ref = useRef();
  const { setConfig } = useConfigService();

  /**
   * get meshname
   * type []string
   */
  const meshName = useMemo(() => {
    if (!selectFeatures.length) return [];
    return selectFeatures.map((item) => {
      // @ts-ignore
      return item.feature.properties.name;
    });
  }, [JSON.stringify(selectFeatures)]);

  // 修改 网格名称
  const editMeshName = useCallback(() => {
    // @ts-ignore
    const value = ref.current.state.value;
    selectFeatures.forEach((item) => {
      const properties = {
        ...item.feature.properties,
        name: value,
      };
      updateProperties(item.feature, properties);
    });
    setEdit(false);
  }, [JSON.stringify(selectFeatures)]);

  // select more meshname 编辑 网格名称
  const EditMeshName = () => {
    return (
      <>
        {!edit ? (
          <div onClick={() => setEdit(!edit)}>
            <span>{meshName}</span>
            <EditOutlined style={{ paddingLeft: 12 }} />
          </div>
        ) : (
          <div className={styles.edit}>
            <Input defaultValue={meshName} ref={ref} />
            <CheckOutlined
              onClick={editMeshName}
              className={styles.closeicon}
            />
            <CloseOutlined onClick={() => setEdit(false)} />
          </div>
        )}
      </>
    );
  };

  // show 多个网格名称
  const ShowMeshNames = () => {
    return (
      <div style={{ padding: 15 }}>
        {meshName.length >= 2 &&
          meshName.map((s) => {
            return <span key={s}>
              {s}、
              </span>;
          })}
      </div>
    );
  };

  useEffect(() => {
    if (selectFeatures.length) {
      // TODO 报错
      setConfig(`panel.children.1.display`, false);
      setConfig(`panel.children.2.display`, true);
      // setConfig(`panel.children.${findIdMeshchart}.display`, false)
    } else {
      setConfig(`panel.children.1.display`, true);
      setConfig(`panel.children.2.display`, false);
    }
  }, [JSON.stringify(selectFeatures)]);

  return (
    <>
      {meshName && meshName.length ? (
        <div className={styles.meahname}>
          {meshName.length === 1 ? <EditMeshName /> : <ShowMeshNames />}
        </div>
      ) : (
        <h4 style={{ padding: 15 }}>所有网格数据概览</h4>
      )}
    </>
  );
}
