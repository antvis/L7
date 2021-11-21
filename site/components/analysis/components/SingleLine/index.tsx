import React, { useEffect, useRef, useState } from 'react';
import { Line } from '@antv/g2plot';
import { ChatData } from '../Bar';

export function SingleLineCahrt({ data }: ChatData) {
  const id = useRef();
  const [lineplot, setLinePlot] = useState<Line>();


  useEffect(() => {
    if (!lineplot && id.current && data) {
      const area = new Line(id.current, {
        data,
        autoFit: true,
        xField: 'xField',
        yField: 'yField',
      });
      area.render();
      setLinePlot(area);
    }else{
      lineplot.update({
        data
      })
    }
  }, [id.current,data]);

  return <div ref={id} style={{height:300}}/>;
}
