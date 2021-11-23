import React, { useState, useEffect } from 'react';
import { useLayerGroup } from '@antv/dipper';
import { SingleLineCahrt } from '../components/SingleLine';
import { singleLineChart, barChart } from '../configs/mock';
import { BarCahrt } from '../components/Bar';

export function MeshIndicator() {
  const { selectFeatures } = useLayerGroup('grid');

  // lineChart
  const [lineData, setLineData] = useState([]);

  const [barData, setBarData] = useState([]);

  // lineChart
  useEffect(() => {
    setLineData(singleLineChart());
    setBarData(barChart());
  }, [JSON.stringify(selectFeatures)]);

  return (
    <div style={{ overflow: 'auto', height:'630px'}}>
      <div>
        <div style={{ margin: '10px 0' }}>交易笔数</div>
        <SingleLineCahrt data={lineData} />
      </div>
      <div>
        <div style={{ margin: '20px 0' }}>各场景覆盖数</div>
        <BarCahrt data={barData} />
      </div>
    </div>
  );
}
