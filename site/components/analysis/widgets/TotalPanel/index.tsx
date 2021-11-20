import React, { useState, useEffect } from 'react';
import { useLayerGroup } from '@antv/dipper'
import { Button, List } from 'antd';
import { multidimensionalChart, operation } from '../../configs/mock';
import style from './index.module.css'
import { LineCahrt } from '../../components/Line';

enum Sort {
  Up,
  Dowm,
}

const No1 =
  'https://gw.alipayobjects.com/mdn/rms_58ab56/afts/img/A*grCBQ4izMjcAAAAAAAAAAAAAARQnAQ';
const No2 =
  'https://gw.alipayobjects.com/mdn/rms_58ab56/afts/img/A*r0DyQIluJ8QAAAAAAAAAAAAAARQnAQ';
const No3 =
  'https://gw.alipayobjects.com/mdn/rms_58ab56/afts/img/A*5R92QrzHW7YAAAAAAAAAAAAAARQnAQ';

export function TotalPanel() {
  const { selectFeatures = [] } = useLayerGroup('grid');

  const [lineData, setLineData] = useState([]);
  const [orderData, setOrderData] = useState([]);
  const [ordersort, setOrderSort] = useState<Sort>(1);
  const [loading, setLoading] = useState(false);

  // lineChart
  useEffect(() => {
    setLoading(true)
    setTimeout(()=>{
      setLoading(false)
      setLineData(multidimensionalChart());
    },300)
  }, [JSON.stringify(selectFeatures)]);

  useEffect(() => {
    if (ordersort === undefined) {
      return setOrderData(operation());
    }
    const sortData = operation();
    if (ordersort === 0) {
      return setOrderData(
        sortData.sort((a, b) => a.order_count - b.order_count),
      );
    }
    if (ordersort === 1) {
      return setOrderData(
        sortData.sort((a, b) => b.order_count - a.order_count),
      );
    }
  }, [selectFeatures, ordersort]);

  // 排序
  const sorts = (type: Sort) => {
    setOrderSort(type);
  };

  // orderData index 与 icon 映射
  const iconOrder = { 1: No1, 2: No2, 3: No3 };

  return (
    <div style={{ overflow: 'auto', height:'560px'}}>
      <div>
        <h4>铺设进程</h4>
        <LineCahrt data={lineData} loading={loading}/>
      </div>
      <div className={styles.orderCon}>
        <div className={styles.teamcontainer}>
          <div>团队榜单</div>
          <div>
            <Button
              type={ordersort === 1 ? 'link' : 'text'}
              className={styles.sort}
              onClick={() => sorts(1)}
            >
              正序
            </Button>
            <Button
              type={ordersort === 0 ? 'link' : 'text'}
              className={styles.sort}
              onClick={() => sorts(0)}
            >
              倒叙
            </Button>
          </div>
        </div>
        {orderData && (
          <List
            dataSource={orderData}
            renderItem={(item, index) => (
              <List.Item>
                <div className={styles.orderlist}>
                  <div className={styles.leftpart}>
                    {index <= 2 ? (
                      <img
                        src={iconOrder[index + 1]}
                        className={styles.ordericon}
                      />
                    ) : (
                      <div>{index + 1}</div>
                    )}
                    <span>
                      {item.name}({item.staff_no})
                    </span>
                  </div>
                  <div>作业成功{item.order_count}单</div>
                </div>
              </List.Item>
            )}
          />
        )}
      </div>
    </div>
  );
}
