import React, { useEffect, useRef, useState } from 'react';
import { Bar } from '@antv/g2plot';

export interface ChatData {
  data: object[];
}

export function BarChart({ data }: ChatData) {
  const id = useRef();
  const [barplot, setBarplot] = useState<Bar>();
  useEffect(() => {
    if (!barplot && id.current) {
      const bar = new Bar(id.current, {
        // @ts-ignore
        data: data.sort((a, b) => b.xField - a.xField),
        autoFit: true,
        xField: 'xField',
        yField: 'yField',
        xAxis: false,
        label: {
          position: 'left',
          style: {
            fill: '#fff',
          },
        },
        legend: {
          position: 'top-left',
        },
      });

      bar.render();
      setBarplot(bar);
    }
  }, []);

  return <div ref={id} style={{ height: 300 }} />;
}
