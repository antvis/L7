/**
 * 动画测试 - 验证图层动画功能
 * 测试内容：
 * 1. 点图层动画 (呼吸、波纹)
 * 2. 线图层流动动画
 * 3. 数据更新动画
 */
import { LineLayer, PointLayer } from '@antv/l7';
import type { TestCase } from '../../types';
import { CaseScene } from '../../utils';

export const animationTest: TestCase = async (options) => {
  const scene = await CaseScene({
    ...options,
    mapConfig: {
      center: [116.397428, 39.90923],
      zoom: 10,
    },
  });

  // 创建控制面板
  const controlPanel = document.createElement('div');
  controlPanel.style.cssText = `
    position: absolute;
    bottom: 10px;
    right: 10px;
    background: rgba(0, 0, 0, 0.8);
    color: #fff;
    font-family: sans-serif;
    font-size: 14px;
    padding: 15px;
    border-radius: 8px;
    z-index: 1000;
  `;
  (options.id as HTMLDivElement).appendChild(controlPanel);

  // 标题
  const title = document.createElement('h3');
  title.textContent = '动画测试';
  title.style.cssText = 'margin: 0 0 15px 0; color: #0ff;';
  controlPanel.appendChild(title);

  // 状态显示
  const statusDiv = document.createElement('div');
  statusDiv.style.cssText = 'margin-bottom: 15px; color: #0f0; font-size: 12px;';
  statusDiv.textContent = '动画状态: 运行中';
  controlPanel.appendChild(statusDiv);

  // ========== 波纹动画点图层 ==========
  const pointData = [
    { lng: 116.397428, lat: 39.90923, size: 30 },
    { lng: 116.387428, lat: 39.91923, size: 25 },
    { lng: 116.407428, lat: 39.89923, size: 35 },
  ];

  const wavePointLayer = new PointLayer({ zIndex: 10 })
    .source(pointData, {
      parser: { type: 'json', x: 'lng', y: 'lat' },
    })
    .shape('circle')
    .size('size', [20, 50])
    .color('#0066ff')
    .style({
      opacity: 0.6,
    })
    .animate({
      enable: true,
      type: 'wave',
      speed: 2,
      rings: 3,
    });

  scene.addLayer(wavePointLayer);

  // ========== 流动线动画 ==========
  const lineData = {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        geometry: {
          type: 'LineString',
          coordinates: [
            [116.3, 39.85],
            [116.4, 39.9],
            [116.5, 39.95],
          ],
        },
      },
      {
        type: 'Feature',
        geometry: {
          type: 'LineString',
          coordinates: [
            [116.5, 39.85],
            [116.4, 39.9],
            [116.3, 39.95],
          ],
        },
      },
    ],
  };

  const flowLineLayer = new LineLayer({ zIndex: 5 })
    .source(lineData)
    .shape('line')
    .size(4)
    .color('#00ff88')
    .style({
      opacity: 0.8,
    })
    .animate({
      enable: true,
      type: 'line',
      speed: 2,
      interval: 0.5,
      trailLength: 1,
    });

  scene.addLayer(flowLineLayer);

  // ========== 动态数据更新测试 ==========
  let updateCount = 0;
  const dynamicPoints = new PointLayer({ zIndex: 15 })
    .source(
      [
        { lng: 116.397428, lat: 39.90923 },
        { lng: 116.407428, lat: 39.91923 },
        { lng: 116.387428, lat: 39.89923 },
      ],
      {
        parser: { type: 'json', x: 'lng', y: 'lat' },
      },
    )
    .shape('circle')
    .size(20)
    .color('#ff6600')
    .style({ opacity: 0.8 });

  scene.addLayer(dynamicPoints);

  // 定时更新数据
  const updateData = () => {
    updateCount++;
    const offset = (updateCount % 10) * 0.001;
    dynamicPoints.setData(
      [
        { lng: 116.397428 + offset, lat: 39.90923 },
        { lng: 116.407428 - offset, lat: 39.91923 },
        { lng: 116.387428, lat: 39.89923 + offset },
      ],
      {
        parser: { type: 'json', x: 'lng', y: 'lat' },
      },
    );
  };

  let dataUpdateInterval: ReturnType<typeof setInterval> | null = setInterval(updateData, 500);

  // ========== 控制按钮 ==========
  const buttonContainer = document.createElement('div');
  buttonContainer.style.cssText = 'display: flex; flex-direction: column; gap: 10px;';
  controlPanel.appendChild(buttonContainer);

  const createButton = (text: string, onClick: () => void, color = '#0066ff') => {
    const btn = document.createElement('button');
    btn.textContent = text;
    btn.style.cssText = `
      padding: 8px 16px;
      background: ${color};
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    `;
    btn.onclick = onClick;
    buttonContainer.appendChild(btn);
    return btn;
  };

  createButton(
    '暂停所有动画',
    () => {
      wavePointLayer.animate({ enable: false });
      flowLineLayer.animate({ enable: false });
      if (dataUpdateInterval) {
        clearInterval(dataUpdateInterval);
        dataUpdateInterval = null;
      }
      statusDiv.textContent = '动画状态: 已暂停';
    },
    '#ff4444',
  );

  createButton(
    '恢复所有动画',
    () => {
      wavePointLayer.animate({ enable: true });
      flowLineLayer.animate({ enable: true });
      if (!dataUpdateInterval) {
        dataUpdateInterval = setInterval(updateData, 500);
      }
      statusDiv.textContent = '动画状态: 运行中';
    },
    '#44aa44',
  );

  createButton(
    '加快动画速度',
    () => {
      wavePointLayer.animate({ speed: 5 });
      flowLineLayer.animate({ speed: 5 });
      statusDiv.textContent = '动画状态: 高速运行';
    },
    '#ff8800',
  );

  createButton(
    '恢复正常速度',
    () => {
      wavePointLayer.animate({ speed: 2 });
      flowLineLayer.animate({ speed: 2 });
      statusDiv.textContent = '动画状态: 正常运行';
    },
    '#0088ff',
  );

  // 日志面板
  const logPanel = document.createElement('div');
  logPanel.style.cssText = `
    margin-top: 15px;
    max-height: 100px;
    overflow-y: auto;
    font-family: monospace;
    font-size: 11px;
    color: #aaa;
    border-top: 1px solid #333;
    padding-top: 10px;
  `;
  controlPanel.appendChild(logPanel);

  const log = (msg: string) => {
    const div = document.createElement('div');
    div.textContent = `[${new Date().toLocaleTimeString()}] ${msg}`;
    logPanel.insertBefore(div, logPanel.firstChild);
    while (logPanel.children.length > 10) {
      logPanel.removeChild(logPanel.lastChild!);
    }
  };

  scene.on('loaded', () => log('场景加载完成'));

  return scene;
};
