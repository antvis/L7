import React, { useEffect, useRef, useState } from 'react';
import { Pie } from '@antv/g2plot';
import { ChatData } from '../Bar';
import { Spin } from 'antd';

export function PieChart({ data, legend, loading }: ChatData) {
  const id = useRef();
  const [pieplot, setPiePlot] = useState<Pie>();

  useEffect(() => {
    if (!pieplot && id.current && data) {
      const pie = new Pie(id.current, {
        data,
        autoFit: true,
        angleField: 'xField',
        colorField: 'yField',
        radius: 0.7,
        label: {
          type: 'spider',
          labelHeight: 28,
          content: '{name}\n{percentage}',
        },
        legend: legend
          ? {
              position: 'top-left',
            }
          : false,
      });

      pie.render();
      setPiePlot(pie);
    } else {
      pieplot.update({
        data,
      });
    }
  }, [id.current, data]);

  return (
    <Spin spinning={loading}>
      <div ref={id} style={{ height: 300 }} />
    </Spin>
  );
}
