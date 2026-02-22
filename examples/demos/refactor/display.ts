/**
 * 显示测试 - 验证各种图层渲染功能
 * 测试内容：
 * 1. 点图层 (PointLayer) - 多种shape
 * 2. 线图层 (LineLayer)
 * 3. 多边形图层 (PolygonLayer)
 * 4. 热力图 (HeatmapLayer) - 验证重构后的heatmap
 */
import { HeatmapLayer, LineLayer, PointLayer, PolygonLayer } from '@antv/l7';
import type { TestCase } from '../../types';
import { CaseScene } from '../../utils';

export const displayTest: TestCase = async (options) => {
  const scene = await CaseScene({
    ...options,
    mapConfig: {
      center: [116.397428, 39.90923],
      zoom: 9,
    },
  });

  // 创建控制面板
  const controlPanel = document.createElement('div');
  controlPanel.style.cssText = `
    position: absolute;
    top: 10px;
    right: 10px;
    background: rgba(0, 0, 0, 0.8);
    color: #fff;
    font-family: sans-serif;
    font-size: 14px;
    padding: 15px;
    border-radius: 8px;
    z-index: 1000;
    max-height: 80vh;
    overflow-y: auto;
  `;
  (options.id as HTMLDivElement).appendChild(controlPanel);

  // 标题
  const title = document.createElement('h3');
  title.textContent = '图层显示测试';
  title.style.cssText = 'margin: 0 0 15px 0; color: #0ff;';
  controlPanel.appendChild(title);

  // 图层状态
  const layers: Record<string, { layer: any; visible: boolean }> = {};

  // 创建图层切换按钮
  const createLayerToggle = (name: string, description: string) => {
    const div = document.createElement('div');
    div.style.cssText = 'margin-bottom: 10px;';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = true;
    checkbox.id = `layer-${name}`;

    const label = document.createElement('label');
    label.htmlFor = `layer-${name}`;
    label.textContent = description;
    label.style.cssText = 'margin-left: 8px; cursor: pointer;';

    div.appendChild(checkbox);
    div.appendChild(label);
    controlPanel.appendChild(div);

    return checkbox;
  };

  // ========== 点图层 ==========
  const pointData = [
    { lng: 116.31, lat: 39.92, type: 'A' },
    { lng: 116.38, lat: 39.95, type: 'B' },
    { lng: 116.45, lat: 39.88, type: 'A' },
    { lng: 116.35, lat: 39.85, type: 'B' },
  ];

  const pointLayer = new PointLayer({})
    .source(pointData, {
      parser: { type: 'json', x: 'lng', y: 'lat' },
    })
    .shape('circle')
    .size(20)
    .color('type', ['type', (t: string) => (t === 'A' ? '#ff6600' : '#0066ff')])
    .style({ opacity: 0.8 });

  layers['point'] = { layer: pointLayer, visible: true };
  const pointToggle = createLayerToggle('point', '点图层 (circle)');
  pointToggle.onchange = () => {
    pointLayer.setVisibility(pointToggle.checked);
  };
  scene.addLayer(pointLayer);

  // ========== 线图层 ==========
  const lineData = {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        geometry: {
          type: 'LineString',
          coordinates: [
            [116.3, 39.9],
            [116.4, 39.95],
            [116.5, 39.9],
          ],
        },
      },
    ],
  };

  const lineLayer = new LineLayer({})
    .source(lineData)
    .shape('line')
    .size(3)
    .color('#00ff00')
    .style({ opacity: 0.8 });

  layers['line'] = { layer: lineLayer, visible: true };
  const lineToggle = createLayerToggle('line', '线图层 (line)');
  lineToggle.onchange = () => {
    lineLayer.setVisibility(lineToggle.checked);
  };
  scene.addLayer(lineLayer);

  // ========== 多边形图层 ==========
  const polygonData = {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        properties: { value: 10 },
        geometry: {
          type: 'Polygon',
          coordinates: [
            [
              [116.25, 39.75],
              [116.35, 39.75],
              [116.35, 39.85],
              [116.25, 39.85],
              [116.25, 39.75],
            ],
          ],
        },
      },
      {
        type: 'Feature',
        properties: { value: 30 },
        geometry: {
          type: 'Polygon',
          coordinates: [
            [
              [116.45, 39.95],
              [116.55, 39.95],
              [116.55, 40.05],
              [116.45, 40.05],
              [116.45, 39.95],
            ],
          ],
        },
      },
    ],
  };

  const polygonLayer = new PolygonLayer({})
    .source(polygonData)
    .shape('fill')
    .color('value', ['#ffff00', '#ff0000'])
    .style({ opacity: 0.6 });

  layers['polygon'] = { layer: polygonLayer, visible: true };
  const polygonToggle = createLayerToggle('polygon', '多边形图层 (fill)');
  polygonToggle.onchange = () => {
    polygonLayer.setVisibility(polygonToggle.checked);
  };
  scene.addLayer(polygonLayer);

  // ========== 热力图层 ==========
  const heatmapData = await fetch(
    'https://gw.alipayobjects.com/os/antfincdn/8Ps2h%24qgmk/traffic_110000.csv',
  ).then((res) => res.text());

  const heatmapLayer = new HeatmapLayer({})
    .source(heatmapData, {
      parser: {
        type: 'csv',
        x: 'lng',
        y: 'lat',
      },
    })
    .shape('heatmap')
    .size('count', [0, 1])
    .style({
      intensity: 2,
      radius: 20,
      opacity: 0.8,
      rampColors: {
        colors: ['#002466', '#0058CC', '#00A6FF', '#7CFFFA', '#C6FF80', '#FFC800', '#FF4800'],
        positions: [0, 0.2, 0.4, 0.5, 0.7, 0.85, 1.0],
      },
    });

  layers['heatmap'] = { layer: heatmapLayer, visible: true };
  const heatmapToggle = createLayerToggle('heatmap', '热力图层 (heatmap)');
  heatmapToggle.onchange = () => {
    heatmapLayer.setVisibility(heatmapToggle.checked);
  };
  scene.addLayer(heatmapLayer);

  // 状态显示
  const statusDiv = document.createElement('div');
  statusDiv.style.cssText = `
    margin-top: 15px;
    padding-top: 10px;
    border-top: 1px solid #333;
    font-size: 12px;
    color: #0f0;
  `;
  statusDiv.textContent = `已加载 ${Object.keys(layers).length} 个图层`;
  controlPanel.appendChild(statusDiv);

  return scene;
};
