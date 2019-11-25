let containerCounter = 0;

export function createRendererContainer(domId: string): HTMLDivElement | null {
  const $wrapper = document.getElementById(domId);

  if ($wrapper) {
    const $container = document.createElement('div');
    $container.style.cssText += `
      position: absolute;
      top: 0;
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
