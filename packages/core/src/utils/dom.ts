// const docStyle = window.document.documentElement.style;
type ELType = HTMLElement | SVGElement;
import { isMiniAli } from '@antv/l7-utils';
let containerCounter = 0;
export function createRendererContainer(
  domId: string | HTMLDivElement,
): HTMLDivElement | null {
  if (isMiniAli) {
    // l7 - mini
    return null;
  } else {
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
}
