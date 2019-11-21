const docStyle = window.document.documentElement.style;
type ELType = HTMLElement | SVGElement;
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
    $container.id = 'l7_canvaslayer';
    $wrapper.appendChild($container);
    return $container;
  }

  return null;
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
  const el = document.createElement(tagName);
  el.className = className || '';

  if (container) {
    container.appendChild(el);
  }
  return el;
}
// @function remove(el: HTMLElement)
// Removes `el` from its parent element
export function remove(el: ELType) {
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
    el.classList.remove(name);
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
    el = el.correspondingElement;
  }
  return el.className.baseVal === undefined
    ? el.className
    : el.className.baseVal;
}

export function empty(el: ELType) {
  while (el.firstChild) {
    el.removeChild(el.firstChild);
  }
}

const transformProp = testProp(['transform', 'WebkitTransform']);

export function setTransform(el: ELType, value: string) {
  // @ts-ignore
  el.style[transformProp] = value;
}
