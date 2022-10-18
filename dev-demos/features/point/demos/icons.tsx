// @ts-ignore
import { PointLayer, Scene } from '@antv/l7';
// @ts-ignore
import { GaodeMap, GaodeMapV2, Mapbox } from '@antv/l7-maps';
import React, { useEffect } from 'react';
  
export default () => {
  // @ts-ignore
    useEffect( async () => {
      const response = await fetch(
        'https://gw.alipayobjects.com/os/basement_prod/893d1d5f-11d9-45f3-8322-ee9140d288ae.json',
      );
      const scene = new Scene({
        id: 'map',
        map: new GaodeMapV2({
          center: [121.4, 31.258134],
          zoom: 12,
          pitch: 0,
          style: 'normal',
        }),
      });
      scene.addImage(
        '00',
        'https://gw.alipayobjects.com/mdn/rms_fcd5b3/afts/img/A*g8cUQ7pPT9YAAAAAAAAAAAAAARQnAQ',
      );
      scene.addImage(
        '01',
        'https://gw.alipayobjects.com/mdn/rms_fcd5b3/afts/img/A*LTcXTLBM7kYAAAAAAAAAAAAAARQnAQ',
      );
      scene.addImage(
        '02',
        'https://gw.alipayobjects.com/zos/bmw-prod/904d047a-16a5-461b-a921-98fa537fc04a.svg',
      );
      const data = await response.json();
      const newData = data.map((item: any) => {
        item.type = ['00', '01', '02'][Math.floor(Math.random() * 3)];
        return item;
      });
      const imageLayer = new PointLayer({
        blend: 'normal',
      })
        .source(newData, {
          parser: {
            type: 'json',
            x: 'longitude',
            y: 'latitude',
          },
        })
        .shape('type', (v: any) => {
          return v;
        })
        .active(false)
        .size(20);
      scene.addLayer(imageLayer);
      imageLayer.on('mousedown', (e) => {
        console.log('mousedown', e);
      });
      imageLayer.on('click', (e) => {
        console.log('click', e);
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
  