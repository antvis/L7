import { Scene, PointLayer } from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';
const currentTimeKey = '0000';
let timeKeys = [];
let wrap = null;
let layer = null;
const modelDatas = {};
const parser = {
  parser: {
    type: 'json',
    x: 'o',
    y: 'a'
  }
};
insetDom();
const scene = new Scene({
  id: 'map',
  map: new GaodeMap({
    center: [ 120.2, 36.1 ],
    zoom: 10,
    style: 'dark'
  })
});
scene.on('loaded', () => {

  fetch(
    'https://gw.alipayobjects.com/os/bmw-prod/82d85bb6-db7c-4583-af26-35b11c7b2d0d.json'
  )
    .then(res => res.json())
    .then(originData => {
      timeKeys = Object.keys(originData);

      layer = new PointLayer({})
        .source(originData[currentTimeKey], parser)
        .shape('simple')
        .size('v', v => Math.sqrt(v) / 5)
        .color('v', [
          '#ffffb2',
          '#fed976',
          '#feb24c',
          '#fd8d3c',
          '#f03b20',
          '#bd0026'
        ])
        .style({
          opacity: 0.6
        });

      scene.addLayer(layer);

      layer.on('modelLoaded', () => {
        getModelDatas(originData);

        run();
      });

      return '';
    });
  return '';
});

function run() {
  let count = 0;
  const timer = setInterval(() => {
    if (count > 47) {
      clearInterval(timer);
    }

    const key = getTimeKey(count, '');
    const key2 = getTimeKey(count, ':');
    const data = modelDatas[key];
    if (layer && scene && data) {
      layer.updateModelData(data);
      wrap.innerHTML = key2;
      scene.render();
    }

    count++;
  }, 300);
}

function getModelDatas(originData) {
  timeKeys.map(timeKey => {
    modelDatas[timeKey] = layer.createModelData(originData[timeKey], parser);
    return '';
  });
}


function insetDom() {
  const mapContrainer = document.getElementById('map');
  wrap = document.createElement('div');
  wrap.style.zIndex = 10;
  wrap.style.position = 'absolute';
  wrap.style.top = '50px';
  wrap.style.left = '5%';
  wrap.style.right = '5%';
  wrap.style.color = '#fff';
  wrap.style.fontSize = '18px';
  wrap.innerHTML = '00:00';
  mapContrainer.appendChild(wrap);
}

function getTimeKey(time, text) {
  const half = Math.floor(time / 2);
  let res = '';
  if (half < 10) {
    res += '0';
  }
  if (time / 2 > half) {
    res += half + text + '30';
  } else {
    res += half + text + '00';
  }
  return res;
}

