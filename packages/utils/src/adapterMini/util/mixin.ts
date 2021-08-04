// import screen from "../screen";

// const { availWidth: innerWidth, availHeight: innerHeight } = screen;
import document from '../document';

// @ts-ignore
export function parentNode(obj, level?: number) {
  if (!('parentNode' in obj)) {
    let parent;

    if (level === 0) {
      parent = () => {
        // return document
        return null;
      };
    } else if (level === 1) {
      parent = () => {
        return document.documentElement;
      };
    } else {
      parent = () => {
        return document.body;
      };
    }

    Object.defineProperty(obj, 'parentNode', {
      enumerable: true,
      get: parent,
    });
  }

  if (!('parentElement' in obj)) {
    let parent;

    if (level === 0) {
      parent = () => {
        return null;
      };
    } else if (level === 1) {
      parent = () => {
        return document.documentElement;
      };
    } else {
      parent = () => {
        return document.body;
      };
    }

    Object.defineProperty(obj, 'parentElement', {
      enumerable: true,
      get: parent,
    });
  }
}

// @ts-ignore
export function style(obj) {
  obj.style = obj.style || {};

  Object.assign(obj.style, {
    top: '0px',
    left: '0px',
    // width: innerWidth + "px",
    // height: innerHeight + "px",
    margin: '0px',
    padding: '0px',
  });
}

// @ts-ignore
export function clientRegion(obj) {
  if (!('clientLeft' in obj)) {
    obj.clientLeft = 0;
    obj.clientTop = 0;
  }
  if (!('clientWidth' in obj)) {
    // obj.clientWidth = innerWidth;
    // obj.clientHeight = innerHeight;
  }

  if (!('getBoundingClientRect' in obj)) {
    obj.getBoundingClientRect = function() {
      const ret = {
        x: 0,
        y: 0,
        top: 0,
        left: 0,
        width: this.clientWidth,
        height: this.clientHeight,
        right: this.clientWidth,
        bottom: this.clientHeight,
      };

      return ret;
    };
  }
}

// @ts-ignore
export function offsetRegion(obj) {
  if (!('offsetLeft' in obj)) {
    obj.offsetLeft = 0;
    obj.offsetTop = 0;
  }
  if (!('offsetWidth' in obj)) {
    // obj.offsetWidth = innerWidth;
    // obj.offsetHeight = innerHeight;
  }
}

// @ts-ignore
export function scrollRegion(obj) {
  if (!('scrollLeft' in obj)) {
    obj.scrollLeft = 0;
    obj.scrollTop = 0;
  }
  if (!('scrollWidth' in obj)) {
    // obj.scrollWidth = innerWidth;
    // obj.scrollHeight = innerHeight;
  }
}

// @ts-ignore
export function classList(obj) {
  const noop = () => {
    return '';
  };
  obj.classList = [];
  obj.classList.add = noop;
  obj.classList.remove = noop;
  obj.classList.contains = noop;
  obj.classList.toggle = noop;
}
