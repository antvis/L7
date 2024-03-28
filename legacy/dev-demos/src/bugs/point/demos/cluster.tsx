// @ts-ignore
import { PointLayer,LineLayer, Scene } from '@antv/l7';
// @ts-ignore
import {GaodeMap } from '@antv/l7-maps';
import React, { useEffect } from 'react';
  
export default () => {
    useEffect( () => {

const scene = new Scene({
    id: "map",
    map: new GaodeMap({
      center: [110, 36],
      style: "light",
      zoom: 5
    })
  });
  scene.on("loaded", () => {
    fetch("https://gw.alipayobjects.com/os/rmsportal/oVTMqfzuuRFKiDwhPSFL.json")
      .then((res) => res.json())
      .then((data) => {
        const pointLayer = new PointLayer({
            
        })
          .source(data.list, {
            cluster: true,
            // clusterOptions:{
            //     radius: 10,
            // },
            parser: {
              type: "json",
              x: "j",
              y: "w"
            }
          })
          .filter("point_count", (value) => value > 1)
          .shape("point_count", "text")
        //   .shape("circle")
          .size(18)
          .color("black")
          .style({
            textAnchor: "center", // 文本相对锚点的位置 center|left|right|top|bottom|top-left
            textOffset: [0, 0], // 文本相对锚点的偏移量 [水平, 垂直]
            spacing: 2, // 字符间距
            padding: [1, 1], // 文本包围盒 padding [水平，垂直]，影响碰撞检测结果，避免相邻文本靠的太近
            stroke: "#f00", // 描边颜色
            strokeWidth: 0.3, // 描边宽度
            strokeOpacity: 1.0,
            // textAllowOverlap: true,
          });
  
        scene.addLayer(pointLayer);
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
  