// @ts-ignore
import Point from '../geo/point';

const DOM: {
  [key: string]: (...arg: any[]) => any;
} = {};
export default DOM;

DOM.create = (tagName: string, className?: string, container?: HTMLElement) => {
  // const el = window.document.createElement(tagName); // l7 - mini
  // if (className !== undefined) {// l7 - mini
  //   el.className = className;// l7 - mini
  // }// l7 - mini
  // if (container) {// l7 - mini
  //   container.appendChild(el);// l7 - mini
  // }// l7 - mini
  // return el;// l7 - mini
  return null;
};

DOM.createNS = (namespaceURI: string, tagName: string) => {
  // const el = window.document.createElementNS(namespaceURI, tagName);// l7 - mini
  // return el;// l7 - mini
  return null;
};

// const docStyle = window.document && window.document.documentElement.style;// l7 - mini

function testProp(props: any) {
  // if (!docStyle) {// l7 - mini
  //   return props[0];// l7 - mini
  // }// l7 - mini
  // for (const i of props) {// l7 - mini
  //   if (i in docStyle) {// l7 - mini
  //     return i;// l7 - mini
  //   }// l7 - mini
  // }// l7 - mini
  return props[0];
}

const selectProp = testProp([
  'userSelect',
  'MozUserSelect',
  'WebkitUserSelect',
  'msUserSelect',
]);
// let userSelect: any;// l7 - mini

DOM.disableDrag = () => {
  // if (docStyle && selectProp) {// l7 - mini
  //   userSelect = docStyle[selectProp];// l7 - mini
  //   docStyle[selectProp] = 'none';// l7 - mini
  // }
};

DOM.enableDrag = () => {
  // if (docStyle && selectProp) {// l7 - mini
  //   docStyle[selectProp] = userSelect;// l7 - mini
  // }// l7 - mini
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
  // window.addEventListener('test', options, options);// l7 - mini
  // window.removeEventListener('test', options, options);// l7 - mini
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
  // window.removeEventListener('click', suppressClick, true);// l7 - mini
};

DOM.suppressClick = () => {
  // window.addEventListener('click', suppressClick, true);// l7 - mini
  // window.setTimeout(() => {// l7 - mini
  //   window.removeEventListener('click', suppressClick, true);// l7 - mini
  // }, 0);// l7 - mini
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
  // if (// l7 - mini
  //   // @ts-ignore// l7 - mini
  //   typeof window.InstallTrigger !== 'undefined' &&// l7 - mini
  //   e.button === 2 &&// l7 - mini
  //   e.ctrlKey &&// l7 - mini
  //   window.navigator.platform.toUpperCase().indexOf('MAC') >= 0// l7 - mini
  // ) {// l7 - mini
  //   // Fix for https://github.com/mapbox/mapbox-gl-js/issues/3131:// l7 - mini
  //   // Firefox (detected by InstallTrigger) on Mac determines e.button = 2 when// l7 - mini
  //   // using Control + left click// l7 - mini
  //   return 0;// l7 - mini
  // }// l7 - mini
  // return e.button;// l7 - mini
};

DOM.remove = (node: HTMLElement) => {
  if (node.parentNode) {
    node.parentNode.removeChild(node);
  }
};
