// @ts-ignore
import { PointLayer, Scene } from '@antv/l7';
// @ts-ignore
import { GaodeMap, Mapbox } from '@antv/l7-maps';
import React, { useEffect } from 'react';
  
export default () => {
    useEffect( () => {
      const scene = new Scene({
        id: 'map',
        renderer: process.env.renderer,
        map: new GaodeMap({
          center: [ 110, 36 ],
          style: 'light',
          zoom: 3
        })
      });

      const fontFamily = 'iconfont';
      // 指定 iconfont 字体文件
      const fontPath =
        '//at.alicdn.com/t/font_2534097_fcae9o2mxbv.woff2?t=1622200439140';
    
      
      scene.on('loaded', () => {
        scene.once('fontloaded',(e)=>{
          const imageLayer = new PointLayer()
          .source(
            [
              {
                j: 118.234433,
                w: 35.007936,
                icon: 'icon1',
                value: 10,
                name: 'AA',
                type: 'dibiaoshui',
              },
            ],
            {
              parser: {
                type: 'json',
                x: 'j',
                y: 'w',
              },
            },
          )
          .color('#f00')
          .shape('icon', 'text')
          .size(30)
          .style({
            // textAnchor: 'center', // 文本相对锚点的位置 center|left|right|top|bottom|top-left
            // textOffset: [ 40, 0 ], // 文本相对锚点的偏移量 [水平, 垂直]
            padding: [0, 0], // 文本包围盒 padding [水平，垂直]，影响碰撞检测结果，避免相邻文本靠的太近
            stroke: '#ffffff', // 描边颜色
            fontFamily,
            iconfont: true,
            textAllowOverlap: true,
            rotation: 90,
          });
          console.log(imageLayer);
            scene.addLayer(imageLayer);
          // }
          
        })

 
        scene.addFontFace(fontFamily, fontPath);     
        scene.addIconFont('icon1', '&#xe6d4;');
   
          // 全局添加资源

      // 全局添加 iconfont 字段的映射;

        
       
      });

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
  