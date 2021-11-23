import React, { useEffect, useState } from 'react';
import { useLayerGroup } from '@antv/dipper';
import { brandRevenue, marketShare } from '../../configs/mock';
import { PieChart } from '../../components/Pie';
import { LineCahrt } from '../../components/Line';

export function MeshChart() {
  const { selectFeatures } = useLayerGroup('grid');
  const [pieData, setPieData] = useState([]);
  const [lineData, setLineData] = useState([]);
  const [loding, setLoding] = useState(false);

  useEffect(() => {
    setLoding(true);
    setTimeout(() => {
      setLoding(false);
      setPieData(marketShare());
      setLineData(brandRevenue());
    }, 300);
  }, [JSON.stringify(selectFeatures)]);

  return (
    <div style={{ padding: '0 15px' }}>
      <div>
        <h4>行业市场份额</h4>
        <PieChart data={pieData || []} legend={false} loading={loding} />
      </div>
      <div>
        <h4>各品牌营收</h4>
        <LineCahrt data={lineData} loading={loding} />
      </div>
    </div>
  );
}
