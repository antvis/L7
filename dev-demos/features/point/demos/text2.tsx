// @ts-ignore
import { PointLayer, Scene } from '@antv/l7';
// @ts-ignore
import { GaodeMap} from '@antv/l7-maps';
import React, { useEffect } from 'react';
  
export default () => {
    useEffect( () => {
        const scene = new Scene({
            id: 'map',
            map: new GaodeMap({
              center: [ 110, 36 ],
              style: 'blank',
              zoom: 3
            })
          });
          scene.on('loaded', () => {
            fetch('https://mdn.alipayobjects.com/afts/file/A*N5AuT5BKK3gAAAAAAAAAAAAADrd2AQ/china_point.json')
              .then(res => res.json())
              .then(data => {
                const pointLayer1 = new PointLayer({})
                  .source(data)
                  .shape('circle')
                  .size(5)
                  .color('blue')
                  .style({
                    stroke: '#f00',
                    strokeWidth: 2,
                    offset: [ 10, 10 ]
                  })
                const pointLayer = new PointLayer({})
                  .source(data)
                  .shape('NAME', 'text')
                  .size(12)
                  .color('red')
                  .scale('Alignment', {
                    type: 'cat',
                    range: [ '1', '2', '3' ],
                  })
                  .style({
                    // textAllowOverlap: true,
                    textAnchor: {
                      field:'Alignment',
                      value:[ 'left', 'top', 'right' ],
                    },// 文本相对锚点的位置 center|left|right|top|bottom|top-left
                    // textOffset: {
                    //     field:'Location',
                    //     value: (v)=>{
                    //         return [v *2, 10+ 20* Math.random()]
                    //     }
                    // }, // 文本相对锚点的偏移量 [水平, 垂直]
                    spacing: 2, // 字符间距
                    padding: [ 1, 1 ], // 文本包围盒 padding [水平，垂直]，影响碰撞检测结果，避免相邻文本靠的太近
                    stroke: '#ffffff', // 描边颜色
                    strokeWidth: 2, // 描边宽度
                    strokeOpacity: 1.0
                  });
                scene.addLayer(pointLayer1);
                scene.addLayer(pointLayer);

              });
          
          });

          return ()=>{
            scene.destroy();
          }
          
    }, []);
    return (
      <div
        id="map"
        style={{
          height: '500px',
          position: 'relative',
        }}
      />
    );
  };
  