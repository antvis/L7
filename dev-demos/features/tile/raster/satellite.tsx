import { Scene, RasterLayer } from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';
import React, { useEffect } from 'react';
import { encodeParams, sign } from './signGenerator';

export default () => {
  useEffect(() => {
    const scene = new Scene({
      id: 'map',
      pickBufferScale: 1.0,
      map: new GaodeMap({
        center: [127.471855, 46.509622], // 绥化市-北林区
        pitch: 0,
        style: 'blank',
        zoom: 10,
      }),
      transformRequest: (requestParams) => {
        const { x, y, z, index, crow_type } = getUrlQueryParams(
          requestParams.url,
        );
        const biz_content = { x, y, z, index, crow_type };
        const newUrl = sign('anttech.ai.cv.rs.xytile.get', biz_content, {
          charset: 'utf-8',
          version: '1.0',
        });

        const signStr = Object.keys(encodeParams(newUrl))
          .sort()
          .map((key) => {
            let data = encodeParams(newUrl)[key];
            if (Array.prototype.toString.call(data) !== '[object String]') {
              data = JSON.stringify(data);
            }
            return `${key}=${data}`;
          })
          .join('&');
        requestParams.url = `https://openapi.alipay.com/gateway.do?${signStr}`; // 线上环境    
        return requestParams;
      },
      transformResponse: (response) => Base64toArrayBuffer(response?.anttech_ai_cv_rs_xytile_get_response?.image || '')
    });

    const Base64toArrayBuffer = (base64Data) => {
      const padding = '='.repeat((4 - (base64Data.length % 4)) % 4);
      const base64 = (base64Data + padding).replace(/-/g, '+').replace(/_/g, '/');
    
      const rawData = window.atob(base64);
      const outputArray = new Uint8Array(rawData.length);
    
      for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
      }
      return outputArray;
    }

    const getUrlQueryParams = (url = location.search): any => {
      const params = {};
      const keys = url.match(/([^?&]+)(?==)/g);
      const values = url.match(/(?<==)([^&]*)/g);
      for (const index in keys) {
        // @ts-ignore
        params[keys[index]] = values?.[index];
      }
      return params;
    };

    const layerTile = new RasterLayer({
      zIndex: 1,
    });
    layerTile.source(
      '//t{0-4}.tianditu.gov.cn/cva_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cva&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=f1f2021a42d110057042177cd22d856f',
      {
        parser: {
          type: 'rasterTile',
          tileSize: 256,
          //   zoomOffset: 0
          // zoomOffset: 1,
          responseType: 'json'
        },
      },
    );

    const layerTile2 = new RasterLayer({
      zIndex: 0,
    });
    layerTile2.source(
      // 'http://webst0{1-4}.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}',
      `https://openapi.alipay.com/gateway.do?x={x}&y={y}&z={z}&index=1001&crow_type=101`,
      {
        parser: {
          type: 'rasterTile',
          tileSize: 256,
          responseType: 'json'
        },
      },
    );

    scene.on('loaded', () => {
      // scene.addLayer(layerTile);
      scene.addLayer(layerTile2);
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
