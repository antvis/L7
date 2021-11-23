import React, { useEffect, useRef, useState } from 'react';
import { Line } from '@antv/g2plot';
import { ChatData } from '../Bar';

export function LineChart({ data }: ChatData) {
  const id = useRef();
  const [lineplot, setLinePlot] = useState<Line>();
  const [list, setData] = useState([]);

  useEffect(() => {
    fetch(
      'https://gw.alipayobjects.com/os/bmw-prod/b21e7336-0b3e-486c-9070-612ede49284e.json',
    )
      .then((res) => res.json())
      .then((data) => {
        setData(data);
      });
  }, []);

  useEffect(() => {
    if (!lineplot && id.current && list) {
      const area = new Line(id.current, {
        data: list,
        autoFit: true,
        xField: 'date',
        yField: 'value',
        seriesField: 'country',
        legend: {
          position: 'top-left',
        },
      });
      area.render();
      setLinePlot(area);
    } else {
      lineplot.update({
        data: list,
      });
    }
  }, [id.current, list]);

  return <div ref={id} style={{ height: 300 }} />;
}
