/**
 * 交互测试 - 验证 Pointer Events API 替换 hammerjs 后的功能
 * 测试内容：
 * 1. 拖拽事件 (dragstart, dragging, dragend)
 * 2. 单击事件 (click)
 * 3. 双击事件 (dblclick)
 * 4. 长按事件 (press)
 * 5. Hover 事件
 * 6. 右键菜单事件
 */
import { PointLayer, PolygonLayer } from '@antv/l7';
import type { TestCase } from '../../types';
import { CaseScene } from '../../utils';

export const interactionTest: TestCase = async (options) => {
  const scene = await CaseScene({
    ...options,
    mapConfig: {
      center: [116.397428, 39.90923],
      zoom: 10,
    },
  });

  // 创建交互日志面板
  const logPanel = document.createElement('div');
  logPanel.id = 'interaction-log';
  logPanel.style.cssText = `
    position: absolute;
    bottom: 10px;
    right: 10px;
    width: 300px;
    max-height: 400px;
    overflow-y: auto;
    background: rgba(0, 0, 0, 0.8);
    color: #0f0;
    font-family: monospace;
    font-size: 12px;
    padding: 10px;
    border-radius: 8px;
    z-index: 1000;
  `;
  (options.id as HTMLDivElement).appendChild(logPanel);

  const log = (message: string, color = '#0f0') => {
    const entry = document.createElement('div');
    entry.style.color = color;
    entry.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
    logPanel.insertBefore(entry, logPanel.firstChild);
    // 保持最多50条日志
    while (logPanel.children.length > 50) {
      logPanel.removeChild(logPanel.lastChild!);
    }
  };

  log('交互测试已初始化', '#0ff');
  log('请尝试：拖拽地图、单击、双击、长按', '#ff0');

  // 监听所有交互事件
  scene.on('loaded', () => {
    log('Scene loaded', '#0ff');
  });

  // 实际的交互事件是通过 interactionService 发出的
  // 这里通过 layer 的事件来验证交互
  const pointData = [
    { lng: 116.397428, lat: 39.90923, name: '天安门' },
    { lng: 116.407428, lat: 39.91923, name: '王府井' },
    { lng: 116.387428, lat: 39.89923, name: '前门' },
  ];

  const pointLayer = new PointLayer({})
    .source(pointData, {
      parser: {
        type: 'json',
        x: 'lng',
        y: 'lat',
      },
    })
    .shape('circle')
    .size(20)
    .color('#0066ff')
    .style({
      opacity: 0.8,
    });

  // 点击事件
  pointLayer.on('click', (e: any) => {
    log(`Click: ${e.feature?.name || 'unknown'}`, '#0f0');
  });

  // 双击事件
  pointLayer.on('dblclick', (e: any) => {
    log(`DoubleClick: ${e.feature?.name || 'unknown'}`, '#f0f');
  });

  // 鼠标移入
  pointLayer.on('mouseenter', () => {
    log('MouseEnter point layer', '#ff0');
  });

  // 鼠标移出
  pointLayer.on('mouseout', () => {
    log('MouseOut point layer', '#ff0');
  });

  // 右键菜单
  pointLayer.on('contextmenu', (e: any) => {
    log(`ContextMenu: ${e.feature?.name || 'unknown'}`, '#f00');
  });

  scene.addLayer(pointLayer);

  // 添加一个多边形图层测试拖拽
  const polygonData = {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        properties: { name: '北京区域' },
        geometry: {
          type: 'Polygon',
          coordinates: [
            [
              [116.2, 39.8],
              [116.6, 39.8],
              [116.6, 40.0],
              [116.2, 40.0],
              [116.2, 39.8],
            ],
          ],
        },
      },
    ],
  };

  const polygonLayer = new PolygonLayer({}).source(polygonData).shape('fill').color('#f00').style({
    opacity: 0.3,
  });

  polygonLayer.on('click', (e: any) => {
    log(`Polygon Click: ${e.feature?.properties?.name}`, '#f80');
  });

  scene.addLayer(polygonLayer);

  // 监听场景级别的拖拽事件
  scene.on('dragstart', () => {
    log('Scene dragstart', '#08f');
  });

  scene.on('dragend', () => {
    log('Scene dragend', '#08f');
  });

  return scene;
};
