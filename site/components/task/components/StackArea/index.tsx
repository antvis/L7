import React, { useEffect, useRef, useState } from 'react';
import { Area } from '@antv/g2plot';
import { ChatData } from '../Bar';

export function StackAreaChart({ data }: ChatData) {
  const id = useRef();
  const [pieplot, setAreaPlot] = useState<Area>();
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
    if (!pieplot && id.current && list) {
      const area = new Area(id.current, {
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
      setAreaPlot(area);
    } else {
      pieplot.update({
        data: list,
      });
    }
  }, [id.current, data]);

  return <div ref={id} style={{ height: 300 }} />;
}
