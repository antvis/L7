import { LineLayer, PointLayer, Scene } from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';
import { ThreeLayer, ThreeRender } from '@antv/l7-three';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

function getImageData(img) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const { width, height } = img;
  canvas.width = width;
  canvas.height = height;

  ctx.drawImage(img, 0, 0, width, height);
  const imageData = ctx.getImageData(0, 0, width, height);

  return imageData;
}

function getLatData(data) {
  const size = Math.floor(Math.sqrt(data.length));

  const arr = [];
  const startLng = 110,
    lngStep = 5 / (size - 1);
  const startLat = 30,
    latStep = -5 / (size - 1);
  for (let i = 0; i < size; i++) {
    const arr2 = [];
    for (let j = 0; j < size; j++) {
      const index = i + j * size;
      const x = startLng + lngStep * i;
      const y = startLat + latStep * j;

      arr2.push([x, y, data[index]]);
    }
    arr.push(arr2);
  }
  return arr;
}

function getLngData(data) {
  const size = Math.floor(Math.sqrt(data.length));
  const arr = [];
  const startLng = 110,
    lngStep = 5 / (size - 1);
  const startLat = 30,
    latStep = -5 / (size - 1);

  for (let i = 0; i < size; i++) {
    const arr2 = [];
    for (let j = 0; j < size; j++) {
      const index = i * size + j;
      const x = startLng + lngStep * j;
      const y = startLat + latStep * i;

      arr2.push([x, y, data[index]]);
    }
    arr.push(arr2);
  }
  return arr;
}

function getR(data) {
  const arr = [];
  for (let i = 0; i < data.length; i += 4) {
    arr.push(data[i]);
  }
  return arr;
}

function setMaterial(object) {
  if (object.children && object.children.length && object.children.length > 0) {
    object.children.map((child) => setMaterial(child));
  } else if (object.material) {
    object.material.wireframe = true;
    object.material.opacity = 0.6;
  }
}

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
const planeTarget = {
  lng2: 111.616049,
  lat2: 26.335053,
};
const airLineData = [
  {
    name: '常德桃花源机场',
    lng: 111.641101,
    lat: 28.91165,
    ...planeTarget,
  },
  {
    name: '芷江机场',
    lng: 109.709699,
    lat: 27.442172,
    ...planeTarget,
  },
  {
    name: '铜仁凤凰机场',
    lng: 109.313971,
    lat: 27.880629,
    ...planeTarget,
  },
  {
    name: '桂林两江国际机场',
    lng: 110.049256,
    lat: 25.210065,
    ...planeTarget,
  },
  {
    name: '长沙黄花国际机场',
    lng: 113.216412,
    lat: 28.183613,
    ...planeTarget,
  },
  {
    name: '井冈山机场',
    lng: 114.745845,
    lat: 26.852646,
    ...planeTarget,
  },
];

const scene = new Scene({
  id: 'map',
  map: new GaodeMap({
    center: [113, 29],
    pitch: 70,
    zoom: 7.5,
    rotation: 170,
    style: 'blank',
  }),
});
scene.setBgColor('#000');

scene.registerRenderService(ThreeRender);

const threeJSLayer = new ThreeLayer({
  enableMultiPassRenderer: false,
  // @ts-ignore
  onAddMeshes: (threeScene, layer) => {
    threeScene.add(new THREE.AmbientLight(0xffffff));
    const sunlight = new THREE.DirectionalLight(0xffffff, 0.25);
    sunlight.position.set(0, 800000, 1000000);
    sunlight.matrixWorldNeedsUpdate = true;
    threeScene.add(sunlight);

    // 使用 Three.js glTFLoader 加载模型
    const loader = new GLTFLoader();
    loader.load(
      'https://gw.alipayobjects.com/os/bmw-prod/3ca0a546-92d8-4ba0-a89c-017c218d5bea.gltf',
      (gltf) => {
        const antModel = gltf.scene;
        setMaterial(antModel);
        layer.adjustMeshToMap(antModel);
        layer.setMeshScale(antModel, 2000, 2000, 2000);
        layer.setObjectLngLat(antModel, [113, 29], 0);

        const animations = gltf.animations;
        if (animations && animations.length) {
          const mixer = new THREE.AnimationMixer(antModel);
          const animation = animations[1];
          const action = mixer.clipAction(animation);
          action.timeScale = 1;
          action.play();
          layer.addAnimateMixer(mixer);
        }
        antModel.rotation.y = Math.PI;
        threeScene.add(antModel);
        layer.render();
        return '';
      },
    );
  },
  zIndex: 1,
});

scene.addImage(
  'plane',
  'https://gw.alipayobjects.com/zos/bmw-prod/96327aa6-7fc5-4b5b-b1d8-65771e05afd8.svg',
);
const airPrtsLayer = new PointLayer()
  .source(airPorts, {
    parser: {
      type: 'json',
      x: 'lng',
      y: 'lat',
    },
  })
  .shape('name', 'text')
  .color('rgb(22,119,255)')
  .size(10);

const airLineLayer = new LineLayer({ blend: 'normal' })
  .source(airLineData, {
    parser: {
      type: 'json',
      x: 'lng',
      y: 'lat',
      x1: 'lng2',
      y1: 'lat2',
    },
  })
  .shape('arc3d')
  .size(1)
  .color('#f00')
  .style({
    sourceColor: 'rgb(22,119,255)',
    targetColor: 'rgba(242,246,250,0.1)',
  });

const airPlaneLayer = new LineLayer({ blend: 'normal', zIndex: 1 })
  .source(airLineData, {
    parser: {
      type: 'json',
      x: 'lng2',
      y: 'lat2',
      x1: 'lng',
      y1: 'lat',
    },
  })
  .shape('arc3d')
  .texture('plane')
  .size(30)
  .color('#f00')
  .animate({
    duration: 0.2,
    interval: 0.2,
    trailLength: 0.2,
  })
  .style({
    textureBlend: 'replace',
    lineTexture: true, // 开启线的贴图功能
    iconStep: 6, // 设置贴图纹理的间距
  });

fetch('https://gw.alipayobjects.com/os/bmw-prod/ec5351c9-d22b-4918-ad6c-1838064d3a64.json')
  .then((res) => res.json())
  .then((data) => {
    const layer = new LineLayer({}).source(data).size(10000).shape('wall').style({
      opacity: 0.4,
      sourceColor: '#0DCCFF',
      targetColor: 'rbga(255,255,255, 0)',
      heightfixed: true,
    });
    scene.addLayer(layer);

    const nameLayer = new PointLayer({ zIndex: 3 })
      .source(data)
      .color('rgb(22,119,255)')
      .size(15)
      .shape('name', 'text');
    scene.addLayer(nameLayer);
  });

const img = new Image();
img.crossOrigin = 'none';
img.src = 'https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*UkvYRYS5jTAAAAAAAAAAAAAAARQnAQ';
img.onload = function () {
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
  const layer = new LineLayer({})
    .source(geoData)
    .size(1)
    .shape('simple')
    .color('rgb(22, 119, 255)')
    .style({
      vertexHeightScale: 2000,
      opacity: 0.4,
    });
  scene.addLayer(layer);
};
const pointData = [
  { lng: 113, lat: 29, size: 10000 },
  { lng: 113.5, lat: 29.5, size: 30000 },
  { lng: 110.23681640625, lat: 29.64509464986076, size: 74020.50373907911 },
  { lng: 115.01586914062499, lat: 26.88777988202911, size: 22908.885529976185 },
  { lng: 111.181640625, lat: 28.724313406473463, size: 73359.37302978932 },
  { lng: 112.686767578125, lat: 29.257648503615542, size: 18500.90838085843 },
  { lng: 114.664306640625, lat: 28.98892237190413, size: 20293.183968726793 },
  { lng: 113.90075683593749, lat: 28.17855984939698, size: 18051.412077639496 },
  { lng: 111.51123046875, lat: 27.45466493898314, size: 37645.94186119526 },
  { lng: 110.67626953125, lat: 28.004101830368654, size: 4214.588023703825 },
  { lng: 114.43359375, lat: 29.477861195816843, size: 61722.01580332115 },
  { lng: 110.445556640625, lat: 26.96124577052697, size: 70806.75519747598 },
  { lng: 113.75244140624999, lat: 27.88278388425912, size: 70930.24993464859 },
];
const waveLayer = new PointLayer({ zIndex: 2, blend: 'additive' })
  .source(pointData, {
    parser: {
      type: 'json',
      x: 'lng',
      y: 'lat',
    },
  })
  .shape('circle')
  .color('rgb(22, 119, 255)')
  .size('size', (v) => v)
  .animate(true)
  .style({
    unit: 'meter',
  });

const barLayer = new PointLayer({ zIndex: 2, depth: false })
  .source(pointData, {
    parser: {
      type: 'json',
      x: 'lng',
      y: 'lat',
    },
  })
  .shape('cylinder')
  .color('rgb(22, 119, 255)')
  .size('size', (v) => [5, 5, v / 350])
  .animate(true)
  .style({
    opacityLinear: {
      enable: true,
      dir: 'up',
    },
    lightEnable: false,
  });

scene.on('loaded', () => {
  scene.addLayer(waveLayer);
  scene.addLayer(barLayer);
  scene.addLayer(threeJSLayer);

  scene.addLayer(airPrtsLayer);
  scene.addLayer(airLineLayer);
  scene.addLayer(airPlaneLayer);
});
