/**
 * 多边形绘制测试 - 使用 @antv/l7-draw 绑定绑定绘制多边形
 * 测试内容：
 * 1. 绑定绑定绘制多边形
 * 2. 显示绘制面积
 * 3. 获取绑定的 GeoJSON 数据
 */
import { DrawEvent, DrawPolygon } from '@antv/l7-draw';
import type { TestCase } from '../../types';
import { CaseScene } from '../../utils';

export const drawPolygonTest: TestCase = async (options) => {
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
  title.textContent = '多边形绘制测试';
  title.style.cssText = 'margin: 0 0 15px 0; color: #0ff;';
  controlPanel.appendChild(title);

  // 提示
  const hint = document.createElement('div');
  hint.style.cssText = 'margin-bottom: 15px; color: #ff0; font-size: 12px;';
  hint.textContent = '点击地图开始绘制，双击结束';
  controlPanel.appendChild(hint);

  // 状态显示
  const statusDiv = document.createElement('div');
  statusDiv.style.cssText =
    'margin-bottom: 15px; padding: 10px; background: rgba(0,255,0,0.1); border-radius: 4px;';
  statusDiv.innerHTML = '<div>状态: 等待绘制</div><div>已绘制: 0 个多边形</div>';
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

  // 初始化 DrawPolygon
  // 注意：CaseScene 已经等待 loaded 事件，所以场景已经加载完成
  let drawPolygon: DrawPolygon | null = null;
  let polygonCount = 0;

  drawPolygon = new DrawPolygon(scene, {
    areaOptions: {
      format: (area: number) => {
        return `面积: ${area.toFixed(2)} km²`;
      },
    },
  });

  // 监听绘制事件
  drawPolygon.on(DrawEvent.Change, (allFeatures: any[]) => {
    polygonCount = allFeatures.length;
    statusDiv.innerHTML = `
      <div>状态: 已绘制 ${polygonCount} 个多边形</div>
      <div>最后更新: ${new Date().toLocaleTimeString()}</div>
    `;
    console.log('绘制的所有要素:', allFeatures);
  });

  drawPolygon.on(DrawEvent.Add, (feature: any) => {
    console.log('绘制完成:', feature);
  });

  createButton(
    '开始绘制',
    () => {
      drawPolygon?.enable();
      hint.textContent = '点击地图开始绘制，双击结束';
    },
    '#44aa44',
  );

  createButton(
    '停止绘制',
    () => {
      drawPolygon?.disable();
      hint.textContent = '已停止绘制模式';
    },
    '#ff4444',
  );

  createButton(
    '清除所有',
    () => {
      drawPolygon?.clear();
      polygonCount = 0;
      statusDiv.innerHTML = '<div>状态: 已清除</div><div>已绘制: 0 个多边形</div>';
    },
    '#ff8800',
  );

  createButton(
    '导出 GeoJSON',
    () => {
      const data = drawPolygon?.getData();
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
