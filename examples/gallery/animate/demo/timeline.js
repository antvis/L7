import { Scene, PointLayer } from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';
let currentTimeKey = '0000';
let timeKeys = [];
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
  setDragBar();

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

      getModelDatas(originData);
      return '';
    });
  return '';
});


function getModelDatas(originData) {
  timeKeys.map(timeKey => {
    modelDatas[timeKey] = layer.createModelData(originData[timeKey], parser);
    return '';
  });
}

function updateTime() {
  if (layer && scene) {
    layer.updateModelData(modelDatas[currentTimeKey]);
    scene.render();
  }
}

function setDragBar() {
  const script = document.createElement('script');
  script.setAttribute('type', 'text/javascript');
  script.setAttribute('src', 'https://cdn.bootcss.com/jquery/2.1.1/jquery.min.js');
  script.async = true;
  document.head.appendChild(script);

  script.onload = () => {
    const bar = document.getElementById('progress');
    const barWidth = bar.getBoundingClientRect().width;
    let tag = false,
      ox = 0,
      left = 0,
      bgleft = 0;
    const $ = window.$;
    $('.progress_btn').mousedown(function(e) {
      ox = e.pageX - left;
      tag = true;
    });

    $(document).mouseup(function() { tag = false; });

    $(document).mousemove(function(e) { // 鼠标移动
      if (tag) {
        left = e.pageX - ox;
        currentTimeKey = setText(left, barWidth);
        updateTime();
      }
    });

    $('.progress_bg').click(function(e) { // 鼠标点击
      if (!tag) {
        bgleft = $('.progress_bg').offset().left;
        left = e.pageX - bgleft;
        currentTimeKey = setText(left, barWidth);
        updateTime();
      }
    });
    return '';
  };


  function setText(left, barWidth) {

    if (left <= 0) {
      left = 0;
    } else if (left > barWidth) {
      left = barWidth;
    }
    const $ = window.$;
    $('.progress_btn').css('left', left);

    const time = parseInt((left / barWidth) * 48);
    const timeText = getTimeKey(time, ':');
    const timeKey = getTimeKey(time, '');
    $('.text').html(timeText);
    return timeKey;
  }
}

function insetDom() {
  const mapContrainer = document.getElementById('map');
  const wrap = document.createElement('div');
  wrap.id = 'progress';
  wrap.style.zIndex = 10;
  wrap.style.position = 'absolute';
  wrap.style.bottom = '50px';
  wrap.style.left = '10%';
  wrap.style.right = '10%';
  wrap.innerHTML = `
      <div class="progress_bg" style="
      height: 6px; 
      border-radius: 3px;
      overflow: hidden;
      background-color:#f2f2f2;">
        </div>
        <div class="progress_btn" style="
          width: 20px; 
          height: 20px; 
          border-radius: 10px;
          position: absolute;
          background:#ccc; 
          left: 0px; 
          margin-left: -10px; top:-9px; 
          cursor: pointer;
          box-sizing:border-box;
          ">
          <div class="text" style="transform:translateY(-30px); color: #fff;user-select:none">00:00</div>
        </div>
    `;
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

