import { useEffect, useState } from 'react';
import { LineLayer, PolygonLayer } from '@antv/l7';
interface IData {
  county: any;
  state: any;
  unemploymentdata: any;
}
interface IData2 {
    country: any;
    turnout: any;
  }
export function useData() {
  const [data, setData] = useState<IData | undefined>(undefined);
  useEffect(() => {
    Promise.all([
      fetch(
        'https://gw.alipayobjects.com/os/bmw-prod/5c4c7e02-a796-4c09-baba-629a99c909aa.json',
      ).then((d) => d.json()),
      // https://lab.isaaclin.cn/nCoV/api/area?latest=1
      fetch(
        'https://gw.alipayobjects.com/os/bmw-prod/738993d1-cc7e-4630-a318-80d6452fd125.csv',
      ).then((d) => d.text()),
      fetch(
        ' https://gw.alipayobjects.com/os/bmw-prod/d13721bf-f0c2-4897-b6e6-633e6e022c09.json',
      ).then((d) => d.json()),
    ]).then(([county, unemployment, state]) => {
      const unemploymentdata = unemployment
        .split('\n')
        .slice(0)
        .map((line) => {
          const item = line.split(',');
          return {
            id: item[0],
            state: item[1],
            county: item[2],
            rate: item[3] * 1,
          };
        });
      setData({
        county,
        unemploymentdata,
        state,
      });
    });
  }, []);

  return { geoData: data };
}

export function useEuropeData() {
    const [data, setData] = useState<IData2 | undefined>(undefined);
    useEffect(() => {
      Promise.all([
        fetch(
          'https://gw.alipayobjects.com/os/bmw-prod/01ff872b-99c6-4e41-bd3a-34c2134da597.json',
        ).then((d) => d.json()),
        // https://lab.isaaclin.cn/nCoV/api/area?latest=1
        fetch(
          'https://gw.alipayobjects.com/os/bmw-prod/64124f12-e086-4fe6-a900-bd57b410af69.csv',
        ).then((d) => d.text()),

      ]).then(([country, turnoutData,]) => {
        const turnout = turnoutData
          .split('\n')
          .slice(0)
          .map((line) => {
            const item = line.split(',');
            return {
                country: item[0],
               turnout: item[1] *1,
            };
          });
        setData({
            country,
            turnout,
        });
      });
    }, []);
  
    return { geoData: data };
  }

export function addLayers(data: IData, scene, mainLayer) {
  const linelayer = new PolygonLayer({})
    .source(data.county)
    .size(0.5)
    .shape('line')
    .color('#fff')
    .style({
      opacity: 1,
    });
  const stateLayer = new PolygonLayer({})
    .source(data.state)
    .size(1)
    .shape('line')
    .color('#fff')
    .style({
      opacity: 1,
    });
 
  scene.addLayer(linelayer);
  scene.addLayer(stateLayer);
  addhightLayer(scene, mainLayer)

}

export function addEuropeLayers(data: IData2, scene, mainLayer) {
    const linelayer = new PolygonLayer({})
      .source(data.country)
      .size(0.5)
      .shape('line')
      .color('#fff')
      .style({
        opacity: 1,
      });
   
    scene.addLayer(linelayer);
    addhightLayer(scene, mainLayer)
  }

  function addhightLayer(scene, mainLayer) {
    const hightLayer = new LineLayer({
        zIndex: 4, // 设置显示层级
        name: 'hightlight',
      })
        .source({
          type: 'FeatureCollection',
          features: [],
        })
        .shape('line')
        .size(0.8)
        .color('#000')
        .style({
          opacity: 1,
        });
      scene.addLayer(hightLayer);
      mainLayer.on('click', (feature) => {
        hightLayer.setData({
          type: 'FeatureCollection',
          features: [feature.feature],
        });
      });
  }