import type { ChoroplethLayerProps,IconImageLayerProps } from '@antv/larkmap';
import { ChoroplethLayer, LarkMap,LegendRamp,CustomControl,IconImageLayer} from '@antv/larkmap';
import React, { useEffect, useState } from 'react';
;
const layerOptions: Omit<ChoroplethLayerProps, 'source'> = {
    autoFit: true,
    fillColor: {
      field: '达峰进度条',
      value: [
        '#fee5d9',
        '#fc9272',
        '#fb6a4a',
        '#de2d26',
        '#a50f15',
      ],
      scale: {
       type: 'quantize',
       domain: [0, 100],
       unknown: '#f7f4f9',
    }
    },
    opacity: 1,
    strokeColor: '#ddd',
    lineWidth: 1,
    state: {
      active: { strokeColor: 'green', lineWidth: 1.5, lineOpacity: 0.8 },
      select: { strokeColor: 'red', lineWidth: 1.5, lineOpacity: 0.8 },
    },

    label: {
      field: 'name',
      visible: false,
      style: {
        textAllowOverlap: true,
         fill: '#333', fontSize: 10, stroke: '#aaa', strokeWidth: 1 },
    },
  };
  
  export default () => {
    const [update,setUpdate] = useState<number>()
    const [options, setOptions] = useState(layerOptions);
    const [source, setSource] = useState({
      data: { type: 'FeatureCollection', features: [] },
      parser: {
        type: 'json',
        geometry: 'geometry',
      }
    });

    const [labelsource, setLabelsource] = useState({
        data: { type: 'FeatureCollection', features: [] },
        parser: {
          type: 'json',
          geometry: 'centroid',
        }
      });

  
    useEffect(() => {
      fetch('https://mdn.alipayobjects.com/afts/file/A*7HqFT7he7KoAAAAAAAAAAAAADrd2AQ/12.20%20%E5%90%84%E7%9C%81%E4%BB%BD%E9%A6%96%E8%BD%AE%E6%84%9F%E6%9F%93%E9%AB%98%E5%B3%B0%E6%9C%9F%E9%A2%84%E6%B5%8B.json')
        .then((response) => response.json())
        .then((data: any) => {
          setSource((prevState) => ({ ...prevState, data }));
          setLabelsource((prevState) => ({ ...prevState, data }))
        });
    setInterval(()=>{
        setUpdate(Math.random())
    },2000)
    }, []);
    return (
      <LarkMap mapType="Gaode" style={{ height: '70vh' }}>
        <ChoroplethLayer {...options} source={source} 
        onDataUpdate={()=>{
            console.log('onDataUpdate')
        }} />
        <CustomControl
        position="bottomright"
        className="custom-control-class"
        style={{ background: '#fff', borderRadius: 4, overflow: 'hidden', padding: 16 }}
      > 
        <h3>达峰进度</h3>
        <LegendRamp
        lableUnit="%"
        labels={[ 0,20, 40, 60, 80, 100]}
        colors={[
            '#fee5d9',
            '#fc9272',
            '#fb6a4a',
            '#de2d26',
            '#a50f15',
          ]}
        barWidth={300}
      />
      </CustomControl>
       
      </LarkMap>
    );
  };