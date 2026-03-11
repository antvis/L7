import { PointLayer, Scene } from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';

const scene = new Scene({
  id: 'map',
  map: new GaodeMap({
    style: 'light',
    center: [104.0, 36.0],
    zoom: 4,
  }),
});

scene.addImage(
  'marker',
  'https://gw.alipayobjects.com/zos/basement_prod/604b5e7f-309e-40db-b95b-4fac746c5153.svg',
);

// 在中国范围内生成密集随机点，使压盖效果明显
function generateData(count) {
  const points = [];
  for (let i = 0; i < count; i++) {
    points.push({
      lng: 99 + Math.random() * 20,
      lat: 25 + Math.random() * 18,
      id: i,
    });
  }
  return points;
}

scene.on('loaded', () => {
  const data = generateData(300);

  const layer = new PointLayer()
    .source(data, {
      parser: { type: 'json', x: 'lng', y: 'lat' },
    })
    .shape('marker')
    .size(15)
    .style({
      allowOverlap: false, // 默认关闭压盖，开启碰撞避让
    });

  scene.addLayer(layer);

  // 控制面板
  const panel = document.createElement('div');
  panel.style.cssText =
    'position:absolute;top:10px;left:10px;z-index:100;background:#fff;padding:12px 16px;border-radius:4px;box-shadow:0 2px 8px rgba(0,0,0,.15);font-size:13px;';

  panel.innerHTML = `
    <div style="margin-bottom:10px;font-weight:600;">Image allowOverlap</div>
    <label style="display:flex;align-items:center;gap:8px;cursor:pointer;">
      <input type="checkbox" id="overlap-toggle" />
      <span id="overlap-label">allowOverlap: false（碰撞避让开启）</span>
    </label>
    <div style="margin-top:8px;color:#888;font-size:12px;">
      点数量：300 &nbsp;|&nbsp; 缩放地图可触发重新计算
    </div>
  `;

  document.getElementById('map').appendChild(panel);

  const checkbox = document.getElementById('overlap-toggle');
  const label = document.getElementById('overlap-label');

  checkbox.addEventListener('change', () => {
    const allowOverlap = checkbox.checked;
    label.textContent = allowOverlap
      ? 'allowOverlap: true（允许压盖，全部显示）'
      : 'allowOverlap: false（碰撞避让开启）';
    layer.style({ allowOverlap });
  });
});
