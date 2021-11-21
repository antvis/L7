import React, { useEffect, useRef, useState } from 'react';
import { Pie } from '@antv/g2plot';
import { ChatData } from '../Bar';

export function PieChart({ data }: ChatData) {
  const id = useRef();
  const [pieplot, setPiePlot] = useState<Pie>();

  useEffect(() => {
    if (!pieplot && id.current && data) {
      const bar = new Pie(id.current, {
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
        legend: {
          position: 'top-left',
        },
      });

      bar.render();
      setPiePlot(bar);
    }
  }, [id.current, data]);

  return <div ref={id} style={{ height: 300 }} />;
}
