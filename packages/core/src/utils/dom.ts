let containerCounter = 0;
export function createRendererContainer(domId: string | HTMLDivElement): HTMLDivElement | null {
  let $wrapper = domId as HTMLDivElement;
  if (typeof domId === 'string') {
    $wrapper = document.getElementById(domId) as HTMLDivElement;
  }
  if ($wrapper) {
    const $container = document.createElement('div');
    $container.style.cssText += `
      position: absolute;
      z-index:2;
      height: 100%;
      width: 100%;
      pointer-events: none;
    `;
    $container.id = `l7-scene-${containerCounter++}`;
    $container.classList.add('l7-scene');
    $wrapper.appendChild($container);
    return $container;
  }

  return null;
}

/**
 * 检测触发事件是否是在 marker/popup 上发生，若是则会发生冲突（发生冲突时 marker/popup 事件优先）
 * @param layerEvent
 * @returns
 */
export function isEventCrash(layerEvent: any) {
  let notCrash = true;
  // 获取图层鼠标事件中对应点击的 DOM 元素
  if (layerEvent?.target?.target instanceof HTMLElement) {
    let currentElement: HTMLElement | null = layerEvent?.target?.target;
    while (currentElement) {
      const classList = Array.from(currentElement.classList);
      if (classList.includes('l7-marker') || classList.includes('l7-popup')) {
        notCrash = false;
        break;
      }
      currentElement = currentElement?.parentElement;
    }
  }
  return notCrash;
}
