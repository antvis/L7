/**
 * 颜色解析工具
 * 用于替代 d3-color 的颜色解析功能
 */

export interface ParsedColor {
  r: number;
  g: number;
  b: number;
  opacity: number;
}

// CSS 颜色名称映射表
const CSS_COLORS: Record<string, [number, number, number]> = {
  // 基础颜色
  white: [255, 255, 255],
  black: [0, 0, 0],
  red: [255, 0, 0],
  green: [0, 128, 0],
  blue: [0, 0, 255],
  yellow: [255, 255, 0],
  cyan: [0, 255, 255],
  magenta: [255, 0, 255],
  gray: [128, 128, 128],
  grey: [128, 128, 128],
  silver: [192, 192, 192],
  maroon: [128, 0, 0],
  olive: [128, 128, 0],
  lime: [0, 255, 0],
  aqua: [0, 255, 255],
  teal: [0, 128, 128],
  navy: [0, 0, 128],
  fuchsia: [255, 0, 255],
  purple: [128, 0, 128],
  orange: [255, 165, 0],
  pink: [255, 192, 203],
  // 扩展颜色
  aliceblue: [240, 248, 255],
  antiquewhite: [250, 235, 215],
  aquamarine: [127, 255, 212],
  azure: [240, 255, 255],
  beige: [245, 245, 220],
  bisque: [255, 228, 196],
  blanchedalmond: [255, 235, 205],
  blueviolet: [138, 43, 226],
  brown: [165, 42, 42],
  burlywood: [222, 184, 135],
  cadetblue: [95, 158, 160],
  chartreuse: [127, 255, 0],
  chocolate: [210, 105, 30],
  coral: [255, 127, 80],
  cornflowerblue: [100, 149, 237],
  cornsilk: [255, 248, 220],
  crimson: [220, 20, 60],
  darkblue: [0, 0, 139],
  darkcyan: [0, 139, 139],
  darkgoldenrod: [184, 134, 11],
  darkgray: [169, 169, 169],
  darkgreen: [0, 100, 0],
  darkgrey: [169, 169, 169],
  darkkhaki: [189, 183, 107],
  darkmagenta: [139, 0, 139],
  darkolivegreen: [85, 107, 47],
  darkorange: [255, 140, 0],
  darkorchid: [153, 50, 204],
  darkred: [139, 0, 0],
  darksalmon: [233, 150, 122],
  darkseagreen: [143, 188, 143],
  darkslateblue: [72, 61, 139],
  darkslategray: [47, 79, 79],
  darkslategrey: [47, 79, 79],
  darkturquoise: [0, 206, 209],
  darkviolet: [148, 0, 211],
  deeppink: [255, 20, 147],
  deepskyblue: [0, 191, 255],
  dimgray: [105, 105, 105],
  dimgrey: [105, 105, 105],
  dodgerblue: [30, 144, 255],
  firebrick: [178, 34, 34],
  floralwhite: [255, 250, 240],
  forestgreen: [34, 139, 34],
  gainsboro: [220, 220, 220],
  ghostwhite: [248, 248, 255],
  gold: [255, 215, 0],
  goldenrod: [218, 165, 32],
  greenyellow: [173, 255, 47],
  honeydew: [240, 255, 240],
  hotpink: [255, 105, 180],
  indianred: [205, 92, 92],
  indigo: [75, 0, 130],
  ivory: [255, 255, 240],
  khaki: [240, 230, 140],
  lavender: [230, 230, 250],
  lavenderblush: [255, 240, 245],
  lawngreen: [124, 252, 0],
  lemonchiffon: [255, 250, 205],
  lightblue: [173, 216, 230],
  lightcoral: [240, 128, 128],
  lightcyan: [224, 255, 255],
  lightgoldenrodyellow: [250, 250, 210],
  lightgray: [211, 211, 211],
  lightgreen: [144, 238, 144],
  lightgrey: [211, 211, 211],
  lightpink: [255, 182, 193],
  lightsalmon: [255, 160, 122],
  lightseagreen: [32, 178, 170],
  lightskyblue: [135, 206, 250],
  lightslategray: [119, 136, 153],
  lightslategrey: [119, 136, 153],
  lightsteelblue: [176, 196, 222],
  lightyellow: [255, 255, 224],
  limegreen: [50, 205, 50],
  linen: [250, 240, 230],
  mediumaquamarine: [102, 205, 170],
  mediumblue: [0, 0, 205],
  mediumorchid: [186, 85, 211],
  mediumpurple: [147, 112, 219],
  mediumseagreen: [60, 179, 113],
  mediumslateblue: [123, 104, 238],
  mediumspringgreen: [0, 250, 154],
  mediumturquoise: [72, 209, 204],
  mediumvioletred: [199, 21, 133],
  midnightblue: [25, 25, 112],
  mintcream: [245, 255, 250],
  mistyrose: [255, 228, 225],
  moccasin: [255, 228, 181],
  navajowhite: [255, 222, 173],
  oldlace: [253, 245, 230],
  olivedrab: [107, 142, 35],
  orangered: [255, 69, 0],
  orchid: [218, 112, 214],
  palegoldenrod: [238, 232, 170],
  palegreen: [152, 251, 152],
  paleturquoise: [175, 238, 238],
  palevioletred: [219, 112, 147],
  papayawhip: [255, 239, 213],
  peachpuff: [255, 218, 185],
  peru: [205, 133, 63],
  plum: [221, 160, 221],
  powderblue: [176, 224, 230],
  rosybrown: [188, 143, 143],
  royalblue: [65, 105, 225],
  saddlebrown: [139, 69, 19],
  salmon: [250, 128, 114],
  sandybrown: [244, 164, 96],
  seagreen: [46, 139, 87],
  seashell: [255, 245, 238],
  sienna: [160, 82, 45],
  skyblue: [135, 206, 235],
  slateblue: [106, 90, 205],
  slategray: [112, 128, 144],
  slategrey: [112, 128, 144],
  snow: [255, 250, 250],
  springgreen: [0, 255, 127],
  steelblue: [70, 130, 180],
  tan: [210, 180, 140],
  thistle: [216, 191, 216],
  tomato: [255, 99, 71],
  transparent: [0, 0, 0],
  turquoise: [64, 224, 208],
  violet: [238, 130, 238],
  wheat: [245, 222, 179],
  whitesmoke: [245, 245, 245],
  yellowgreen: [154, 205, 50],
};

/**
 * 解析十六进制颜色
 */
function parseHex(hex: string): ParsedColor | null {
  let r = 0,
    g = 0,
    b = 0,
    opacity = 1;

  if (hex.length === 4) {
    // #RGB
    r = parseInt(hex[1] + hex[1], 16);
    g = parseInt(hex[2] + hex[2], 16);
    b = parseInt(hex[3] + hex[3], 16);
  } else if (hex.length === 5) {
    // #RGBA
    r = parseInt(hex[1] + hex[1], 16);
    g = parseInt(hex[2] + hex[2], 16);
    b = parseInt(hex[3] + hex[3], 16);
    opacity = parseInt(hex[4] + hex[4], 16) / 255;
  } else if (hex.length === 7) {
    // #RRGGBB
    r = parseInt(hex.slice(1, 3), 16);
    g = parseInt(hex.slice(3, 5), 16);
    b = parseInt(hex.slice(5, 7), 16);
  } else if (hex.length === 9) {
    // #RRGGBBAA
    r = parseInt(hex.slice(1, 3), 16);
    g = parseInt(hex.slice(3, 5), 16);
    b = parseInt(hex.slice(5, 7), 16);
    opacity = parseInt(hex.slice(7, 9), 16) / 255;
  } else {
    return null;
  }

  if (isNaN(r) || isNaN(g) || isNaN(b)) {
    return null;
  }

  return { r, g, b, opacity };
}

/**
 * 解析 RGB/RGBA 颜色字符串
 */
function parseRgb(colorStr: string): ParsedColor | null {
  const rgbaMatch = colorStr.match(
    /rgba?\s*\(\s*(\d+(?:\.\d+)?%?)\s*[,\s]\s*(\d+(?:\.\d+)?%?)\s*[,\s]\s*(\d+(?:\.\d+)?%?)\s*(?:[,/]\s*(\d*\.?\d+%?))?\s*\)/i,
  );

  if (!rgbaMatch) {
    return null;
  }

  const r = parseColorValue(rgbaMatch[1]);
  const g = parseColorValue(rgbaMatch[2]);
  const b = parseColorValue(rgbaMatch[3]);
  let opacity = 1;

  if (rgbaMatch[4] !== undefined) {
    opacity = parseAlphaValue(rgbaMatch[4]);
  }

  if (r === null || g === null || b === null) {
    return null;
  }

  return { r, g, b, opacity };
}

/**
 * 解析 HSL/HSLA 颜色字符串
 */
function parseHsl(colorStr: string): ParsedColor | null {
  const hslaMatch = colorStr.match(
    /hsla?\s*\(\s*(\d+(?:\.\d+)?)\s*[,\s]\s*(\d+(?:\.\d+)?)%\s*[,\s]\s*(\d+(?:\.\d+)?)%\s*(?:[,/]\s*(\d*\.?\d+%?))?\s*\)/i,
  );

  if (!hslaMatch) {
    return null;
  }

  const h = parseFloat(hslaMatch[1]);
  const s = parseFloat(hslaMatch[2]) / 100;
  const l = parseFloat(hslaMatch[3]) / 100;
  let opacity = 1;

  if (hslaMatch[4] !== undefined) {
    opacity = parseAlphaValue(hslaMatch[4]);
  }

  // HSL to RGB 转换
  const { r, g, b } = hslToRgb(h, s, l);

  return { r, g, b, opacity };
}

/**
 * 解析颜色值（支持百分比和数值）
 */
function parseColorValue(value: string): number | null {
  if (value.endsWith('%')) {
    const percent = parseFloat(value);
    if (isNaN(percent)) return null;
    return Math.round((percent / 100) * 255);
  }
  const num = parseFloat(value);
  if (isNaN(num)) return null;
  return Math.min(255, Math.max(0, Math.round(num)));
}

/**
 * 解析透明度值
 */
function parseAlphaValue(value: string): number {
  if (value.endsWith('%')) {
    return parseFloat(value) / 100;
  }
  return parseFloat(value);
}

/**
 * HSL 转 RGB
 */
function hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
  h = ((h % 360) + 360) % 360;

  if (s === 0) {
    return { r: Math.round(l * 255), g: Math.round(l * 255), b: Math.round(l * 255) };
  }

  const hue2rgb = (p: number, q: number, t: number): number => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };

  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;

  return {
    r: Math.round(hue2rgb(p, q, h / 360 + 1 / 3) * 255),
    g: Math.round(hue2rgb(p, q, h / 360) * 255),
    b: Math.round(hue2rgb(p, q, h / 360 - 1 / 3) * 255),
  };
}

/**
 * 解析颜色字符串为 RGB 对象
 * 支持格式:
 * - 十六进制: #ff0000, #f00, #ff000080, #f08
 * - RGB: rgb(255, 0, 0), rgb(100%, 0%, 0%)
 * - RGBA: rgba(255, 0, 0, 0.5), rgba(100%, 0%, 0%, 50%)
 * - HSL: hsl(0, 100%, 50%)
 * - HSLA: hsla(0, 100%, 50%, 0.5)
 * - 颜色名称: red, blue, green 等
 */
export function parseColor(colorStr: string): ParsedColor | null {
  if (!colorStr || typeof colorStr !== 'string') {
    return null;
  }

  const trimmed = colorStr.trim().toLowerCase();

  // 十六进制
  if (trimmed.startsWith('#')) {
    return parseHex(trimmed);
  }

  // RGB/RGBA
  if (trimmed.startsWith('rgb')) {
    return parseRgb(trimmed);
  }

  // HSL/HSLA
  if (trimmed.startsWith('hsl')) {
    return parseHsl(trimmed);
  }

  // CSS 颜色名称
  if (CSS_COLORS[trimmed]) {
    const [r, g, b] = CSS_COLORS[trimmed];
    return { r, g, b, opacity: trimmed === 'transparent' ? 0 : 1 };
  }

  return null;
}
