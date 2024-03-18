// @ts-ignore
import {
  LineLayer,
  Scene,
  // @ts-ignore
} from '@antv/l7';
// @ts-ignore
import { GaodeMap, Map } from '@antv/l7-maps';
import React, { useEffect } from 'react';
export default () => {
  useEffect(() => {
    const scene = new Scene({
      id: 'map',
      renderer: process.env.renderer,
      map: new GaodeMap({
        center: [105, 32],
        zoom: 4,
        style: 'dark',
        // pitch: 60
      }),
    });

    const dataloc = {
      "type": "FeatureCollection",
      "features": [
        {
          "type": "Feature",
          "properties": {},
          "geometry": {
            "type": "Point",
            "coordinates": [116.340206, 39.975867]
          }
        },
        {
          "type": "Feature",
          "properties": {},
          "geometry": {
            "type": "Point",
            "coordinates": [87.566017, 43.847704]
          }
        },
        {
          "type": "Feature",
          "properties": {},
          "geometry": {
            "type": "Point",
            "coordinates": [101.75512, 36.618784]
          }
        },
        {
          "type": "Feature",
          "properties": {},
          "geometry": {
            "type": "Point",
            "coordinates": [121.481053, 31.232806]
          }
        },
        {
          "type": "Feature",
          "properties": {},
          "geometry": {
            "type": "Point",
            "coordinates": [118.795822, 32.140052]
          }
        },
        {
          "type": "Feature",
          "properties": {},
          "geometry": {
            "type": "Point",
            "coordinates": [120.217415, 30.180315]
          }
        },
        {
          "type": "Feature",
          "properties": {},
          "geometry": {
            "type": "Point",
            "coordinates": [119.230197, 26.07229]
          }
        },
        {
          "type": "Feature",
          "properties": {},
          "geometry": {
            "type": "Point",
            "coordinates": [108.88416, 34.352489]
          }
        },
        {
          "type": "Feature",
          "properties": {},
          "geometry": {
            "type": "Point",
            "coordinates": [106.75177, 29.529607]
          }
        },
        {
          "type": "Feature",
          "properties": {},
          "geometry": {
            "type": "Point",
            "coordinates": [114.333599, 30.996152]
          }
        },
        {
          "type": "Feature",
          "properties": {},
          "geometry": {
            "type": "Point",
            "coordinates": [113.306893, 34.417666]
          }
        },
        {
          "type": "Feature",
          "properties": {},
          "geometry": {
            "type": "Point",
            "coordinates": [126.533967, 45.778455]
          }
        },
        {
          "type": "Feature",
          "properties": {},
          "geometry": {
            "type": "Point",
            "coordinates": [123.588177, 41.616821]
          }
        },
        {
          "type": "Feature",
          "properties": {},
          "geometry": {
            "type": "Point",
            "coordinates": [121.741563, 24.928935]
          }
        },
        {
          "type": "Feature",
          "properties": {},
          "geometry": {
            "type": "Point",
            "coordinates": [102.967647, 24.928935]
          }
        },
        {
          "type": "Feature",
          "properties": {},
          "geometry": {
            "type": "Point",
            "coordinates": [91.228453, 29.578236]
          }
        },
        {
          "type": "Feature",
          "properties": {},
          "geometry": {
            "type": "Point",
            "coordinates": [26.241295, 51.909019]
          }
        },
        {
          "type": "Feature",
          "properties": {},
          "geometry": {
            "type": "Point",
            "coordinates": [24.835045, 10.949795]
          }
        },
        {
          "type": "Feature",
          "properties": {},
          "geometry": {
            "type": "Point",
            "coordinates": [-99.61808, 43.411413]
          }
        },
        {
          "type": "Feature",
          "properties": {},
          "geometry": {
            "type": "Point",
            "coordinates": [-58.360865, -17.996588]
          }
        },
        {
          "type": "Feature",
          "properties": {},
          "geometry": {
            "type": "Point",
            "coordinates": [142.28983, 48.30253]
          }
        },
        {
          "type": "Feature",
          "properties": {},
          "geometry": {
            "type": "Point",
            "coordinates": [132.98353, 33.421804]
          }
        }
      ]
    }
      ;
    // 随机生成地点的关联关系
    const relation: any[] = []
    dataloc.features.forEach((item, index) => {
      const count = 1 + Math.floor(Math.random() * 10)
      const count2 = 1 + Math.floor(Math.random() * 10)
      const start = item.geometry.coordinates
      const cityCount = 1+ Math.floor(Math.random() * 5);
      for (let j = 0; j < cityCount; j++) {
        const endidex = Math.floor(Math.random() * dataloc.features.length);
        const end = dataloc.features[endidex].geometry.coordinates
        for (let i = 0; i < count; i++) {
          relation.push({
            coord: [start, end],
            value: i
          })
        }
        for (let i = 0; i < count2; i++) {
          relation.push({
            coord: [end, start],
            value: i
          })
        }
      }

    })


    const layer = new LineLayer({ blend: 'normal' })
      .source(relation, {
        parser: {
          type: 'json',
          coordinates: 'coord'
        }
      })
      .size(1)
      .shape('arc')
      .color('#8C1EB2')
      .style({
        opacity: 0.8,
        thetaOffset: {
          field: 'value',
          value: [0.01, 0.5]
        },
      });





    scene.on('loaded', () => {
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
