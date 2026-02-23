/**
 * 点绘制测试 - 使用 @antv/l7-draw 绑定绘制点
 * 测试内容：
 * 1. 绑定绘制点
 * 2. 获取绑定的 GeoJSON 数据
 */
import { DrawEvent, DrawPoint } from '@antv/l7-draw';
import type { TestCase } from '../../types';
import { CaseScene } from '../../utils';

export const drawPointTest: TestCase = async (options) => {
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
    bottom: 10px;
    right: 10px;
    background: rgba(0, 0, 0, 0.8);
    color: #fff;
    font-family: sans-serif;
    font-size: 14px;
    padding: 15px;
    border-radius: 8px;
    z-index: 1000;
    min-width: 200px;
  `;
  container.appendChild(controlPanel);

  // 标题
  const title = document.createElement('h3');
  title.textContent = '点绘制测试';
  title.style.cssText = 'margin: 0 0 15px 0; color: #0ff;';
  controlPanel.appendChild(title);

  // 提示
  const hint = document.createElement('div');
  hint.style.cssText = 'margin-bottom: 15px; color: #ff0; font-size: 12px;';
  hint.textContent = '点击地图开始绘制';
  controlPanel.appendChild(hint);

  // 状态显示
  const statusDiv = document.createElement('div');
  statusDiv.style.cssText =
    'margin-bottom: 15px; padding: 10px; background: rgba(0,255,0,0.1); border-radius: 4px;';
  statusDiv.innerHTML = '<div>状态: 等待绘制</div><div>已绘制: 0 个点</div>';
  controlPanel.appendChild(statusDiv);

  // 按钮容器
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

  // 初始化 DrawPoint
  // 注意：CaseScene 已经等待 loaded 事件，所以场景已经加载完成
  let drawPoint: DrawPoint | null = null;
  let pointCount = 0;

  drawPoint = new DrawPoint(scene, {
    style: {
      point: {
        normal: {
          color: '#ff6600',
          shape: 'circle',
          size: 10,
        },
        hover: {
          color: '#ff8800',
          shape: 'circle',
          size: 12,
        },
        active: {
          color: '#ffaa00',
          shape: 'circle',
          size: 14,
        },
      },
    },
  });

  // 监听绘制事件
  drawPoint.on(DrawEvent.Change, (allFeatures: any[]) => {
    pointCount = allFeatures.length;
    statusDiv.innerHTML = `
      <div>状态: 已绘制 ${pointCount} 个点</div>
      <div>最后更新: ${new Date().toLocaleTimeString()}</div>
    `;
    console.log('绘制的所有要素:', allFeatures);
  });

  drawPoint.on(DrawEvent.Add, (feature: any) => {
    console.log('绘制完成:', feature);
    const coords = feature.geometry.coordinates;
    hint.textContent = `最后绘制: [${coords[0].toFixed(4)}, ${coords[1].toFixed(4)}]`;
  });

  createButton(
    '开始绘制',
    () => {
      drawPoint?.enable();
      hint.textContent = '点击地图添加点';
    },
    '#44aa44',
  );

  createButton(
    '停止绘制',
    () => {
      drawPoint?.disable();
      hint.textContent = '已停止绘制模式';
    },
    '#ff4444',
  );

  createButton(
    '清除所有',
    () => {
      drawPoint?.clear();
      pointCount = 0;
      statusDiv.innerHTML = '<div>状态: 已清除</div><div>已绘制: 0 个点</div>';
    },
    '#ff8800',
  );

  createButton(
    '导出 GeoJSON',
    () => {
      const data = drawPoint?.getData();
      if (data && data.length > 0) {
        console.log('GeoJSON 数据:', JSON.stringify(data, null, 2));
        alert('GeoJSON 已输出到控制台');
      } else {
        alert('没有绑定的数据');
      }
    },
    '#0088ff',
  );

  return scene;
};
