import * as Util from './util';
export function create(tagName, className, container) {
  const el = document.createElement(tagName);
  el.className = className || '';

  if (container) {
    container.appendChild(el);
  }
  return el;
}
// @function remove(el: HTMLElement)
// Removes `el` from its parent element
export function remove(el) {
  const parent = el.parentNode;
  if (parent) {
    parent.removeChild(el);
  }
}

// @function addClass(el: HTMLElement, name: String)
// Adds `name` to the element's class attribute.
export function addClass(el, name) {
  if (el.classList !== undefined) {
    const classes = Util.splitWords(name);
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
export function removeClass(el, name) {
  if (el.classList !== undefined) {
    el.classList.remove(name);
  } else {
    setClass(el, Util.trim((' ' + getClass(el) + ' ').replace(' ' + name + ' ', ' ')));
  }
}

// @function hasClass(el: HTMLElement, name: String): Boolean
// Returns `true` if the element's class attribute contains `name`.
export function hasClass(el, name) {
  if (el.classList !== undefined) {
    return el.classList.contains(name);
  }
  const className = getClass(el);
  return className.length > 0 && new RegExp('(^|\\s)' + name + '(\\s|$)').test(className);
}

// @function setClass(el: HTMLElement, name: String)
// Sets the element's class.
export function setClass(el, name) {
  if (el.className.baseVal === undefined) {
    el.className = name;
  } else {
    // in case of SVG element
    el.className.baseVal = name;
  }
}

// @function getClass(el: HTMLElement): String
// Returns the element's class.
export function getClass(el) {
  // Check if the element is an SVGElementInstance and use the correspondingElement instead
  // (Required for linked SVG elements in IE11.)
  if (el.correspondingElement) {
    el = el.correspondingElement;
  }
  return el.className.baseVal === undefined ? el.className : el.className.baseVal;
}

export function empty(el) {
  while (el.firstChild) {
    el.removeChild(el.firstChild);
  }
}
