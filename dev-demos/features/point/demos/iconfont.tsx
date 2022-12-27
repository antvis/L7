// @ts-ignore
import { PointLayer, Scene } from '@antv/l7';
// @ts-ignore
import { GaodeMap, Mapbox } from '@antv/l7-maps';
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

      const fontFamily = 'iconfont';
      // 指定 iconfont 字体文件
      const fontPath =
        '//at.alicdn.com/t/font_2534097_fcae9o2mxbv.woff2?t=1622200439140';
    
      
      scene.on('loaded', () => {
        scene.once('fontloaded',(e)=>{
          const icon1 = new PointLayer()
          .source(
            [
              {
                j: 118.234433,
                w: 35.007936,
                icon: 'icon1',
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
          .shape('icon', 'iconfont')
          .size(30)
          .style({
            stroke: '#ffffff', // 描边颜色
            fontFamily,
          });
          const icon2 = new PointLayer()
          .source(
            [
              {
                j: 115,
                w: 35.007936,
                icon: 'icon1',
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
            fontFamily,
            iconfont: true,
          });
          
          scene.addLayer(icon1);
          scene.addLayer(icon2);
        })

 
        scene.addFontFace(fontFamily, fontPath);     
        scene.addIconFont('icon1', '&#xe6d4;');
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
  