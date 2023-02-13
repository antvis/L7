// @ts-ignore
import { CityBuildingLayer, LineLayer, PolygonLayer, Scene } from '@antv/l7';
// @ts-ignore
import { Mapbox } from '@antv/l7-maps';
import React, { useEffect } from 'react';

export default () => {
  useEffect(() => {
    const scene = new Scene({
      id: 'map',
      map: new Mapbox({
        style: 'dark',
        center: [120.145, 30.238915],
        pitch: 60,
        zoom: 13.2,
      }),
    });
    fetch(
      'https://gw.alipayobjects.com/os/rmsportal/ggFwDClGjjvpSMBIrcEx.json',
    ).then(async (res) => {
      const pointLayer = new CityBuildingLayer();
      pointLayer
        .source(await res.json())
        .size('floor', [0, 500])
        .color('rgba(242,246,250,1.0)')
        .animate({
          enable: true,
        })
        .active({
          color: '#0ff',
          mix: 0.5,
        })
        .style({
          opacity: 0.7,
          baseColor: 'rgb(16, 16, 16)',
          windowColor: 'rgb(30, 60, 89)',
          brightColor: 'rgb(255, 176, 38)',
          sweep: {
            enable: true,
            sweepRadius: 2,
            sweepColor: '#1990FF',
            sweepSpeed: 0.5,
            sweepCenter: [120.145319, 30.238915],
          },
        });
      scene.addLayer(pointLayer);
    });

    fetch(
      'https://gw.alipayobjects.com/os/bmw-prod/67130c6c-7f49-4680-915c-54e69730861d.json',
    )
      .then((data) => data.json())
      .then(({ lakeBorderData, lakeData, landData }) => {
        const lakeLayer = new PolygonLayer()
          .source(lakeData)
          .shape('fill')
          .color('#1E90FF')
          .style({
            opacity: 0.4,
            opacityLinear: {
              enable: true,
              dir: 'out', // in - out
            },
          });
        const landLayer = new PolygonLayer()
          .source(landData)
          .shape('fill')
          .color('#3CB371')
          .style({
            opacity: 0.4,
            opacityLinear: {
              enable: true,
              dir: 'in', // in - out
            },
          });

        const lakeBorderLayer = new PolygonLayer()
          .source(lakeBorderData)
          .shape('fill')
          .color('#ccc')
          .style({
            opacity: 0.5,
            opacityLinear: {
              enable: true,
              dir: 'in', // in - out
            },
          });

        scene.addLayer(lakeLayer);
        scene.addLayer(lakeBorderLayer);
        scene.addLayer(landLayer);
      });

    fetch(
      'https://gw.alipayobjects.com/os/basement_prod/40ef2173-df66-4154-a8c0-785e93a5f18e.json',
    )
      .then((res) => res.json())
      .then((data) => {
        const layer = new LineLayer({
          zIndex: 0,
          depth: true,
        })
          .source(data)
          .size(1)
          .shape('line')
          .color('#1990FF')
          .animate({
            interval: 1, // 间隔
            duration: 2, // 持续时间，延时
            trailLength: 2, // 流线长度
          });
        scene.addLayer(layer);
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
