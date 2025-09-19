import { PointLayer } from '@antv/l7';
import type { TestCase } from '../../types';
import { CaseScene } from '../../utils';

export const exportImage: TestCase = async (options) => {
  const scene = await CaseScene({
    ...options,
    mapConfig: {
      center: [116.417463, 40.015175],
      zoom: 8,
      minZoom: 5,
    },
  });

  // 添加示例数据
  const data = await fetch(
    'https://gw.alipayobjects.com/os/antfincdn/8Ps2h%24qgmk/traffic_110000.csv',
  ).then((res) => res.text());

  const colors = ['#c57f34', '#cbfddf', '#edea70', '#8cc9f1', '#2c7bb6'];
  const pointLayer = new PointLayer({})
    .source(data, {
      parser: {
        type: 'csv',
        y: 'lat',
        x: 'lng',
      },
    })
    .shape('dot')
    .size(0.5)
    .color('type', (type) => {
      switch (parseInt(type)) {
        case 3:
          return colors[0];
        case 4:
          return colors[1];
        case 41:
          return colors[2];
        case 5:
          return colors[3];
        default:
          return colors[4];
      }
    });

  scene.addLayer(pointLayer);

  // 等待图层渲染完成
  await new Promise((resolve) => {
    const checkRender = () => {
      if (scene.getLayers().every((layer) => layer.isVisible())) {
        resolve(true);
      } else {
        setTimeout(checkRender, 100);
      }
    };
    checkRender();
  });

  // 创建导出UI
  const createExportUI = () => {
    const container = document.createElement('div');
    container.style.cssText = `
      position: absolute;
      top: 140px;
      right: 20px;
      z-index: 1000;
      background: rgba(255, 255, 255, 0.95);
      padding: 15px;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.15);
      font-family: Arial, sans-serif;
      min-width: 200px;
    `;

    const title = document.createElement('div');
    title.textContent = '地图导出';
    title.style.cssText = `
      font-weight: bold;
      margin-bottom: 10px;
      color: #333;
      font-size: 16px;
    `;

    const formatSelect = document.createElement('select');
    formatSelect.style.cssText = `
      width: 100%;
      padding: 5px;
      margin-bottom: 10px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 14px;
    `;

    const formats = [
      { value: 'png', text: 'PNG' },
      { value: 'jpg', text: 'JPEG' },
    ];

    formats.forEach((format) => {
      const option = document.createElement('option');
      option.value = format.value;
      option.textContent = format.text;
      formatSelect.appendChild(option);
    });

    const exportBtn = document.createElement('button');
    exportBtn.textContent = '导出图片';
    exportBtn.style.cssText = `
      width: 100%;
      background: #1890ff;
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
      margin-bottom: 8px;
    `;

    const downloadBtn = document.createElement('button');
    downloadBtn.textContent = '下载';
    downloadBtn.style.cssText = `
      width: 100%;
      background: #52c41a;
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
    `;

    const status = document.createElement('div');
    status.id = 'export-status';
    status.style.cssText = `
      margin-top: 10px;
      font-size: 12px;
      color: #666;
      text-align: center;
    `;

    const previewContainer = document.createElement('div');
    previewContainer.style.cssText = `
      margin-top: 10px;
      text-align: center;
    `;

    container.appendChild(title);
    container.appendChild(formatSelect);
    container.appendChild(exportBtn);
    container.appendChild(downloadBtn);
    container.appendChild(status);
    container.appendChild(previewContainer);

    // 导出功能 - 使用场景提供的导出API
    const exportImage = async () => {
      try {
        status.textContent = '导出中...';
        exportBtn.disabled = true;

        // @ts-ignore
        const format = formatSelect.value as 'png' | 'jpg';
        //@ts-ignore
        console.log('format', scene.mapService);
        //@ts-ignore
        const dataURL = await scene.mapService.exportMap('png');
        // 使用场景的导出方法
        // const dataURL = await scene.exportMap(format)
        if (!dataURL) {
          throw new Error('导出失败：无法获取图片数据');
        }

        // 创建预览
        let preview = document.getElementById('image-preview') as HTMLImageElement;
        if (!preview) {
          preview = document.createElement('img');
          preview.id = 'image-preview';
          preview.style.cssText = `
            max-width: 100%;
            max-height: 150px;
            margin-top: 10px;
            border: 1px solid #ddd;
            border-radius: 4px;
            cursor: pointer;
          `;
          preview.title = '点击查看大图';
          previewContainer.appendChild(preview);
        }

        preview.src = dataURL;
        (window as any).exportedImageData = {
          dataURL,
          format,
          timestamp: Date.now(),
        };

        status.textContent = '导出成功！';
        status.style.color = '#52c41a';

        // 添加点击预览功能
        preview.onclick = () => {
          window.open(dataURL, '_blank');
        };
      } catch (error) {
        status.textContent = '导出失败：' + (error as Error).message;
        status.style.color = '#ff4d4f';
        console.error('导出失败:', error);
      } finally {
        exportBtn.disabled = false;
      }
    };

    const downloadImage = () => {
      const exportData = (window as any).exportedImageData;
      if (!exportData || !exportData.dataURL) {
        status.textContent = '请先导出图片';
        status.style.color = '#faad14';
        setTimeout(() => {
          status.textContent = '';
        }, 2000);
        return;
      }

      try {
        const link = document.createElement('a');
        const extension = exportData.format;
        link.download = `l7-map-${new Date(exportData.timestamp).toISOString().slice(0, 19).replace(/:/g, '-')}.${extension}`;
        link.href = exportData.dataURL;
        link.click();

        status.textContent = '下载成功！';
        status.style.color = '#52c41a';
        setTimeout(() => {
          status.textContent = '';
        }, 2000);
      } catch (error) {
        status.textContent = '下载失败：' + (error as Error).message;
        status.style.color = '#ff4d4f';
        console.error('下载失败:', error);
      }
    };

    exportBtn.addEventListener('click', exportImage);
    downloadBtn.addEventListener('click', downloadImage);

    return container;
  };

  // 确保UI添加到地图容器中
  const mapContainer =
    typeof options.id === 'string' ? document.getElementById(options.id) : options.id;

  if (mapContainer) {
    mapContainer.style.position = 'relative';
    const ui = createExportUI();
    mapContainer.appendChild(ui);
  }

  return scene;
};
