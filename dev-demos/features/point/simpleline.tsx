import {
  LineLayer,
  Scene,
  // @ts-ignore
} from '@antv/l7';
// @ts-ignore
import { GaodeMap } from '@antv/l7-maps';
import React, { useEffect } from 'react';

function getImageData(img: HTMLImageElement) {
  const canvas: HTMLCanvasElement = document.createElement('canvas');
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
  const { width, height } = img;
  canvas.width = width;
  canvas.height = height;

  ctx.drawImage(img, 0, 0, width, height);
  const imageData = ctx.getImageData(0, 0, width, height);

  return imageData;
}

function getLatData(data: number[]) {
  const size = Math.floor(Math.sqrt(data.length));

  const arr = [];
  const startLng = 110;
  const lngStep = 5 / (size - 1);
  const startLat = 30;
  const latStep = -5 / (size - 1);
  for (let i = 0; i < size; i++) {
    const arr2 = [];
    for (let j = 0; j < size; j++) {
      const index = i + j * size;
      const x = startLng + lngStep * i;
      const y = startLat + latStep * j;
      // @ts-ignore
      arr2.push([x, y, data[index]]);
    }
    // @ts-ignore
    arr.push(arr2);
  }
  return arr;
}

function getLngData(data: number[]) {
  const size = Math.floor(Math.sqrt(data.length));
  const arr = [];
  const startLng = 110;
  const lngStep = 5 / (size - 1);
  const startLat = 30;
  const latStep = -5 / (size - 1);

  for (let i = 0; i < size; i++) {
    const arr2 = [];
    for (let j = 0; j < size; j++) {
      const index = i * size + j;
      const x = startLng + lngStep * j;
      const y = startLat + latStep * i;
      // @ts-ignore
      arr2.push([x, y, data[index]]);
    }
    // @ts-ignore
    arr.push(arr2);
  }
  return arr;
}

function getR(data: Uint8ClampedArray) {
  const arr = [];
  for (let i = 0; i < data.length; i += 4) {
    // @ts-ignore
    arr.push(data[i]);
  }
  return arr;
}

export default () => {
  useEffect(() => {
    const scene = new Scene({
      id: 'map',
      map: new GaodeMap({
        center: [121.268, 30.3628],
        pitch: 0,
        // style: 'blank',
        zoom: 3,
      }),
    });

    const layer = new LineLayer()
      .source({
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'MultiLineString',
              coordinates: [
                [
                  [80, 30, 5000],
                  [150, 30, 5000],
                  [150, 10, 5000],
                ],
                [
                  [120, 50, 5000],
                  [120, 30, 5000],
                ],
              ],
            },
          },
          {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'MultiLineString',
              coordinates: [
                [
                  [100, 35, 100],
                  [120, 50, 100],
                  [120, 20, 100],
                  [130, 20, 100],
                ],
              ],
            },
          },
        ],
      })
      // .source([
      //   {
      //     lng1: 120,
      //     lat1: 30,
      //     lng2: 130,
      //     lat2: 30
      //   }
      // ], {
      //   parser: {
      //     type: 'json',
      //     x: 'lng1',
      //     y: 'lat1',
      //     x1: 'lng2',
      //     y1: 'lat2'
      //   }
      // })
      .shape('simple')
      .color('#f00')
      .style({
        vertexHeightScale: 2000,
        sourceColor: '#f00',
        targetColor: '#0f0',
      });

    scene.on('loaded', () => {
      scene.addLayer(layer);
    });

    const img: HTMLImageElement = new Image();
    img.crossOrigin = 'none';
    img.src =
      'https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*UkvYRYS5jTAAAAAAAAAAAAAAARQnAQ';
    img.onload = function() {
      const data = getImageData(img);
      const rData = getR(data.data);
      const d1 = getLngData(rData);
      const d2 = getLatData(rData);
      const geoData = {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'MultiLineString',
              coordinates: d1,
            },
          },
          {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'MultiLineString',
              coordinates: d2,
            },
          },
        ],
      };
      // console.log(geoData)
      const layer = new LineLayer({})
        .source(geoData)
        .size(1)
        .shape('simple')
        .color('#f00')
        .style({
          vertexHeightScale: 2000,
          opacity: 0.4,
        });
      scene.addLayer(layer);
    };
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
