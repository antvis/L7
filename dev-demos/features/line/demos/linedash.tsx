// @ts-ignore
import { LineLayer, PointLayer, Scene } from '@antv/l7';
// @ts-ignore
import { GaodeMapV1 } from '@antv/l7-maps';
import React, { useEffect } from 'react';

export default () => {
  useEffect(() => {
    const scene = new Scene({
      id: 'map',
      map: new GaodeMapV1({
        center: [116.3956, 39.9392],
        zoom: 10,
        style:'light'
        // style: 'amap://styles/wine',
      }),
      debug: true,
    });

    scene.on('loaded', () => {
      fetch(
        'https://gw.alipayobjects.com/os/basement_prod/0d2f0113-f48b-4db9-8adc-a3937243d5a3.json',
      )
        .then((res) => res.json())
        .then((data) => {
          const layer = new LineLayer({})
            .source(data)
            .size(1.5)
            .shape('line')
            .color('标准名称', ['#5B8FF9', '#5CCEA1', '#F6BD16'])
            .active(true)
            .style({
              // lineType: 'dash',
              // dashArray: [5, 5],
            });
          scene.addLayer(layer);

          const point = new PointLayer({})
          .source([{ lng: 116.2, lat: 40 }], {
            parser: {
              type: 'json',
              x: 'lng',
              y: 'lat',
            }
          })
          .size(10)
          .shape('circle')
          .color('#5CCEA1');
          scene.addLayer(point);

          const debugService = scene.getDebugService();
         
          layerAllLoad([layer, point], () => {
            // console.log('debugService id type', debugService.getLog())
            // console.log('debugService id type', debugService.getLog(layer.id))
            // console.log('debugService id type', debugService.getLog('map'))
            console.log('debugService id type', debugService.getLog([layer.id, point.id]))
            // console.log('debugService id type', debugService.getLog([layer.id]))
          })
         
          function layerAllLoad(layers: any[], callback: () => void) {
            let count = 0;
            layers.forEach(l => {
              l.on('inited', () => {
                console.log('***');
                
                count++;
                if(count === layers.length) {
                  setTimeout(() => {
                    callback();
                  }, 100)
                  // callback();
                }
              })
            })
          }
          // setTimeout(()=>{
          //   console.log('lostContext test')
          //   scene.on('webglcontextlost', () => {
          //     console.log('webglcontextlost');
          //   })
          //   // scene.lostContext();
          // },3000)

          // setTimeout(()=>{
          // },3000)
        //   debugService.renderDebug(true);

        //     debugService.on('renderEnd', (renderInfo) => {
        //       console.log('renderEnd', renderInfo);
        //     })


        //     setTimeout(() => {
        //       debugService.renderDebug(false);
        //     }, 200)
        });
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
