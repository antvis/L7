import { LineLayer, Scene, PointLayer } from '@antv/l7';
import { GaodeMap, GaodeMapV2, Map } from '@antv/l7-maps';
import * as React from 'react';

function getImageData(img: HTMLImageElement) {
  let canvas: HTMLCanvasElement = document.createElement('canvas');
  let ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
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
  let startLng = 110,
    lngStep = 5 / (size - 1);
  let startLat = 30,
    latStep = -5 / (size - 1);
  for (let i = 0; i < size; i++) {
    let arr2 = [];
    for (let j = 0; j < size; j++) {
      let index = i + j * size;
      let x = startLng + lngStep * i;
      let y = startLat + latStep * j;

      arr2.push([x, y, data[index]]);
    }
    arr.push(arr2);
  }
  return arr;
}

function getLngData(data: number[]) {
  const size = Math.floor(Math.sqrt(data.length));
  const arr = [];
  let startLng = 110,
    lngStep = 5 / (size - 1);
  let startLat = 30,
    latStep = -5 / (size - 1);

  for (let i = 0; i < size; i++) {
    let arr2 = [];
    for (let j = 0; j < size; j++) {
      let index = i * size + j;
      let x = startLng + lngStep * j;
      let y = startLat + latStep * i;

      arr2.push([x, y, data[index]]);
    }
    arr.push(arr2);
  }
  return arr;
}

function getR(data: Uint8ClampedArray) {
  const arr = [];
  for (let i = 0; i < data.length; i += 4) {
    arr.push(data[i]);
  }
  return arr;
}


export default class GridTile extends React.Component {
  // @ts-ignore
  private scene: Scene;

  public componentWillUnmount() {
    this.scene.destroy();
  }

  public async componentDidMount() {
    const scene = new Scene({
      id: 'map',
      map: new GaodeMap({
        center: [113, 29],
        pitch: 70,
        zoom: 9,
        rotation: 180,
        style: 'blank',
        // style: 'dark',
      }),
    });
    this.scene = scene;



    const img: HTMLImageElement = new Image();
    img.crossOrigin = 'none';
    img.src =
      'https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*UkvYRYS5jTAAAAAAAAAAAAAAARQnAQ';
    img.onload = function() {
      const data = getImageData(img);
      const rData = getR(data.data);
      let d1 = getLngData(rData);

      let d2 = getLatData(rData);
      const geoData = {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'LineString',
              coordinates: d1,
            },
          },
          {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'LineString',
              coordinates: d2,
            },
          },
        ],
      };
      const layer = new LineLayer({})
        .source(geoData)
        .size(1)
        .shape('simple')
        // .shape('line')
        // .color('rgb(22, 119, 255)')
        .color('#f00')
        .style({
          vertexHeightScale: 2000,
          opacity: 0.4,
        });
      scene.addLayer(layer);
    };




    scene.on('loaded', () => {
  
     

   
    });
  }

  public render() {
    return (
      <>
        <div
          id="map"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}
        />
      </>
    );
  }
}
