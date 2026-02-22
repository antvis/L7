/**
 * 事件系统测试 - 验证重构后的事件系统
 * 测试内容：
 * 1. 所有 InteractionEvent 类型
 * 2. 场景事件 (resize, destroy)
 * 3. 图层事件
 */
import { PointLayer } from '@antv/l7';
import type { TestCase } from '../../types';
import { CaseScene } from '../../utils';

export const eventsTest: TestCase = async (options) => {
  const scene = await CaseScene({
    ...options,
    mapConfig: {
      center: [116.397428, 39.90923],
      zoom: 10,
    },
  });

  const container = options.id as HTMLDivElement;

  // 创建事件日志面板
  const logPanel = document.createElement('div');
  logPanel.id = 'event-log';
  logPanel.style.cssText = `
    position: absolute;
    top: 10px;
    right: 10px;
    width: 350px;
    max-height: 70vh;
    overflow-y: auto;
    background: rgba(0, 0, 0, 0.9);
    color: #0f0;
    font-family: 'Courier New', monospace;
    font-size: 12px;
    padding: 15px;
    border-radius: 8px;
    z-index: 1000;
  `;
  container.appendChild(logPanel);

  // 标题
  const title = document.createElement('div');
  title.innerHTML =
    '<b style="color: #0ff;">事件系统测试</b><br><span style="color: #888; font-size: 11px;">请进行各种交互操作查看事件触发</span>';
  title.style.cssText = 'margin-bottom: 15px; padding-bottom: 10px; border-bottom: 1px solid #333;';
  logPanel.appendChild(title);

  // 事件统计
  const stats: Record<string, number> = {
    hover: 0,
    click: 0,
    dblclick: 0,
    drag: 0,
    press: 0,
    select: 0,
    active: 0,
  };

  const statsDiv = document.createElement('div');
  statsDiv.style.cssText =
    'margin-bottom: 15px; padding: 10px; background: rgba(0,255,0,0.1); border-radius: 4px;';
  logPanel.appendChild(statsDiv);

  const updateStats = () => {
    statsDiv.innerHTML = Object.entries(stats)
      .map(
        ([k, v]) =>
          `<span style="margin-right: 15px;"><span style="color: #ff0;">${k}:</span> ${v}</span>`,
      )
      .join('');
  };
  updateStats();

  // 日志容器
  const logContainer = document.createElement('div');
  logContainer.style.cssText = 'max-height: 300px; overflow-y: auto;';
  logPanel.appendChild(logContainer);

  const log = (event: string, detail: string, color = '#0f0') => {
    const entry = document.createElement('div');
    entry.style.cssText = `
      margin-bottom: 4px;
      padding: 4px 8px;
      background: rgba(${color === '#0f0' ? '0,255,0' : color === '#ff0' ? '255,255,0' : color === '#f00' ? '255,0,0' : '0,255,255'}, 0.1);
      border-left: 3px solid ${color};
      border-radius: 2px;
    `;
    entry.innerHTML = `<span style="color: #888;">[${new Date().toLocaleTimeString()}]</span> <span style="color: ${color};">${event}</span> ${detail}`;
    logContainer.insertBefore(entry, logContainer.firstChild);
    while (logContainer.children.length > 50) {
      logContainer.removeChild(logContainer.lastChild!);
    }
  };

  // 清除日志按钮
  const clearBtn = document.createElement('button');
  clearBtn.textContent = '清除日志';
  clearBtn.style.cssText = `
    margin-top: 10px;
    padding: 5px 15px;
    background: #333;
    color: #fff;
    border: 1px solid #555;
    border-radius: 4px;
    cursor: pointer;
  `;
  clearBtn.onclick = () => {
    logContainer.innerHTML = '';
    Object.keys(stats).forEach((k) => (stats[k] = 0));
    updateStats();
  };
  logPanel.appendChild(clearBtn);

  // ========== 监听交互服务事件 ==========
  const interactionService = (scene as any).interactionService;

  if (interactionService) {
    // Hover 事件
    interactionService.on('hover', (e: any) => {
      stats.hover++;
      updateStats();
      log('HOVER', `x: ${Math.round(e.x)}, y: ${Math.round(e.y)}`, '#0f0');
    });

    // Click 事件
    interactionService.on('click', (e: any) => {
      stats.click++;
      updateStats();
      log('CLICK', `x: ${Math.round(e.x)}, y: ${Math.round(e.y)}`, '#ff0');
    });

    // DoubleClick 事件
    interactionService.on('dblclick', (e: any) => {
      stats.dblclick++;
      updateStats();
      log('DBLCLICK', `x: ${Math.round(e.x)}, y: ${Math.round(e.y)}`, '#f0f');
    });

    // Drag 事件
    interactionService.on('drag', (e: any) => {
      stats.drag++;
      updateStats();
      // 只在开始和结束时记录
      if (e.type === 'dragstart' || e.type === 'dragend') {
        log('DRAG', e.type, '#08f');
      }
    });

    // Press 事件
    interactionService.on('press', (e: any) => {
      stats.press++;
      updateStats();
      log('PRESS', `x: ${Math.round(e.x)}, y: ${Math.round(e.y)}`, '#f80');
    });
  }

  // ========== 场景级事件 ==========
  scene.on('resize', () => {
    log('SCENE', 'resize', '#0ff');
  });

  scene.on('loaded', () => {
    log('SCENE', 'loaded', '#0ff');
  });

  // ========== 图层事件 ==========
  const pointLayer = new PointLayer({})
    .source(
      [
        { lng: 116.397428, lat: 39.90923, id: 1, name: '点A' },
        { lng: 116.387428, lat: 39.91923, id: 2, name: '点B' },
        { lng: 116.407428, lat: 39.89923, id: 3, name: '点C' },
        { lng: 116.417428, lat: 39.90923, id: 4, name: '点D' },
        { lng: 116.377428, lat: 39.90923, id: 5, name: '点E' },
      ],
      { parser: { type: 'json', x: 'lng', y: 'lat' } },
    )
    .shape('circle')
    .size(25)
    .color('#0066ff')
    .style({ opacity: 0.8, strokeWidth: 2, stroke: '#fff' })
    .active(true);

  // 图层点击
  pointLayer.on('click', (e: any) => {
    log('LAYER', `click: ${e.feature?.name} (id: ${e.feature?.id})`, '#0af');
  });

  // 图层双击
  pointLayer.on('dblclick', (e: any) => {
    log('LAYER', `dblclick: ${e.feature?.name}`, '#a0f');
  });

  // 图层鼠标移入
  pointLayer.on('mouseenter', (e: any) => {
    log('LAYER', `mouseenter: ${e.feature?.name}`, '#fa0');
  });

  // 图层鼠标移出
  pointLayer.on('mouseout', (e: any) => {
    log('LAYER', `mouseout: ${e.feature?.name}`, '#888');
  });

  // 图层右键
  pointLayer.on('contextmenu', (e: any) => {
    e.target?.preventDefault?.();
    log('LAYER', `contextmenu: ${e.feature?.name}`, '#f00');
  });

  scene.addLayer(pointLayer);

  // 初始日志
  log('SYSTEM', '测试已启动，请进行交互操作', '#0ff');

  return scene;
};
