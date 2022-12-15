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
              style: 'light',
              zoom: 3
            })
          });
          scene.on('loaded', () => {
            fetch('https://gw.alipayobjects.com/os/rmsportal/oVTMqfzuuRFKiDwhPSFL.json')
              .then(res => res.json())
              .then(data => {
                const pointLayer1 = new PointLayer({})
                  .source(data.list, {
                    parser: {
                      type: 'json',
                      x: 'j',
                      y: 'w'
                    }
                  })
                  .shape('circle')
                  .size(5)
                  .color('red')
                const pointLayer = new PointLayer({})
                  .source(data.list, {
                    parser: {
                      type: 'json',
                      x: 'j',
                      y: 'w'
                    }
                  })
                  .shape('m', 'text')
                  .size(12)
                  .color('w', [ '#0e0030', '#0e0030', '#0e0030' ])
                  .style({
                    // textAllowOverlap: true,
                    textAnchor: 'center', // 文本相对锚点的位置 center|left|right|top|bottom|top-left
                    textOffset: [ 0, 0 ], // 文本相对锚点的偏移量 [水平, 垂直]
                    spacing: 2, // 字符间距
                    padding: [ 1, 1 ], // 文本包围盒 padding [水平，垂直]，影响碰撞检测结果，避免相邻文本靠的太近
                    stroke: '#ffffff', // 描边颜色
                    strokeWidth: 0.3, // 描边宽度
                    strokeOpacity: 1.0
                  });
                scene.addLayer(pointLayer1);
                scene.addLayer(pointLayer);
                setTimeout(()=>{
                  pointLayer.style({
                    textAnchor:'left'
                    // textOffset: [ 40, 40 ], // 文本相对锚点的偏移量 [水平, 垂直]
                  })
                  scene.render()
                },2000)
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
  