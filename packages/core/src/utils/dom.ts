import { isMini } from '@antv/l7-utils';
let containerCounter = 0;
export function createRendererContainer(
  domId: string | HTMLDivElement,
): HTMLDivElement | null {
  if (isMini) {
    return null;
  }

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
 * @param obj
 * @returns
 */
export function isEventCrash(obj: any) {
  let notCrash = true;
  obj?.target?.path?.map((p: HTMLElement) => {
    if (p?.classList) {
      p?.classList?.forEach((n: any) => {
        if (n === 'l7-marker' || n === 'l7-popup') {
          notCrash = false;
        }
      });
    }
  });
  return notCrash;
}
