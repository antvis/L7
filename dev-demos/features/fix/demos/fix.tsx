// @ts-ignore
import { Scene, PolygonLayer } from '@antv/l7';
// @ts-ignore
import { GaodeMap } from '@antv/l7-maps';
import React, { useEffect } from 'react';

export default () => {
  useEffect(() => {

    const scene = new Scene({
      id: "map",
      map: new GaodeMap({
        center: [120, 30],
        zoom: 4
      })
    });
    
    const dataList = [
      { name: "杭州", data: '#f00' },
      { name: "北京", data: '#ff0' }
    ];
    const dataList2 = [{ name: "杭州", data: '#0f0' }];
    
    const geo = {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          properties: {
            color: "#f00",
            name: "杭州"
          },
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [113.8623046875, 31.031055426540206],
                [116.3232421875, 32.031055426540206],
                [116.3232421875, 32.590574094954192]
              ]
            ]
          }
        },
        {
          type: "Feature",
          properties: {
            color: "#ff0",
            name: "北京"
          },
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [111.8623046875, 30.031055426540206],
                [112.3232421875, 30.031055426540206],
                [113.3232421875, 31.090574094954192]
              ]
            ]
          }
        }
      ]
    };

    const geo2 = {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          properties: {
            color: "#f00",
            name: "杭州"
          },
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [113.8623046875, 31.031055426540206],
                [116.3232421875, 32.031055426540206],
                [116.3232421875, 32.590574094954192]
              ]
            ]
          }
        },
      ]
    };
    
    const layer = new PolygonLayer()
      .source(geo, {
        transforms: [
          {
            type: "join",
            sourceField: "name", //data1 对应字段名
            targetField: "name", // data 对应字段名 绑定到的地理数据
            data: dataList
          }
        ]
      })
      .shape("fill")
      .color("data", (c) => c)
    
    scene.on("loaded", () => {
      scene.addLayer(layer);
    
      setTimeout(() => {
        layer.setData(geo2, {
          transforms: [
            {
              type: "join",
              sourceField: "name", //data1 对应字段名
              targetField: "name", // data 对应字段名 绑定到的地理数据
              data: dataList2
            }
          ]
        })
        .color("data", (c) => c);
      }, 2000);
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
