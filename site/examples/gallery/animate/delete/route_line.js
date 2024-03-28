/* eslint-disable no-eval */
import { LineLayer, PointLayer, PolygonLayer, Scene } from '@antv/l7'; //
import { GaodeMap } from '@antv/l7-maps';

const scene = new Scene({
  id: 'map',
  map: new GaodeMap({
    center: [110, 30],
    zoom: 2.5,
    style: 'dark',
  }),
});
const originData = {
  // BJ -> CQ
  lng1: 116.5883553580003,
  lat1: 40.07680509701226,
  lng2: 106.06201171875,
  lat2: 30.164126343161097,
};
const originData2 = {
  // BJ -> HK
  lng1: 116.5883553580003,
  lat1: 40.07680509701226,
  lng2: 114.3072509765625,
  lat2: 22.228090416784486,
};
const originData3 = {
  // BJ -> HerBin
  lng1: 116.5883553580003,
  lat1: 40.07680509701226,
  lng2: 126.62841796875,
  lat2: 45.75219336063106,
};
const originData4 = {
  // BJ -> Wulumuqi
  lng1: 116.5883553580003,
  lat1: 40.07680509701226,
  lng2: 87.57202148437499,
  lat2: 43.82660134505382,
};
const originData5 = {
  // BJ -> 上海
  lng1: 116.5883553580003,
  lat1: 40.07680509701226,
  lng2: 121.26708984374999,
  lat2: 31.259769987394286,
};

scene.on('loaded', () => {
  scene.addImage(
    'plane',
    'https://gw.alipayobjects.com/zos/bmw-prod/bea041d7-d6d4-4027-b422-a0bc321fbf14.svg',
  );

  Promise.all([
    fetch(
      'https://gw.alipayobjects.com/os/bmw-prod/2960e1fc-b543-480f-a65e-d14c229dd777.json',
    ).then((d) => d.json()),
  ]).then(function onLoad([world]) {
    const data = [];

    for (let i = 0; i < 99; i++) {
      data.push({
        thetaOffset: -1 / 2 + i * (1 / 99), // 设置曲线的偏移量
        ...originData,
      });
    }

    for (let i = 0; i < 30; i++) {
      data.push({
        thetaOffset: -1 / 2 + i * (1 / 30), // 设置曲线的偏移量
        ...originData2,
      });
    }

    for (let i = 0; i < 15; i++) {
      data.push({
        thetaOffset: -1 / 2 + i * (1 / 15), // 设置曲线的偏移量
        ...originData3,
      });
    }

    for (let i = 0; i < 11; i++) {
      data.push({
        thetaOffset: -1 / 2 + i * (1 / 11), // 设置曲线的偏移量
        ...originData4,
      });
    }

    for (let i = 0; i < 60; i++) {
      data.push({
        thetaOffset: -1 / 2 + i * (1 / 60), // 设置曲线的偏移量
        ...originData5,
      });
    }

    const worldLine = new LineLayer().source(world).color('#1E90FF').size(0.5).style({
      opacity: 0.4,
    });
    scene.addLayer(worldLine);

    const worldFill = new PolygonLayer({ blend: 'normal' })
      .source(world)
      .size('name', [0, 10000, 50000, 30000, 100000])
      .color('#1E90FF')
      .shape('fill')
      .active(true)

      .style({
        opacity: 0.2,
        opacityLinear: {
          enable: true,
          dir: 'out', // in - out
        },
      });
    scene.addLayer(worldFill);

    const jsonParserOotion = {
      parser: {
        type: 'json',
        x: 'lng',
        y: 'lat',
      },
    };

    const jsonLineParserOotion = {
      parser: {
        type: 'json',
        x: 'lng1',
        y: 'lat1',
        x1: 'lng2',
        y1: 'lat2',
      },
    };

    const dotData = [
      {
        // CQ
        lng: 106.06201171875,
        lat: 30.164126343161097,
      },
      {
        // BJ
        lng: 116.5883553580003,
        lat: 40.07680509701226,
      },
      {
        // HK
        lng: 114.3072509765625,
        lat: 22.228090416784486,
      },
      {
        // Herbin
        lng: 126.62841796875,
        lat: 45.75219336063106,
      },
      {
        // shanghai
        lng: 121.26708984374999,
        lat: 31.259769987394286,
      },
      {
        // Wulumuqi
        lng: 87.57202148437499,
        lat: 43.82660134505382,
      },
    ];

    const dotPoint = new PointLayer({ zIndex: 2 })
      .source(dotData, jsonParserOotion)
      .shape('circle')
      .color('#00FFFF')
      .animate(true)
      .size(30);
    scene.addLayer(dotPoint);

    const layerPlaneLine = new LineLayer({ blend: 'normal' })
      .source(data, jsonLineParserOotion)
      .size(1)
      .shape('arc')
      .color('#87CEFA')
      .animate({
        interval: 1, // 间隔
        duration: 1, // 持续时间，延时
        trailLength: 2, // 流线长度
      })
      .style({
        opacity: 0.4,
        thetaOffset: 'thetaOffset',
      });
    scene.addLayer(layerPlaneLine);
  });
});

// {
//   "filename": "route_line.js",
//   "title": "航线图",
//   "screenshot":"https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*NEKUR6HzXFEAAAAAAAAAAAAAARQnAQ"
// },
