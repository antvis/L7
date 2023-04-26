import { pull } from 'lodash';
import { $window } from './mini-adapter';

export type ELType = HTMLElement | SVGElement;

export type ElementType =
  | HTMLElement
  | HTMLElement[]
  | DocumentFragment
  | Text
  | string;

export function getContainer(domId: string | HTMLDivElement) {
  let $dom = domId as HTMLDivElement;
  if (typeof domId === 'string') {
    $dom = $window.document.getElementById(domId) as HTMLDivElement;
  }
  return $dom;
}

export function trim(str: string) {
  return str.trim ? str.trim() : str.replace(/^\s+|\s+$/g, '');
}

// @function splitWords(str: String): String[]
// Trims and splits the string on whitespace and returns the array of parts.
export function splitWords(str: string) {
  return trim(str).split(/\s+/);
}

function testProp(props: string[]): string {
  const docStyle = $window?.document?.documentElement?.style;
  if (!docStyle) {
    return props[0];
  }
  for (const i in props) {
    if (props[i] && props[i] in docStyle) {
      return props[i];
    }
  }

  return props[0];
}
export function create(
  tagName: string,
  className?: string,
  container?: HTMLElement,
) {
  const el = $window.document.createElement(tagName);
  if (className) {
    el.className = className || '';
  }

  if (container) {
    container.appendChild(el);
  }
  return el;
}
// @function remove(el: HTMLElement)
// Removes `el` from its parent element
export function remove(el: ELType | DocumentFragment) {
  const parent = el.parentNode;
  if (parent) {
    parent.removeChild(el);
  }
}

// @function addClass(el: HTMLElement, name: String)
// Adds `name` to the element's class attribute.
export function addClass(el: ELType, name: string) {
  if (el.classList !== undefined) {
    const classes = splitWords(name);
    for (let i = 0, len = classes.length; i < len; i++) {
      el.classList.add(classes[i]);
    }
  } else if (!hasClass(el, name)) {
    const className = getClass(el);
    setClass(el, (className ? className + ' ' : '') + name);
  }
}

// @function removeClass(el: HTMLElement, name: String)
// Removes `name` from the element's class attribute.
export function removeClass(el: ELType, name: string) {
  if (el.classList !== undefined) {
    const classes = splitWords(name);
    classes.forEach((className) => {
      el.classList.remove(className);
    });
  } else {
    setClass(
      el,
      trim((' ' + getClass(el) + ' ').replace(' ' + name + ' ', ' ')),
    );
  }
}

// @function hasClass(el: HTMLElement, name: String): Boolean
// Returns `true` if the element's class attribute contains `name`.
export function hasClass(el: ELType, name: string) {
  if (el.classList !== undefined) {
    return el.classList.contains(name);
  }
  const className = getClass(el);
  return (
    className.length > 0 &&
    new RegExp('(^|\\s)' + name + '(\\s|$)').test(className)
  );
}

// @function setClass(el: HTMLElement, name: String)
// Sets the element's class.
export function setClass(el: ELType, name: string) {
  if (el instanceof HTMLElement) {
    el.className = name;
  } else {
    // in case of SVG element
    el.className.baseVal = name;
  }
}

// @function getClass(el: HTMLElement): String
// Returns the element's class.
export function getClass(el: ELType) {
  // Check if the element is an SVGElementInstance and use the correspondingElement instead
  // (Required for linked SVG elements in IE11.)
  if (el instanceof SVGElement) {
    // @ts-ignore
    el = el.correspondingElement;
  }
  return el.className.baseVal === undefined
    ? el.className
    : el.className.baseVal;
}

export function empty(el: ELType) {
  while (el && el.firstChild) {
    el.removeChild(el.firstChild);
  }
}

const transformProp = testProp(['transform', 'WebkitTransform']);

export function setTransform(el: ELType, value: string) {
  // @ts-ignore
  el.style[transformProp] = value;
}

export function triggerResize() {
  if (typeof Event === 'function') {
    // modern browsers
    $window.dispatchEvent(new Event('resize'));
  } else {
    // for IE and other old browsers
    // causes deprecation warning on modern browsers
    const evt = $window.document.createEvent('UIEvents');
    // @ts-ignore
    evt.initUIEvent('resize', true, false, $window, 0);
    $window.dispatchEvent(evt);
  }
}

export function printCanvas(canvas: HTMLCanvasElement) {
  const css = [
    'padding: ' + (canvas.height / 2 - 8) + 'px ' + canvas.width / 2 + 'px;',
    'line-height: ' + canvas.height + 'px;',
    'background-image: url(' + canvas.toDataURL() + ');',
  ];
  // tslint:disable-next-line:no-console
  console.log('%c\n', css.join(''));
}

export function getViewPortScale() {
  const meta = $window.document.querySelector('meta[name="viewport"]');
  if (!meta) {
    return 1;
  }
  const contentItems = (meta as any).content?.split(',');
  const scale = contentItems.find((item: string) => {
    const [key] = item.split('=');
    return key === 'initial-scale';
  });
  return scale ? scale.split('=')[1] * 1 : 1;
}

export const DPR = getViewPortScale() < 1 ? 1 : $window.devicePixelRatio;

export function addStyle(el: ELType, style: string) {
  el.setAttribute('style', `${el.style.cssText}${style}`);
}

export function getStyleList(style: string): string[] {
  return style
    .split(';')
    .map((item) => item.trim())
    .filter((item) => item);
}

export function removeStyle(el: ELType, style: string) {
  const oldStyleList = getStyleList(el.getAttribute('style') ?? '');
  const targetStyleList = getStyleList(style);
  const newStyleList = pull(oldStyleList, ...targetStyleList);
  el.setAttribute('style', newStyleList.join(';'));
}

export function css2Style(obj: any) {
  return Object.entries(obj)
    .map(([key, value]) => `${key}: ${value}`)
    .join(';');
}

export function getDiffRect(dom1Rect: any, dom2Rect: any) {
  return {
    left: dom1Rect.left - dom2Rect.left,
    top: dom1Rect.top - dom2Rect.top,
    right: dom2Rect.left + dom2Rect.width - dom1Rect.left - dom1Rect.width,
    bottom: dom2Rect.top + dom2Rect.height - dom1Rect.top - dom1Rect.height,
  };
}

export function setChecked(el: ELType, value: boolean) {
  // @ts-ignore
  el.checked = value;
  if (value) {
    el.setAttribute('checked', 'true');
  } else {
    el.removeAttribute('checked');
  }
}

export function clearChildren(el: ELType) {
  el.innerHTML = '';
}

export function setUnDraggable(el: ELType) {
  el.setAttribute('draggable', 'false');
}

export function appendElementType(
  container: HTMLElement | DocumentFragment,
  children: ElementType,
) {
  if (typeof children === 'string') {
    const div = document.createElement('div');
    div.innerHTML = children;
    while (div.firstChild) {
      container.append(div.firstChild);
    }
  } else if (Array.isArray(children)) {
    container.append(...children);
  } else {
    container.append(children);
  }
}
