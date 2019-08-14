/**
 * 返回文本相对锚点位置
 * @param {string} anchor 锚点位置
 * @return {alignment} alignment
 */
function getAnchorAlignment(anchor) {
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
  positionedGlyphs,
  glyphMap,
  start,
  end,
  justify) {
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
  positionedGlyphs,
  justify,
  horizontalAlign,
  verticalAlign,
  maxLineLength,
  lineHeight,
  lineCount
) {
  const shiftX = (justify - horizontalAlign) * maxLineLength;
  const shiftY = (-verticalAlign * lineCount + 0.5) * lineHeight;

  for (let j = 0; j < positionedGlyphs.length; j++) {
    positionedGlyphs[j].x += shiftX;
    positionedGlyphs[j].y += shiftY;
  }
}

function shapeLines(
  shaping,
  glyphMap,
  lines,
  lineHeight,
  textAnchor,
  textJustify,
  spacing
) {
  // buffer 为 4
  const yOffset = -8;

  let x = 0;
  let y = yOffset;

  let maxLineLength = 0;
  const positionedGlyphs = shaping.positionedGlyphs;

  const justify =
    textJustify === 'right' ? 1 :
      textJustify === 'left' ? 0 : 0.5;

  const lineStartIndex = positionedGlyphs.length;
  lines.forEach(line => {
    line.split('').forEach(char => {
      const glyph = glyphMap[char];
      const baselineOffset = 0;

      if (glyph) {
        positionedGlyphs.push({
          glyph: char,
          x,
          y: y + baselineOffset,
          vertical: false, // TODO：目前只支持水平方向
          scale: 1,
          metrics: glyph
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
    y += lineHeight;
  });

  const { horizontalAlign, verticalAlign } = getAnchorAlignment(textAnchor);
  align(positionedGlyphs, justify, horizontalAlign, verticalAlign, maxLineLength, lineHeight, lines.length);

  // 计算包围盒
  const height = y - yOffset;

  shaping.top += -verticalAlign * height;
  shaping.bottom = shaping.top + height;
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
 * @return {boolean|shaping} 每个字符相对于锚点的位置
 */
export function shapeText(
  text,
  glyphs,
  lineHeight,
  textAnchor,
  textJustify,
  spacing,
  translate
) {

  // TODO：处理换行
  const lines = text.split('\n');

  const positionedGlyphs = [];
  const shaping = {
    positionedGlyphs,
    top: translate[1],
    bottom: translate[1],
    left: translate[0],
    right: translate[0],
    lineCount: lines.length,
    text
  };

  shapeLines(shaping, glyphs, lines, lineHeight, textAnchor, textJustify, spacing);
  if (!positionedGlyphs.length) return false;

  return shaping;
}

export function getGlyphQuads(
  shaping,
  textOffset,
  alongLine
) {
  const { positionedGlyphs } = shaping;
  const quads = [];

  for (let k = 0; k < positionedGlyphs.length; k++) {
    const positionedGlyph = positionedGlyphs[k];
    const rect = positionedGlyph.metrics;

    // The rects have an addditional buffer that is not included in their size.
    const rectBuffer = 4;

    const halfAdvance = rect.advance * positionedGlyph.scale / 2;

    const glyphOffset = alongLine ?
      [ positionedGlyph.x + halfAdvance, positionedGlyph.y ] :
      [ 0, 0 ];

    const builtInOffset = alongLine ?
      [ 0, 0 ] :
      [ positionedGlyph.x + halfAdvance + textOffset[0], positionedGlyph.y + textOffset[1] ];

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
