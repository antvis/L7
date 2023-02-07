import { ILayer, PolygonLayer, Scene } from '@antv/l7';
import { Button } from 'antd';

import { Map } from '@antv/l7-maps';
import React, { useEffect, useState } from 'react';
import { addLayers, useData } from './useLine';

export default () => {
  const { geoData } = useData();
  const [filllayer, setFillLayer] = useState<ILayer>();
  const [mapScene, setScene] = useState<Scene>();
  const colors = [
    ['#7fc97f', '#beaed4', '#fdc086', '#ffff99', '#386cb0'],
    ['#1b9e77', '#d95f02', '#7570b3', '#e7298a', '#66a61e'],
    ['#a6cee3', '#1f78b4', '#b2df8a', '#33a02c', '#fb9a99'],
    ['#fbb4ae', '#b3cde3', '#ccebc5', '#decbe4', '#fed9a6'],
    ['#e41a1c', '#377eb8', '#4daf4a', '#984ea3', '#ff7f00'],
    ['#8dd3c7', '#ffffb3', '#bebada', '#fb8072', '#80b1d3'],
  ];

  useEffect(() => {
    const scene = new Scene({
      id: 'map',
      map: new Map({
        pitch: 0,
        style: 'light',
        center: [-96, 37.8],
        zoom: 3,
      }),
    });
    if (geoData) {
      const layer = new PolygonLayer({})
        .source(geoData.county, {
          transforms: [
            {
              type: 'join',
              sourceField: 'id',
              targetField: 'id',
              data: geoData.unemploymentdata,
            },
          ],
        })
        .shape('fill')
        .color('name', colors[0])
        .style({
          opacity: 1,
        });

      scene.addLayer(layer);
      setScene(scene);

      setFillLayer(layer);
      layer.on('legend:color', (color) => {
        console.log('color', color);
      });
      addLayers(geoData, scene, layer);
    }
    return () => {
      scene.destroy();
    };
  }, [geoData]);

  const changeColor = () => {
    const index = Math.round(Math.random() * 6);
    filllayer?.color('name', colors[index]);
    mapScene?.render();
    console.log(filllayer?.getLegend('color'));
  };

  return (
    <div>
      <div
        id="map"
        style={{
          height: '500px',
          position: 'relative',
        }}
      />

      <Button onClick={changeColor} type="primary" size={'large'}>
        更新颜色
      </Button>
    </div>
  );
};
