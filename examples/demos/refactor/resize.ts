/**
 * ResizeObserver 测试 - 验证原生 ResizeObserver 替换 element-resize-detector
 * 测试内容：
 * 1. 容器大小变化时自动调整canvas
 * 2. 窗口resize事件
 * 3. 容器动态改变大小
 */
import { PointLayer } from '@antv/l7';
import type { TestCase } from '../../types';
import { CaseScene } from '../../utils';

export const resizeObserverTest: TestCase = async (options) => {
  const scene = await CaseScene({
    ...options,
    mapConfig: {
      center: [116.397428, 39.90923],
      zoom: 10,
    },
  });

  const container = options.id as HTMLDivElement;

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
  `;
  container.appendChild(controlPanel);

  // 状态显示
  const statusDiv = document.createElement('div');
  statusDiv.style.cssText = 'margin-bottom: 15px; color: #0f0;';
  controlPanel.appendChild(statusDiv);

  const updateStatus = () => {
    const mapContainer = scene.getMapContainer();
    if (mapContainer) {
      const rect = mapContainer.getBoundingClientRect();
      statusDiv.innerHTML = `
        <div>容器尺寸: ${Math.round(rect.width)} x ${Math.round(rect.height)}</div>
        <div>Canvas: ${scene.getCanvas()?.width || 0} x ${scene.getCanvas()?.height || 0}</div>
        <div>DPR: ${window.devicePixelRatio}</div>
      `;
    }
  };

  updateStatus();

  // 按钮容器
  const buttonContainer = document.createElement('div');
  buttonContainer.style.cssText = 'display: flex; flex-direction: column; gap: 10px;';
  controlPanel.appendChild(buttonContainer);

  // 创建按钮的辅助函数
  const createButton = (text: string, onClick: () => void) => {
    const btn = document.createElement('button');
    btn.textContent = text;
    btn.style.cssText = `
      padding: 8px 16px;
      background: #0066ff;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    `;
    btn.onclick = onClick;
    buttonContainer.appendChild(btn);
    return btn;
  };

  // 调整容器大小的函数
  let currentWidth = 100;
  let currentHeight = 100;

  createButton('缩小容器 (80%)', () => {
    currentWidth = 80;
    currentHeight = 80;
    container.style.width = '80%';
    container.style.height = '80%';
    logResize('缩小到 80%');
  });

  createButton('恢复容器 (100%)', () => {
    currentWidth = 100;
    currentHeight = 100;
    container.style.width = '100%';
    container.style.height = '100%';
    logResize('恢复到 100%');
  });

  createButton('放大容器 (120%)', () => {
    container.style.width = '120%';
    container.style.height = '120%';
    logResize('放大到 120%');
  });

  createButton('固定尺寸 (600x400)', () => {
    container.style.width = '600px';
    container.style.height = '400px';
    logResize('固定尺寸 600x400');
  });

  // 日志面板
  const logPanel = document.createElement('div');
  logPanel.style.cssText = `
    margin-top: 15px;
    max-height: 150px;
    overflow-y: auto;
    font-family: monospace;
    font-size: 11px;
    color: #0f0;
    border-top: 1px solid #333;
    padding-top: 10px;
  `;
  controlPanel.appendChild(logPanel);

  const logResize = (message: string) => {
    const entry = document.createElement('div');
    entry.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
    logPanel.insertBefore(entry, logPanel.firstChild);
    while (logPanel.children.length > 20) {
      logPanel.removeChild(logPanel.lastChild!);
    }
    setTimeout(updateStatus, 100);
  };

  // 监听 resize 事件
  scene.on('resize', () => {
    logResize('Scene resize 事件触发');
    updateStatus();
  });

  // 添加示例图层
  const pointLayer = new PointLayer({})
    .source(
      [
        { lng: 116.397428, lat: 39.90923 },
        { lng: 116.407428, lat: 39.91923 },
        { lng: 116.387428, lat: 39.89923 },
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
    .size(30)
    .color('#0066ff')
    .active(true);

  scene.addLayer(pointLayer);

  // 定期更新状态
  setInterval(updateStatus, 1000);

  return scene;
};
