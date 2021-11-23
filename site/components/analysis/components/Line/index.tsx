import React, { useEffect, useRef, useState } from 'react';
import { Line } from '@antv/g2plot';
import { ChatData } from '../Bar';
import { Spin } from 'antd';

export function LineCahrt({ data, loading }: ChatData) {
  const id = useRef();
  const [lineplot, setLinePlot] = useState<Line>();

  useEffect(() => {
    if (!lineplot && id.current && data) {
      const lineplot = new Line(id.current, {
        data,
        autoFit: true,
        xField: 'xField',
        yField: 'yField',
        seriesField: 'series',
        legend: {
          position: 'top-left',
        },
      });
      lineplot.render();
      setLinePlot(lineplot);
    } else {
      lineplot.update({
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
