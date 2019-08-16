"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _index = _interopRequireDefault(require("../util/index"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var regexTags = /[MLHVQTCSAZ]([^MLHVQTCSAZ]*)/ig;
var regexDot = /[^\s\,]+/ig;
var regexLG = /^l\s*\(\s*([\d.]+)\s*\)\s*(.*)/i;
var regexRG = /^r\s*\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*\)\s*(.*)/i;
var regexPR = /^p\s*\(\s*([axyn])\s*\)\s*(.*)/i;
var regexColorStop = /[\d.]+:(#[^\s]+|[^\)]+\))/ig;
var numColorCache = {};

function addStop(steps, gradient) {
  var arr = steps.match(regexColorStop);

  _index.default.each(arr, function (item) {
    item = item.split(':');
    gradient.addColorStop(item[0], item[1]);
  });
}

function parseLineGradient(color, self) {
  var arr = regexLG.exec(color);

  var angle = _index.default.mod(_index.default.toRadian(parseFloat(arr[1])), Math.PI * 2);

  var steps = arr[2];
  var box = self.getBBox();
  var start;
  var end;

  if (angle >= 0 && angle < 0.5 * Math.PI) {
    start = {
      x: box.minX,
      y: box.minY
    };
    end = {
      x: box.maxX,
      y: box.maxY
    };
  } else if (0.5 * Math.PI <= angle && angle < Math.PI) {
    start = {
      x: box.maxX,
      y: box.minY
    };
    end = {
      x: box.minX,
      y: box.maxY
    };
  } else if (Math.PI <= angle && angle < 1.5 * Math.PI) {
    start = {
      x: box.maxX,
      y: box.maxY
    };
    end = {
      x: box.minX,
      y: box.minY
    };
  } else {
    start = {
      x: box.minX,
      y: box.maxY
    };
    end = {
      x: box.maxX,
      y: box.minY
    };
  }

  var tanTheta = Math.tan(angle);
  var tanTheta2 = tanTheta * tanTheta;
  var x = (end.x - start.x + tanTheta * (end.y - start.y)) / (tanTheta2 + 1) + start.x;
  var y = tanTheta * (end.x - start.x + tanTheta * (end.y - start.y)) / (tanTheta2 + 1) + start.y;
  var context = self.get('context');
  var gradient = context.createLinearGradient(start.x, start.y, x, y);
  addStop(steps, gradient);
  return gradient;
}

function parseRadialGradient(color, self) {
  var arr = regexRG.exec(color);
  var fx = parseFloat(arr[1]);
  var fy = parseFloat(arr[2]);
  var fr = parseFloat(arr[3]);
  var steps = arr[4];
  var box = self.getBBox();
  var context = self.get('context');
  var width = box.maxX - box.minX;
  var height = box.maxY - box.minY;
  var r = Math.sqrt(width * width + height * height) / 2;
  var gradient = context.createRadialGradient(box.minX + width * fx, box.minY + height * fy, fr * r, box.minX + width / 2, box.minY + height / 2, r);
  addStop(steps, gradient);
  return gradient;
}

function parsePattern(color, self) {
  if (self.get('patternSource') && self.get('patternSource') === color) {
    return self.get('pattern');
  }

  var pattern;
  var img;
  var arr = regexPR.exec(color);
  var repeat = arr[1];
  var source = arr[2]; // Function to be called when pattern loads

  function onload() {
    // Create pattern
    var context = self.get('context');
    pattern = context.createPattern(img, repeat);
    self.setSilent('pattern', pattern); // be a cache

    self.setSilent('patternSource', color);
  }

  switch (repeat) {
    case 'a':
      repeat = 'repeat';
      break;

    case 'x':
      repeat = 'repeat-x';
      break;

    case 'y':
      repeat = 'repeat-y';
      break;

    case 'n':
      repeat = 'no-repeat';
      break;

    default:
      repeat = 'no-repeat';
  }

  img = new Image(); // If source URL is not a data URL

  if (!source.match(/^data:/i)) {
    // Set crossOrigin for this image
    img.crossOrigin = 'Anonymous';
  }

  img.src = source;

  if (img.complete) {
    onload();
  } else {
    img.onload = onload; // Fix onload() bug in IE9
    // eslint-disable-next-line

    img.src = img.src;
  }

  return pattern;
}

var _default = {
  parsePath: function parsePath(path) {
    path = path || [];

    if (_index.default.isArray(path)) {
      return path;
    }

    if (_index.default.isString(path)) {
      path = path.match(regexTags);

      _index.default.each(path, function (item, index) {
        item = item.match(regexDot);

        if (item[0].length > 1) {
          var tag = item[0].charAt(0);
          item.splice(1, 0, item[0].substr(1));
          item[0] = tag;
        }

        _index.default.each(item, function (sub, i) {
          if (!isNaN(sub)) {
            item[i] = +sub;
          }
        });

        path[index] = item;
      });

      return path;
    }
  },
  parseStyle: function parseStyle(color, self) {
    if (_index.default.isString(color)) {
      if (color[1] === '(' || color[2] === '(') {
        if (color[0] === 'l') {
          // regexLG.test(color)
          return parseLineGradient(color, self);
        } else if (color[0] === 'r') {
          // regexRG.test(color)
          return parseRadialGradient(color, self);
        } else if (color[0] === 'p') {
          // regexPR.test(color)
          return parsePattern(color, self);
        }
      }

      return color;
    }
  },
  numberToColor: function numberToColor(num) {
    // 增加缓存
    var color = numColorCache[num];

    if (!color) {
      var str = num.toString(16);

      for (var i = str.length; i < 6; i++) {
        str = '0' + str;
      }

      color = '#' + str;
      numColorCache[num] = color;
    }

    return color;
  }
};
exports.default = _default;