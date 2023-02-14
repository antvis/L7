import { screen } from '../screen';

const { availWidth: innerWidth, availHeight: innerHeight } = screen;
const documentElement = {
  style: [],
};

export function parentNode(obj: any, level?: number) {
  if (!('parentNode' in obj)) {
    let parent;

    if (level === 0) {
      parent = () => {
        // return document
        return null;
      };
    } else if (level === 1) {
      parent = () => {
        // return document.documentElement;
        return documentElement;
      };
    } else {
      parent = () => {
        // return document.body;
        return null;
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
        // return document.documentElement;
        return documentElement;
      };
    } else {
      parent = () => {
        // return document.body;
        return null;
      };
    }

    Object.defineProperty(obj, 'parentElement', {
      enumerable: true,
      get: parent,
    });
  }
}

export function style(obj: any) {
  obj.style = obj.style || {};

  Object.assign(obj.style, {
    top: '0px',
    left: '0px',
    width: innerWidth + 'px',
    height: innerHeight + 'px',
    margin: '0px',
    padding: '0px',
  });
}

export function clientRegion(obj: any) {
  if (!('clientLeft' in obj)) {
    obj.clientLeft = 0;
    obj.clientTop = 0;
  }
  if (!('clientWidth' in obj)) {
    obj.clientWidth = innerWidth;
    obj.clientHeight = innerHeight;
  }

  if (!('getBoundingClientRect' in obj)) {
    obj.getBoundingClientRect = function () {
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

export function offsetRegion(obj: any) {
  if (!('offsetLeft' in obj)) {
    obj.offsetLeft = 0;
    obj.offsetTop = 0;
  }
  if (!('offsetWidth' in obj)) {
    obj.offsetWidth = innerWidth;
    obj.offsetHeight = innerHeight;
  }
}

export function scrollRegion(obj: any) {
  if (!('scrollLeft' in obj)) {
    obj.scrollLeft = 0;
    obj.scrollTop = 0;
  }
  if (!('scrollWidth' in obj)) {
    obj.scrollWidth = innerWidth;
    obj.scrollHeight = innerHeight;
  }
}

export function classList(obj: any) {
  const noop = () => true;
  obj.classList = [];
  obj.classList.add = noop;
  obj.classList.remove = noop;
  obj.classList.contains = noop;
  obj.classList.toggle = noop;
}
