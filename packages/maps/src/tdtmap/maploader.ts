export const load = (options: any) => {
  const { tk } = options;

  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = `https://api.tianditu.gov.cn/api?v=4.0&tk=${tk}`;

    // 定义加载脚本完成后的回调函数
    script.onload = function () {
      console.log('TianDiTu API script loaded.');
      // 在这里可以开始使用TianDiTu API
      resolve(true);
    };

    script.onerror = function () {
      console.error('Failed to load TianDiTu API script.');
      // 处理加载失败的情况
      resolve(false);
    };

    // 将脚本元素添加到文档的<head>中
    document.head.appendChild(script);
  });
};

export const reset = () => {
  // @ts-ignore
};
