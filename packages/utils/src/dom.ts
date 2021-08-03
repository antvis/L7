// const docStyle = window.document.documentElement.style;
type ELType = HTMLElement | SVGElement;
export function getContainer(domId: string | HTMLDivElement) {
  // let $dom = domId as HTMLDivElement; // l7 - mini
  // if (typeof domId === 'string') {// l7 - mini
  //   $dom = document.getElementById(domId) as HTMLDivElement;// l7 - mini
  // }// l7 - mini
  // return $dom;// l7 - mini
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
  // if (!docStyle) { // l7 - mini
  //   return props[0];// l7 - mini
  // }// l7 - mini
  // for (const i in props) {// l7 - mini
  //   if (props[i] && props[i] in docStyle) {// l7 - mini
  //     return props[i];// l7 - mini
  //   }// l7 - mini
  // }// l7 - mini

  return props[0];
}
export function create(
  tagName: string,
  className?: string,
  container?: HTMLElement,
) {
  // const el = document.createElement(tagName);// l7 - mini
  // el.className = className || '';// l7 - mini

  // if (container) {// l7 - mini
  //   container.appendChild(el);// l7 - mini
  // }// l7 - mini
  // return el;// l7 - mini
  return null;
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
  // if (typeof Event === 'function') { // l7 - mini
  //   // modern browsers// l7 - mini
  //   window.dispatchEvent(new Event('resize'));// l7 - mini
  // } else {// l7 - mini
  //   // for IE and other old browsers// l7 - mini
  //   // causes deprecation warning on modern browsers// l7 - mini
  //   const evt = window.document.createEvent('UIEvents');// l7 - mini
  //   // @ts-ignore// l7 - mini
  //   evt.initUIEvent('resize', true, false, window, 0);// l7 - mini
  //   window.dispatchEvent(evt);// l7 - mini
  // }
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
  // const meta = document.querySelector('meta[name="viewport"]'); // l7 - mini
  // if (!meta) { // l7 - mini
  //   return 1; // l7 - mini
  // } // l7 - mini
  // const contentItems = (meta as any).content?.split(','); // l7 - mini
  // const scale = contentItems.find((item: string) => { // l7 - mini
  //   const [key, value] = item.split('='); // l7 - mini
  //   return key === 'initial-scale'; // l7 - mini
  // }); // l7 - mini
  // return scale ? scale.split('=')[1] * 1 : 1; // l7 - mini
  return 1;
}

// export const DPR = getViewPortScale() < 1 ? 1 : window.devicePixelRatio;
export const DPR = 1; // l7 - mini
