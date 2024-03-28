### point - earthfill

```tsx
import { PointLayer, Scene, Earth, LineLayer, EarthLayer } from '@antv/l7';
import { GaodeMap, Mapbox } from '@antv/l7-maps';
import React, { useEffect } from 'react';

export default () => {
  useEffect(() => {
    const scene = new Scene({
      id: 'map',
      renderer: process.env.renderer,
      map: new Earth({}),
    });

    // 地球模式下背景色默认为 #000 通过 setBgColor 方法我们可以设置可视化层的背景色
    scene.setBgColor('#333');

    // const earthlayer = new EarthLayer()
    //   .source(
    //     'https://gw.alipayobjects.com/mdn/rms_23a451/afts/img/A*3-3NSpqRqUoAAAAAAAAAAAAAARQnAQ',
    //     {
    //       parser: {
    //         type: 'image',
    //       },
    //     },
    //   )
    // //   .animate(true);
    //   .color('#2E8AE6')
    //   .shape('fill')
    //   .style({
    //     globalOptions: {
    //       ambientRatio: 0.6, // 环境光
    //       diffuseRatio: 0.4, // 漫反射
    //       specularRatio: 0.1, // 高光反射
    //     },
    //   });

    // const atomLayer = new EarthLayer().color('#2E8AE6').shape('atomSphere');

    // const bloomLayer = new EarthLayer()
    //   .color('#fff')
    //   .shape('bloomSphere')
    //   .style({
    //     opacity: 0.7,
    //   });

    scene.on('loaded', () => {
      // scene.addLayer(earthlayer);
      // scene.addLayer(atomLayer);
      // scene.addLayer(bloomLayer);


      const pointLayer = new PointLayer()
        .source({
          type: 'FeatureCollection',
          features: [
            {
              type: 'Feature',
              properties: {},
              geometry: {
                type: 'Point',
                coordinates: [116.5, 39.5],
              },
            },
          ],
        })
        .shape('circle')
        .size(20)
        .color('#ff0000')
        .active(true)
        // .animate({ enable: true })
        .style({
          opacity: 1,
          strokeWidth: 1,
        });

      scene.addLayer(pointLayer);

          fetch(
          'https://gw.alipayobjects.com/os/basement_prod/893d1d5f-11d9-45f3-8322-ee9140d288ae.json',
        )
          .then((res) => res.json())
          .then((data) => {
            const pointLayer1 = new PointLayer({})
              .source(data, {
                parser: {
                  type: 'json',
                  x: 'longitude',
                  y: 'latitude',
                },
              })
              .shape('squareColumn')
              .active(true)
             .size('unit_price', (h) => {
            return [6, 6, 100];
          })
              .color('name', ['#739DFF', '#61FCBF', '#FFDE74', '#FF896F'])
              .style({
                opacity:1,
              })
              ;
            scene.addLayer(pointLayer1);
          });
        // earthlayer.setEarthTime(4.0);
      scene.startAnimate();
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
```
