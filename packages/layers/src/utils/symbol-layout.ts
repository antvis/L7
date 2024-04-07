interface IPoint {
  x: number;
  y: number;
}
export type anchorType =
  | 'right'
  | 'top-right'
  | 'left'
  | 'bottom-right'
  | 'left'
  | 'top-left'
  | 'bottom-left'
  | 'bottom'
  | 'bottom-right'
  | 'bottom-left'
  | 'top'
  | 'top-right'
  | 'top-left'
  | 'center';
export interface IGlyphQuad {
  tr: IPoint;
  tl: IPoint;
  bl: IPoint;
  br: IPoint;
  tex: {
    x: number;
    y: number;
    height: number;
    width: number;
    advance: number;
  };
  glyphOffset: [number, number];
}

/**
 * 返回文本相对锚点位置
 * @param {string} anchor 锚点位置
 * @return {alignment} alignment
 */
function getAnchorAlignment(anchor: anchorType) {
  let horizontalAlign = 0.5;
  let verticalAlign = 0.5;
  switch (anchor) {
    case 'right':
    case 'top-right':
    case 'bottom-right':
      horizontalAlign = 1;
      break;
    case 'left':
    case 'top-left':
    case 'bottom-left':
      horizontalAlign = 0;
      break;
    default:
      horizontalAlign = 0.5;
  }

  switch (anchor) {
    case 'bottom':
    case 'bottom-right':
    case 'bottom-left':
      verticalAlign = 1;
      break;
    case 'top':
    case 'top-right':
    case 'top-left':
      verticalAlign = 0;
      break;
    default:
      verticalAlign = 0.5;
  }

  return { horizontalAlign, verticalAlign };
}

// justify right = 1, left = 0, center = 0.5
function justifyLine(
  positionedGlyphs: any,
  glyphMap: any,
  start: number,
  end: number,
  justify: number,
) {
  if (!justify) {
    return;
  }

  const lastPositionedGlyph = positionedGlyphs[end];
  const glyph = lastPositionedGlyph.glyph;
  if (glyph) {
    const lastAdvance = glyphMap[glyph].advance * lastPositionedGlyph.scale;
    const lineIndent = (positionedGlyphs[end].x + lastAdvance) * justify;

    for (let j = start; j <= end; j++) {
      positionedGlyphs[j].x -= lineIndent;
    }
  }
}

// justify right=1 left=0 center=0.5
// horizontalAlign right=1 left=0 center=0.5
// verticalAlign right=1 left=0 center=0.5
function align(
  positionedGlyphs: any[],
  justify: number,
  horizontalAlign: number,
  verticalAlign: number,
  maxLineLength: number,
  lineHeight: number,
  lineCount: number,
) {
  const shiftX = (justify - horizontalAlign) * maxLineLength;
  const shiftY = (-verticalAlign * lineCount + 0.5) * lineHeight;

  for (const glyphs of positionedGlyphs) {
    glyphs.x += shiftX;
    glyphs.y += shiftY;
  }
}

function shapeLines(
  shaping: any,
  glyphMap: any,
  lines: any[],
  lineHeight: number,
  textAnchor: anchorType,
  textJustify: string,
  spacing: number,
) {
  // buffer 为 4
  const yOffset = -8;

  let x = 0;
  let y = yOffset;

  let maxLineLength = 0;
  const positionedGlyphs = shaping.positionedGlyphs;

  const justify = textJustify === 'right' ? 1 : textJustify === 'left' ? 0 : 0.5;

  const lineStartIndex = positionedGlyphs.length;
  lines.forEach((line) => {
    line.split('').forEach((char: string) => {
      const glyph = glyphMap[char];
      const baselineOffset = 0;

      if (glyph) {
        positionedGlyphs.push({
          glyph: char,
          x,
          y: y + baselineOffset,
          vertical: false, // TODO：目前只支持水平方向
          scale: 1,
          metrics: glyph,
        });
        x += glyph.advance + spacing;
      }
    });

    // 左右对齐
    if (positionedGlyphs.length !== lineStartIndex) {
      const lineLength = x - spacing;
      maxLineLength = Math.max(lineLength, maxLineLength);
      justifyLine(positionedGlyphs, glyphMap, lineStartIndex, positionedGlyphs.length - 1, justify);
    }

    x = 0;
    y -= lineHeight + 5;
  });

  const { horizontalAlign, verticalAlign } = getAnchorAlignment(textAnchor);
  align(
    positionedGlyphs,
    justify,
    horizontalAlign,
    verticalAlign,
    maxLineLength,
    lineHeight,
    lines.length,
  );

  // 计算包围盒
  const height = y - yOffset;

  shaping.top += -verticalAlign * height;
  shaping.bottom = shaping.top - height;
  shaping.left += -horizontalAlign * maxLineLength;
  shaping.right = shaping.left + maxLineLength;
}

function shapeIconFont(
  shaping: any,
  glyphMap: any,
  iconfonts: any[],
  lineHeight: number,
  textAnchor: anchorType,
  textJustify: string,
  spacing: number,
) {
  // buffer 为 4
  const yOffset = -8;

  let x = 0;
  let y = yOffset;

  let maxLineLength = 0;
  const positionedGlyphs = shaping.positionedGlyphs;

  const justify = textJustify === 'right' ? 1 : textJustify === 'left' ? 0 : 0.5;

  const lineStartIndex = positionedGlyphs.length;
  iconfonts.forEach((iconfont) => {
    const glyph = glyphMap[iconfont];
    const baselineOffset = 0;

    if (glyph) {
      positionedGlyphs.push({
        glyph: iconfont,
        // x,
        /**
         * iconfont
         * 在计算大小的时候计算的是 unicode 字符 如 &#xe6d4;
         * 在布局计算 icon 位置的时候应该始终保持居中（且 icon 只占一个字符的位置）
         */
        x: glyph.advance / 2,
        y: y + baselineOffset,
        vertical: false, // TODO：目前只支持水平方向
        scale: 1,
        metrics: glyph,
      });
      x += glyph.advance + spacing;
    }

    // 左右对齐
    if (positionedGlyphs.length !== lineStartIndex) {
      const lineLength = x - spacing;
      maxLineLength = Math.max(lineLength, maxLineLength);
      justifyLine(positionedGlyphs, glyphMap, lineStartIndex, positionedGlyphs.length - 1, justify);
    }

    x = 0;
    y -= lineHeight + 5;
  });

  const { horizontalAlign, verticalAlign } = getAnchorAlignment(textAnchor);
  align(
    positionedGlyphs,
    justify,
    horizontalAlign,
    verticalAlign,
    maxLineLength,
    lineHeight,
    iconfonts.length,
  );

  // 计算包围盒
  const height = y - yOffset;

  shaping.top += -verticalAlign * height;
  shaping.bottom = shaping.top - height;
  shaping.left += -horizontalAlign * maxLineLength;
  shaping.right = shaping.left + maxLineLength;
}

/**
 * 计算文本中每个独立字符相对锚点的位置
 *
 * @param {string} text 原始文本
 * @param {*} glyphs mapping
 * @param {number} lineHeight 行高
 * @param {string} textAnchor 文本相对于锚点的位置
 * @param {string} textJustify 左右对齐
 * @param {number} spacing 字符间距
 * @param {[number, number]} translate 文本水平 & 垂直偏移量
 * @param {[boolean]} isIconFont 是否是 iconfont
 * @return {boolean|shaping} 每个字符相对于锚点的位置
 */
export function shapeText(
  text: string,
  glyphs: any,
  lineHeight: number,
  textAnchor: anchorType,
  textJustify: string,
  spacing: number,
  translate: [number, number] = [0, 0],
  isIconFont: boolean,
) {
  // TODO：处理换行
  const lines = text.split('\n');

  const positionedGlyphs: any[] = [];
  const shaping = {
    positionedGlyphs,
    top: translate[1],
    bottom: translate[1],
    left: translate[0],
    right: translate[0],
    lineCount: lines.length,
    text,
  };
  isIconFont
    ? shapeIconFont(shaping, glyphs, lines, lineHeight, textAnchor, textJustify, spacing)
    : shapeLines(shaping, glyphs, lines, lineHeight, textAnchor, textJustify, spacing);
  if (!positionedGlyphs.length) {
    return false;
  }

  return shaping;
}

export function getGlyphQuads(
  shaping: any,
  textOffset: [number, number] = [0, 0],
  alongLine: boolean,
): IGlyphQuad[] {
  const { positionedGlyphs = [] } = shaping;
  const quads: IGlyphQuad[] = [];

  for (const positionedGlyph of positionedGlyphs) {
    const rect = positionedGlyph.metrics;

    // The rects have an addditional buffer that is not included in their size.
    const rectBuffer = 4;

    const halfAdvance = (rect.advance * positionedGlyph.scale) / 2;

    const glyphOffset: [number, number] = alongLine
      ? [positionedGlyph.x + halfAdvance, positionedGlyph.y]
      : [0, 0];

    const builtInOffset = alongLine
      ? [0, 0]
      : [positionedGlyph.x + halfAdvance + textOffset[0], positionedGlyph.y + textOffset[1]];

    const x1 = (0 - rectBuffer) * positionedGlyph.scale - halfAdvance + builtInOffset[0];
    const y1 = (0 - rectBuffer) * positionedGlyph.scale + builtInOffset[1];
    const x2 = x1 + rect.width * positionedGlyph.scale;
    const y2 = y1 + rect.height * positionedGlyph.scale;

    const tl = { x: x1, y: y1 };
    const tr = { x: x2, y: y1 };
    const bl = { x: x1, y: y2 };
    const br = { x: x2, y: y2 };

    // TODO：处理字符旋转的情况

    quads.push({ tl, tr, bl, br, tex: rect, glyphOffset });
  }

  return quads;
}
