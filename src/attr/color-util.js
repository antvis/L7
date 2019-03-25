/**
 * @fileOverview 颜色计算的辅助方法
 * @author dxq613@gmail.com
 */
import Util from '../util';
const RGB_REG = /rgba?\(([\s.,0-9]+)\)/;
// const RGBA_REG = /rgba\((\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(\d+)\s*\)/;

// 创建辅助 tag 取颜色
function createTmp() {
  const i = document.createElement('i');
  i.title = 'Web Colour Picker';
  i.style.display = 'none';
  document.body.appendChild(i);
  return i;
}

// 获取颜色之间的插值
function getValue(start, end, percent, index) {
  const value = start[index] + (end[index] - start[index]) * percent;
  return value;
}

function calColor(colors, percent) {
  if (Util.isNaN(percent) || !Util.isNumber(percent)) {
    percent = 0;
  }
  const steps = colors.length - 1;
  const step = Math.floor(steps * percent);
  const left = steps * percent - step;
  const start = colors[step];
  const end = step === steps ? start : colors[step + 1];
  return [ getValue(start, end, left, 0), getValue(start, end, left, 1), getValue(start, end, left, 2), getValue(start, end, left, 3) ];
}

// rgb 颜色转换成数组
function rgb2arr(str) {
  const arr = [];
  arr.push(parseInt(str.substr(1, 2), 16));
  arr.push(parseInt(str.substr(3, 2), 16));
  arr.push(parseInt(str.substr(5, 2), 16));
  return arr;
}
const colorCache = {};
let iEl = null;
const ColorUtil = {
  /**
   * 将颜色转换到 rgb 的格式
   * @param  {String} color 颜色
   * @return {String} 将颜色转换到 '#ffffff' 的格式
   */
  toRGB(color) {
    // 如果已经是 rgb的格式
    if (color[0] === '#' && color.length === 7) {
      const colorArray = rgb2arr(color);
      colorArray.push(255.0);
      return colorArray;
    }
    if (!iEl) { // 防止防止在页头报错
      iEl = createTmp();
    }
    let rst;
    if (colorCache[color]) {
      rst = colorCache[color];
    } else {
      iEl.style.color = color;
      rst = document.defaultView.getComputedStyle(iEl, '').getPropertyValue('color');
      const matchs = RGB_REG.exec(rst);
      const cArray = matchs[1].split(/\s*,\s*/);
      if (cArray.length === 4) {
        cArray[3] *= 255;
      }
      if (cArray.length === 3) {
        cArray.push(255.0);
      }

      colorCache[color] = cArray;
      rst = cArray;
    }
    return rst;
  },
  // 转成 WebGl color buffer
  color2Arr(str) {
    const rgba = this.toRGB(str);
    return rgba.map(v => v / 255);
  },
  colorArray2RGBA(arr) {
    return `rgba(${arr[0] * 255},${arr[1] * 255},${arr[2] * 255},${arr[3]})`;
  },
  color2RGBA(str) {
    return this.color2Arr(str);
  },
  rgb2arr,

  /**
   * 获取渐变函数
   * @param  {Array} colors 多个颜色
   * @return {String} 颜色值
   */
  gradient(colors) {
    const points = [];
    if (Util.isString(colors)) {
      colors = colors.split('-');
    }
    Util.each(colors, function(color) {
      const colorArray = ColorUtil.toRGB(color).map(e => (e / 255));
      // colorArray[3] = colorArray[3] * 255;
      points.push(colorArray);
    });

    return function(percent) {
      return calColor(points, percent);
    };
  }
};

export default ColorUtil;
