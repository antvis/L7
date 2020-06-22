// @ts-ignore
import Point from '../geo/point';

const DOM: {
  [key: string]: (...arg: any[]) => any;
} = {};
export default DOM;

DOM.create = (tagName: string, className?: string, container?: HTMLElement) => {
  const el = window.document.createElement(tagName);
  if (className !== undefined) {
    el.className = className;
  }
  if (container) {
    container.appendChild(el);
  }
  return el;
};

DOM.createNS = (namespaceURI: string, tagName: string) => {
  const el = window.document.createElementNS(namespaceURI, tagName);
  return el;
};

const docStyle = window.document && window.document.documentElement.style;

function testProp(props: any) {
  if (!docStyle) {
    return props[0];
  }
  for (const i of props) {
    if (i in docStyle) {
      return i;
    }
  }
  return props[0];
}

const selectProp = testProp([
  'userSelect',
  'MozUserSelect',
  'WebkitUserSelect',
  'msUserSelect',
]);
let userSelect: any;

DOM.disableDrag = () => {
  if (docStyle && selectProp) {
    userSelect = docStyle[selectProp];
    docStyle[selectProp] = 'none';
  }
};

DOM.enableDrag = () => {
  if (docStyle && selectProp) {
    docStyle[selectProp] = userSelect;
  }
};

const transformProp = testProp(['transform', 'WebkitTransform']);

DOM.setTransform = (el: HTMLElement, value: string) => {
  // https://github.com/facebook/flow/issues/7754
  // $FlowFixMe
  el.style[transformProp] = value;
};

// Feature detection for {passive: false} support in add/removeEventListener.
let passiveSupported = false;

try {
  // https://github.com/facebook/flow/issues/285
  // $FlowFixMe
  const options = Object.defineProperty({}, 'passive', {
    get() {
      // eslint-disable-line
      passiveSupported = true;
    },
  });
  window.addEventListener('test', options, options);
  window.removeEventListener('test', options, options);
} catch (err) {
  passiveSupported = false;
}

DOM.addEventListener = (
  target: any,
  type: any,
  callback: any,
  options: { passive?: boolean; capture?: boolean } = {},
) => {
  if ('passive' in options && passiveSupported) {
    target.addEventListener(type, callback, options);
  } else {
    target.addEventListener(type, callback, options.capture);
  }
};

DOM.removeEventListener = (
  target: any,
  type: any,
  callback: any,
  options: { passive?: boolean; capture?: boolean } = {},
) => {
  if ('passive' in options && passiveSupported) {
    target.removeEventListener(type, callback, options);
  } else {
    target.removeEventListener(type, callback, options.capture);
  }
};

// Suppress the next click, but only if it's immediate.
const suppressClick = (e: MouseEvent) => {
  e.preventDefault();
  e.stopPropagation();
  window.removeEventListener('click', suppressClick, true);
};

DOM.suppressClick = () => {
  window.addEventListener('click', suppressClick, true);
  window.setTimeout(() => {
    window.removeEventListener('click', suppressClick, true);
  }, 0);
};

DOM.mousePos = (el: HTMLElement, e: MouseEvent | Touch) => {
  const rect = el.getBoundingClientRect();
  return new Point(
    e.clientX - rect.left - el.clientLeft,
    e.clientY - rect.top - el.clientTop,
  );
};

DOM.touchPos = (el: HTMLElement, touches: Touch[]) => {
  const rect = el.getBoundingClientRect();
  const points = [];
  for (const touche of touches) {
    points.push(
      new Point(
        touche.clientX - rect.left - el.clientLeft,
        touche.clientY - rect.top - el.clientTop,
      ),
    );
  }
  return points;
};

DOM.mouseButton = (e: MouseEvent) => {
  if (
    // @ts-ignore
    typeof window.InstallTrigger !== 'undefined' &&
    e.button === 2 &&
    e.ctrlKey &&
    window.navigator.platform.toUpperCase().indexOf('MAC') >= 0
  ) {
    // Fix for https://github.com/mapbox/mapbox-gl-js/issues/3131:
    // Firefox (detected by InstallTrigger) on Mac determines e.button = 2 when
    // using Control + left click
    return 0;
  }
  return e.button;
};

DOM.remove = (node: HTMLElement) => {
  if (node.parentNode) {
    node.parentNode.removeChild(node);
  }
};
