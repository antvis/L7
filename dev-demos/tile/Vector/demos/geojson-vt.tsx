// @ts-ignore
import { Scene, Source, PolygonLayer } from '@antv/l7';
// @ts-ignore
import { Map } from '@antv/l7-maps';
import React, { useEffect } from 'react';

export default () => {
  useEffect(() => {
    const scene = new Scene({
      id: 'geojsonvt',
     
      map: new Map({
        center: [121.268, 30.3628],
        pitch: 0,
        style: 'blank',
        zoom: 4,
      }),
    });

    // https://geo.datav.aliyun.com/areas_v3/bound/330000_full.json

    fetch(
      'https://gw.alipayobjects.com/os/bmw-prod/2b7aae6e-5f40-437f-8047-100e9a0d2808.json',
      // 'https://geo.datav.aliyun.com/areas_v3/bound/330000_full.json',
    )
      .then((d) => d.json())
      .then((data) => {
        const source = new Source(data, {
          parser: {
            type: 'geojsonvt',
            tileSize: 256,
            zoomOffset: 0,
            maxZoom: 9,
            // extent: [-180, -85.051129, 179, 85.051129],
          },
        });

        const polygon = new PolygonLayer({
          featureId: 'COLOR',
          // featureId: 'name',
        })
          .source(source)
          .color('COLOR')
          // .color('name', v => getColor(v))
          .shape('fill')
          // .active(true)
          .select(true)
          .style({
            opacity: 1,
          });
        scene.addLayer(polygon);
        // polygon.on('mousemove',(e)=>{
        //   console.log(e)
        // })

        setTimeout(() => {
          console.log('change data');
          fetch(
            // 'https://gw.alipayobjects.com/os/bmw-prod/2b7aae6e-5f40-437f-8047-100e9a0d2808.json',
            'https://geo.datav.aliyun.com/areas_v3/bound/330000_full.json',
          ).then(res => res.json()).then(data => {
            polygon
            .setData(data)
            .color('name', v => getColor(v))
            .style({
              featureId: 'name',
            })
          })
        }, 3000);

        function getColor(name: string) {
          if(name === '杭州市') {
            return '#ffffee';
          } else if(name === '宁波市') {
            return '#ffffd9';
          } else if(name === '温州市') {
            return '#ffffcc';
          } else if(name === '嘉兴市') {
            return '#edf8b1';
          } else if(name === '湖州市') {
            return '#c7e9b4';
          } else if(name === '绍兴市') {
            return '#7fcdbb';
          } else if(name === '金华市') {
            return '#41b6c4';
          } else if(name === '衢州市') {
            return '#1d91c0';
          } else if(name === '舟山市') {
            return '#225ea8';
          } else if(name === '台州市') {
            return '#253494';
          } else if(name === '丽水市') {
            return '#081d58';
          }
        }
      });
  }, []);
  return (
    <div
      id="geojsonvt"
      style={{
        height: '60vh',
        position: 'relative',
      }}
    />
  );
};
