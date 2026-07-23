import { ensureSvgSprite } from '../assets/iconfont/iconfont';

export const createL7Icon = (className: string) => {
  // Ensure SVG sprite is loaded before creating the icon reference
  ensureSvgSprite();

  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.classList.add('l7-iconfont');
  svg.setAttribute('aria-hidden', 'true');
  const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
  use.setAttributeNS('http://www.w3.org/1999/xlink', 'href', `#${className}`);
  svg.appendChild(use);
  return svg;
};
