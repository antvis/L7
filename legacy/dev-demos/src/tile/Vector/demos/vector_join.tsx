// @ts-ignore
import { Scene, Source, PolygonLayer } from "@antv/l7";
// @ts-ignore
import { GaodeMap } from "@antv/l7-maps";

import React, { useEffect } from 'react';

export default () => {
  useEffect(() => {
    const heatData = [
        {
          adcode: `B000A8UIN8`,
          value: 2,
          fillColor: "red"
        }
      ];
      
      const scene = new Scene({
        id: "map",
        map: new GaodeMap({
          style: "amap://styles/whitesmoke",
          zoom: 13.5, // 级别 高德 （3-18）
          center: [116.397224, 39.919406] // 中心点坐标,默认北京
        })
      });
      
      const url = "https://gridwise.alibaba-inc.com/tile/test?z={z}&x={x}&y={y}";
      const source = new Source(url, {
        parser: {
          type: "mvt",
          tileSize: 256
        },
        transforms: [
            {
             type: "map",
                callback: (row) => {
                    row.space_name = row.space_name.replaceAll(' ','');
                    row.space_id = row.space_id.replaceAll(' ','');
                    return row;
                }

            },
          {
            type: "join",
            data: heatData || [],
            sourceField: "adcode" /** 热力数据的key */,
            targetField: "space_id" /** 围栏数据的key */
          }
        ]
      });
      
      scene.on("loaded", () => {
        const layer = new PolygonLayer({
          featureId: "space_id",
          sourceLayer: "default"
        })
          .source(source)
          .shape("fill")
          .size(10)
          .style({
            opacity: 0.8
          })
          .select(true)
          .color("fillColor*space_id", (val,space_id) => {
            return val || "white";
          });
        layer.on("click", (ev) => {
          console.log("ev", ev);
        });
        scene.addLayer(layer);
      });
   
  }, []);
  return (
    <div
      id="map"
      style={{
        height: '60vh',
        position: 'relative',
      }}
    />
  );
};
