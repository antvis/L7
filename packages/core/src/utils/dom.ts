const docStyle = window.document.documentElement.style;
type ELType = HTMLElement | SVGElement;
let containerCounter = 0;
export function createRendererContainer(
  domId: string | HTMLDivElement,
): HTMLDivElement | null {
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
