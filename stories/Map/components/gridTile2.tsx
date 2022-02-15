import { LineLayer, Scene, PointLayer, Marker, MarkerLayer } from '@antv/l7';
import { GaodeMap, GaodeMapV2, Map } from '@antv/l7-maps';
import * as React from 'react';
import { animate, easeInOut } from 'popmotion';

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
    if (data[i] < 25) {
      // console.log(data[i])
      arr.push(20);
    } else {
      arr.push(data[i]);
    }
  }
  return arr;
}

export default class GridTile2 extends React.Component {
  // @ts-ignore
  private scene: Scene;

  public componentWillUnmount() {
    this.scene.destroy();
  }

  public async componentDidMount() {
    const scene = new Scene({
      id: 'map',
      map: new GaodeMap({
        center: [112, 27.5],
        // pitch: 75,
        // zoom: 8.2,
        // rotation: -30,
        style: 'blank',
      }),
    });
    this.scene = scene;
    scene.setBgColor('#000');

    const airPorts = [
      {
        name: '常德桃花源机场',
        lng: 111.641101,
        lat: 28.91165,
      },
      {
        name: '芷江机场',
        lng: 109.709699,
        lat: 27.442172,
      },
      {
        name: '铜仁凤凰机场',
        lng: 109.313971,
        lat: 27.880629,
      },
      {
        name: '永州零陵机场',
        lng: 111.616049,
        lat: 26.335053,
      },
      {
        name: '桂林两江国际机场',
        lng: 110.049256,
        lat: 25.210065,
      },
      {
        name: '长沙黄花国际机场',
        lng: 113.216412,
        lat: 28.183613,
      },
      {
        name: '井冈山机场',
        lng: 114.745845,
        lat: 26.852646,
      },
    ];

    scene.addImage(
      'plane',
      'https://gw.alipayobjects.com/zos/bmw-prod/96327aa6-7fc5-4b5b-b1d8-65771e05afd8.svg',
    );

    const img: HTMLImageElement = new Image();
    img.crossOrigin = 'none';
    img.src =
      'https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*dPgXQJ9eUtoAAAAAAAAAAAAAARQnAQ';
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
        .color('rgb(22, 119, 255)')
        .style({
          vertexHeightScale: 2000,
          sourceColor: '#f00',
          // targetColor: '#0f0',
        });
      scene.addLayer(layer);
    };

    scene.addImage(
      'start',
      'https://gw.alipayobjects.com/zos/bmw-prod/ebb0af57-4a8a-46e0-a296-2d51f9fa8007.svg',
    );
    const imageLayer = new PointLayer()
      .source(
        [
          {
            lng: 111.641101,
            lat: 28.91165,
            cityData: '城市数据',
          },
        ],
        {
          parser: {
            type: 'json',
            x: 'lng',
            y: 'lat',
          },
        },
      )
      .shape('cityData', 'text')
      .size(16)
      .style({
        textAnchor: 'left', // 文本相对锚点的位置 center|left|right|top|bottom|top-left
        textOffset: [0, 0], // 文本相对锚点的偏移量 [水平, 垂直]
        spacing: 2, // 字符间距
        padding: [1, 1], // 文本包围盒 padding [水平，垂直]，影响碰撞检测结果，避免相邻文本靠的太近
        stroke: '#ffffff', // 描边颜色
        strokeWidth: 0.3, // 描边宽度
        strokeOpacity: 1.0,
      });

    const pointLayer = new PointLayer()
      .source(
        [
          {
            lng: 111.641101,
            lat: 28.91165,
          },
        ],
        {
          parser: {
            type: 'json',
            x: 'lng',
            y: 'lat',
          },
        },
      )
      .shape('circle')
      .size(35)
      .color('#fff')
      .style({});
    const height = 200;
    const dom = document.createElement('div');
    dom.innerHTML = `
      <div style="width:100px;height:${height}px;position:relative;">
        <div style="position: absolute;width: 8px;height: 8px;top: 10px;border-radius:5px;background: rgba(150, 238, 150, 1.0);"></div> 
        <div style="position: absolute;width: 2px;height: 100%;top: 10px;left: 3px;background-image: linear-gradient(rgba(150, 238, 150, 0.4), rgba(150, 238, 150, 0))"></div>
        <div style="
        position: absolute;
        width: 100px;
        height: 20px;
        left: 15px;top: 5px;
        background-image: linear-gradient(to right, rgba(150, 238, 150, 0.4), rgba(150, 238, 150, 0));
        color: #fff;
        padding-left: 15px;
        line-height: 20px;
        font-size: 12px;
        ">
          城市数据
        </div>
      </div>
      `;

    const markerLayer = new MarkerLayer({});
    const marker = new Marker()
      .setLnglat({
        lng: 111.641101,
        lat: 28.91165,
      })
      .setElement(dom);
    markerLayer.addMarker(marker);

    scene.on('loaded', () => {
      // scene.addLayer(pointLayer);
      // scene.addLayer(imageLayer);
      scene.addMarkerLayer(markerLayer);

      // scene.addLayer(waveLayer);
      // scene.addLayer(barLayer);

      // scene.addLayer(airPrtsLayer);
      // scene.addLayer(airLineLayer);
      // scene.addLayer(airPlaneLayer);

      animate({
        from: {
          pitch: 0,
          rotation: 0,
          zoom: 6,
        },
        to: {
          pitch: 75,
          rotation: -30,
          zoom: 8.2,
        },
        ease: easeInOut,
        duration: 1000,
        onUpdate: ({ pitch, rotation, zoom }) => {
          scene.setPitch(pitch);
          scene.setRotation(rotation);
          scene.setZoom(zoom);
        },
        onComplete: () => {},
      });
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
