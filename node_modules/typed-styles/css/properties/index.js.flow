/* @flow */

/* eslint-disable no-use-before-define */

type percentage = string
type length = number | percentage
type time = string

export type alignContent =
  | 'initial'
  | 'inherit'
  | 'stretch'
  | 'center'
  | 'flex-start'
  | 'flex-end'
  | 'space-between'
  | 'space-around'
  | 'initial'
  | 'inherit'

export type alignItems =
  | 'initial'
  | 'inherit'
  | 'stretch'
  | 'center'
  | 'flex-start'
  | 'flex-end'
  | 'baseline'
  | 'initial'
  | 'inherit'

export type alignmentBaseline =
  | 'baseline'
  | 'use-script'
  | 'before-edge'
  | 'text-before-edge'
  | 'after-edge'
  | 'text-after-edge'
  | 'central'
  | 'middle'
  | 'ideographic'
  | 'alphabetic'
  | 'hanging'
  | 'mathematical'

export type alignSelf =
  | 'initial'
  | 'inherit'
  | 'auto'
  | 'stretch'
  | 'center'
  | 'flex-start'
  | 'flex-end'
  | 'baseline'
  | 'initial'
  | 'inherit'

export type all = 'initial' | 'inherit' | 'unset'

export type animationDelay = time | 'initial' | 'inherit'

export type animationDirection =
  | 'initial'
  | 'inherit'
  | 'normal'
  | 'reverse'
  | 'alternate'
  | 'alternate-reverse'
  | 'initial'
  | 'inherit'

export type animationDuration = time | 'initial' | 'inherit'

export type animationFillMode = 'none' | 'forwards' | 'backwards' | 'both' | 'initial' | 'inherit'

export type animationIterationCount = number | 'infinite' | 'initial' | 'inherit'

export type animationName = string | 'none' | 'initial' | 'inherit'

export type animationPlayState = 'paused' | 'running' | 'initial' | 'inherit'

// steps(int,start|end) | cubic-bezier(n,n,n,n)
type animationTimingFunctionValue = string

export type animationTimingFunction =
  | 'linear'
  | 'ease'
  | 'ease-in'
  | 'ease-out'
  | 'ease-in-out'
  | 'step-start'
  | 'step-end'
  | animationTimingFunctionValue
  | 'initial'
  | 'inherit'

export type animation =
  | [
    animationName,
    ?animationDuration,
    ?animationTimingFunction,
    ?animationDelay,
    ?animationIterationCount,
    ?animationDirection,
    ?animationFillMode,
    ?animationPlayState,
  ]
  | 'initial'
  | 'inherit'

export type backfaceVisibility = 'visible' | 'hidden' | 'initial' | 'inherit'

export type background =
  | [
    backgroundColor,
    ?backgroundImage,
    ?backgroundPosition,
    ?backgroundSize,
    ?backgroundRepeat,
    ?backgroundOrigin,
    ?backgroundClip,
    ?backgroundAttachment,
  ]
  | 'initial'
  | 'inherit'

export type backgroundAttachment = 'scroll' | 'fixed' | 'local' | 'initial' | 'inherit'

export type backgroundBlendMode =
  | 'normal'
  | 'multiply'
  | 'screen'
  | 'overlay'
  | 'darken'
  | 'lighten'
  | 'color-dodge'
  | 'saturation'
  | 'color'
  | 'luminosity'
  | 'initial'
  | 'inherit'

export type backgroundClip = 'border-box' | 'padding-box' | 'content-box' | 'initial' | 'inherit'

export type backgroundColor = color

export type backgroundImage = 'url' | 'none' | 'initial' | 'inherit'

export type backgroundOrigin = 'padding-box' | 'border-box' | 'content-box' | 'initial' | 'inherit'

export type backgroundPosition = [string, string] | 'initial' | 'inherit'

export type backgroundPositionX = length | 'left' | 'center' | 'right'

export type backgroundPositionY = length | 'top' | 'center' | 'bottom'

export type backgroundRepeat =
  | 'initial'
  | 'inherit'
  | 'repeat'
  | 'repeat-x'
  | 'repeat-y'
  | 'no-repeat'
  | 'initial'
  | 'inherit'

export type backgroundRepeatX =
  | 'initial'
  | 'inherit'
  | 'no-repeat'
  | 'repeat'
  | 'unset'

export type backgroundRepeatY =
  | 'initial'
  | 'inherit'
  | 'no-repeat'
  | 'repeat'
  | 'unset'

export type backgroundSize =
  | 'initial'
  | 'inherit'
  | 'auto'
  | [length, ?length]
  | 'cover'
  | 'contain'
  | 'initial'
  | 'inherit'

export type baselineShift =
  | 'auto'
  | 'baseline'
  | 'super'
  | 'sub'
  | length

export type border = [borderWidth, ?borderStyle, ?borderColor] | 'initial' | 'inherit'

export type borderBottom = border
export type borderBottomColor = borderColor
export type borderBottomLeftRadius = borderRadius
export type borderBottomRightRadius = borderRadius
export type borderBottomStyle = borderStyle
export type borderBottomWidth = borderWidth

export type borderCollapse = 'separate' | 'collapse' | 'initial' | ' inherit'

export type borderColor = color

export type borderImage =
  | 'initial'
  | 'inherit'
  | [
    borderImageSource,
    ?borderImageSlice,
    ?borderImageWidth,
    ?borderImageOutset,
    ?borderImageRepeat]
  | 'initial'
  | 'inherit'
export type borderImageOutset = length | 'initial' | 'inherit'
export type borderImageRepeat = 'stretch' | 'repeat' | 'round' | 'initial' | 'inherit'
export type borderImageSlice = number | percentage | 'fill' | 'initial' | 'inherit'
export type borderImageSource = 'none' | string | 'initial' | 'inherit'
export type borderImageWidth = number | length | 'auto' | 'initial' | 'inherit'

export type borderLeft = border
export type borderLeftColor = borderColor
export type borderLeftStyle = borderStyle
export type borderLeftWidth = borderWidth

export type borderRadius =
  | number
  | [length, ?length, ?length, ?length]
  | string
  | 'initial'
  | 'inherit'

export type borderRight = border
export type borderRightColor = borderColor
export type borderRightStyle = borderStyle
export type borderRightWidth = borderWidth

export type borderSpacing = length | [length, ?length] | 'initial' | 'inherit'

export type borderStyle =
  | 'none'
  | 'hidden'
  | 'dotted'
  | 'dashed'
  | 'solid'
  | 'double'
  | 'groove'
  | 'ridge'
  | 'inset'
  | 'outset'
  | 'initial'
  | 'inherit'

export type borderTop = border
export type borderTopColor = borderColor
export type borderTopLeftRadius = borderRadius
export type borderTopRightRadius = borderRadius
export type borderTopStyle = borderStyle
export type borderTopWidth = borderWidth

type borderWidthUnit = 'medium' | 'thin' | 'thick' | length | 'initial' | 'inherit'
export type borderWidth =
  | borderWidthUnit
  | [borderWidthUnit, ?borderWidthUnit, ?borderWidthUnit, ?borderWidthUnit]

export type bottom = 'auto' | length | 'initial' | 'inherit'

export type boxShadow =
  | 'none'
  | [length, ?length, ?length, ?length, ?color]
  | 'inset'
  | 'initial'
  | 'inherit'

export type boxSizing = 'content-box' | 'border-box' | 'initial' | 'inherit'

export type breakAfter =
  | 'auto'
  | 'avoid'
  | 'avoid-page'
  | 'page'
  | 'left'
  | 'right'
  | 'recto'
  | 'verso'
  | 'avoid-column'
  | 'column'
  | 'avoid-region'
  | 'region'

export type breakBefore =
  | 'auto'
  | 'avoid'
  | 'avoid-page'
  | 'page'
  | 'left'
  | 'right'
  | 'recto'
  | 'verso'
  | 'avoid-column'
  | 'column'
  | 'avoid-region'
  | 'region'

export type breakInside =
  | 'auto'
  | 'avoid'
  | 'avoid-page'
  | 'avoid-column'
  | 'avoid-region'

export type captionSide = 'top' | 'bottom' | 'initial' | 'inherit'

export type caretColor = color

export type clear = 'none' | 'left' | 'right' | 'both' | 'initial' | 'inherit'

// rect (top, right, bottom, left)
type shape = string
export type clip = 'auto' | shape | 'initial' | 'inherit'

export type color = string | 'transparent' | 'initial' | 'inherit'

export type columnCount = number | 'auto' | 'initial' | 'inherit'
export type columnFill = 'balance' | 'auto' | 'initial' | 'inherit'
export type columnGap = length | 'normal' | 'initial' | 'inherit'
export type columnRule =
  | [columnRuleWidth, ?columnRuleStyle, ?columnRuleColor]
  | 'initial'
  | 'inherit'
export type columnRuleColor = color
export type columnRuleStyle = borderStyle
export type columnRuleWidth = length | 'medium' | 'thin' | 'thick' | 'initial' | 'inherit'
export type columnSpan = 1 | 'all' | 'initial' | 'inherit'
export type columnWidth = 'auto' | length | 'initial' | 'inherit'

export type columns = 'auto' | [columnWidth, ?columnCount] | 'initial' | 'inherit'

export type content =
  | string
  | 'normal'
  | 'none'
  | 'counter'
  | 'attr'
  | 'open-quote'
  | 'close-quote'
  | 'no-open-quote'
  | 'no-close-quote'
  | 'initial'
  | 'inherit'

export type counterIncrement = number | 'none' | 'initial' | 'inherit'
export type counterReset = 'none' | [string, ?number] | 'initial' | 'inherit'

export type cursor =
  | 'alias'
  | 'all-scroll'
  | 'auto'
  | 'cell'
  | 'context-menu'
  | 'col-resize'
  | 'copy'
  | 'crosshair'
  | 'default'
  | 'e-resize'
  | 'ew-resize'
  | 'grab'
  | 'grabbing'
  | 'help'
  | 'move'
  | 'n-resize'
  | 'ne-resize'
  | 'nesw-resize'
  | 'ns-resize'
  | 'nw-resize'
  | 'nwse-resize'
  | 'no-drop'
  | 'none'
  | 'not-allowed'
  | 'pointer'
  | 'progress'
  | 'row-resize'
  | 's-resize'
  | 'se-resize'
  | 'sw-resize'
  | 'text'
  | string /* URL */
  | 'vertical-text'
  | 'w-resize'
  | 'wait'
  | 'zoom-in'
  | 'zoom-out'
  | 'initial'
  | 'inherit'

export type cx = length

export type cy = length

export type direction = 'ltr' | 'rtl' | 'initial' | 'inherit'

export type display =
  | 'inline'
  | 'block'
  | 'flex'
  | 'inline-block'
  | 'inline-flex'
  | 'inline-table'
  | 'list-item'
  | 'run-in'
  | 'table'
  | 'table-caption'
  | 'table-column-group'
  | 'table-header-group'
  | 'table-footer-group'
  | 'table-row-group'
  | 'table-cell'
  | 'table-column'
  | 'table-row'
  | 'none'
  | 'initial'
  | 'inherit'

export type dominantBaseline =
  | 'auto'
  | 'use-script'
  | 'no-change'
  | 'reset-size'
  | 'ideographic'
  | 'alphabetic'
  | 'hanging'
  | 'mathematical'
  | 'central'
  | 'middle'
  | 'text-after-edge'
  | 'text-before-edge'
  | 'inherit'

export type emptyCells = 'show' | 'hide' | 'initial' | 'inherit'

export type fillOpacity = length

export type fillRule = 'nonzero' | 'evenodd'

type filterFunction = string
export type filter = 'none' | filterFunction | 'initial' | 'inherit'

export type flex =
  | flexGrow
  | [flexGrow, ?flexShrink, ?flexBasis]
  | 'auto'
  | 'none'
  | 'initial'
  | 'inherit'
export type flexBasis = length | 'auto' | 'initial' | 'inherit'
export type flexDirection =
  | 'row'
  | 'row-reverse'
  | 'column'
  | 'column-reverse'
  | 'initial'
  | 'inherit'
export type flexFlow = [flexDirection, ?flexWrap] | 'initial' | 'inherit'
export type flexGrow = number | 'initial' | 'inherit'
export type flexShrink = number | 'initial' | 'inherit'
export type flexWrap = 'nowrap' | 'wrap' | 'wrap-reverse' | 'initial' | 'inherit'

export type float = 'none' | 'left' | 'right' | 'initial' | 'inherit'

export type font =
  | [
    fontStyle,
    ?fontVariant,
    ?fontWeight,
    ?string /* fontSize / fontWeight */,
    ?fontFamily]
  | 'caption'
  | 'icon'
  | 'menu'
  | 'message-box'
  | 'small-caption'
  | 'status-bar'
  | 'initial'
  | 'inherit'

export type fontDisplay =
  | 'auto'
  | 'block'
  | 'swap'
  | 'fallback'
  | 'optional'

// TODO: fontFace type
export type fontFace = Object

export type fontFamily = string | 'initial' | 'inherit'

export type fontFeatureSettings = 'normal' | string

export type fontKerning = 'auto' | 'normal' | 'none'

export type fontSize =
  | 'medium'
  | 'xx-small'
  | 'x-small'
  | 'small'
  | 'large'
  | 'x-large'
  | 'xx-large'
  | 'smaller'
  | 'larger'
  | length
  | 'initial'
  | 'inherit'
export type fontSizeAdjust = number | 'none' | 'initial' | 'inherit'
export type fontStretch = 'ultra-condensed' | 'extra-condensed' | 'condensed' | 'semi-condensed' | 'normal' | 'semi-expanded' | 'expanded' | 'extra-expanded' | 'ultra-expanded' | 'initial' | 'inherit'
export type fontStyle = 'normal' | 'italic' | 'oblique' | 'initial' | 'inherit'
export type fontVariant = 'normal' | 'small-caps' | 'initial' | 'inherit'
export type fontVariantCaps =
  | 'normal'
  | 'small-caps'
  | 'all-small-caps'
  | 'petite-caps'
  | 'all-petite-caps'
  | 'unicase'
  | 'titling-caps'

export type fontVariationSettings = 'normal' | string

export type fontWeight = 'normal' | 'bold' | 'bolder' | 'lighter' | number | 'initial' | 'inherit'

export type hangingPunctuation = 'none' | 'first' | 'last' | 'allow-end' | 'force-end' | 'initial' | 'inherit'

export type height = 'auto' | length | 'initial' | 'inherit'

export type hyphens = 'none' | 'manual' | 'auto'

export type imageRendering = 'auto' | 'crisp-edges' | 'pixelated'

export type inlineSize = length

export type isolation = 'auto' | 'isolate'

export type justifyContent = 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'initial' | 'inherit'

export type justifyItems =
  | 'auto'
  | 'normal'
  | 'stretch'
  | 'cetner'
  | 'start'
  | 'end'
  | 'flex-start'
  | 'flex-end'
  | 'self-start'
  | 'self-end'
  | 'left'
  | 'right'
  | 'baseline'
  | 'first baseline'
  | 'last baseline'
  | 'safe center'
  | 'unsafe center'
  | 'legacy right'
  | 'legacy left'
  | 'legacy center'
  | 'inherit'
  | 'initial'
  | 'unset'

export type justifySelf =
  | 'auto'
  | 'normal'
  | 'stretch'
  | 'cetner'
  | 'start'
  | 'end'
  | 'flex-start'
  | 'flex-end'
  | 'self-start'
  | 'self-end'
  | 'left'
  | 'right'
  | 'baseline'
  | 'first baseline'
  | 'last baseline'
  | 'safe center'
  | 'unsafe center'
  | 'inherit'
  | 'initial'
  | 'unset'

// TODO: keyframes type
export type keyframes = Object

export type left = 'auto' | length | 'initial' | 'inherit'

export type letterSpacing = 'normal' | length | 'initial' | 'inherit'

export type lightingColor = 'currentColor' | 'inherit' | string

export type lineBreak = 'auto' | 'loose' | 'normal' | 'strict'

export type lineHeight = 'normal' | number | length | 'initial' | 'inherit'

export type listStyle = [listStyleType, ?listStylePosition, ?listStyleImage] | 'initial' | 'inherit'
export type listStyleImage = 'none' | string | 'initial' | 'inherit'
export type listStylePosition = 'inside' | 'outside' | 'initial' | 'inherit'
export type listStyleType =
  | 'disc'
  | 'armenian'
  | 'circle'
  | 'cjk-ideographic'
  | 'decimal'
  | 'decimal-leading-zero'
  | 'georgian'
  | 'hebrew'
  | 'hiragana'
  | 'hiragana-iroha'
  | 'katakana'
  | 'katakana-iroha'
  | 'lower-alpha'
  | 'lower-greek'
  | 'lower-latin'
  | 'lower-roman'
  | 'none'
  | 'square'
  | 'upper-alpha'
  | 'upper-greek'
  | 'upper-latin'
  | 'upper-roman'
  | 'initial'
  | 'inherit'

export type margin = length | [marginTop, ?marginRight, ?marginBottom, ?marginLeft] | 'auto' | 'initial' | 'inherit'
export type marginBottom = length | 'auto' | 'initial' | 'inherit'
export type marginLeft = length | 'auto' | 'initial' | 'inherit'
export type marginRight = length | 'auto' | 'initial' | 'inherit'
export type marginTop = length | 'auto' | 'initial' | 'inherit'

export type maxHeight = 'none' | length | 'initial' | 'inherit'
export type maxWidth = 'none' | length | 'initial' | 'inherit'
export type maxZoom = 'auto' | length

// TODO: media type
export type media = Object

export type minHeight = length | 'initial' | 'inherit'
export type minWidth = length | 'initial' | 'inherit'
export type minZoom = 'auto' | length

export type navDown = 'auto' | string | 'initial' | 'inherit'
export type navIndex = 'auto' | number | 'initial' | 'inherit'
export type navLeft = 'auto' | string | 'initial' | 'inherit'
export type navRight = 'auto' | string | 'initial' | 'inherit'
export type navUp = 'auto' | string | 'initial' | 'inherit'

export type objectFit = 'fill' | 'contain' | 'cover' | 'none' | 'scale-down'

export type opacity = number | 'initial' | 'inherit'

export type order = number | 'initial' | 'inherit'

export type orphans = number

export type outline = [outlineColor, ?outlineStyle, ?outlineWidth] | 'initial' | 'inherit'
export type outlineColor = 'invert' | color | 'initial' | 'inherit'
export type outlineOffset = length | 'initial' | 'inherit'
export type outlineStyle = borderStyle
export type outlineWidth = 'medium' | 'thin' | 'thick' | length | 'initial' | 'inherit'

export type overflow = 'visible' | 'hidden' | 'scroll' | 'auto' | 'initial' | 'inherit'
export type overflowX = overflow
export type overflowY = overflow

export type overscrollBehavior = 'contain' | 'none' | 'auto' | string
export type overscrollBehaviorX = 'contain' | 'none' | 'auto'
export type overscrollBehaviorY = 'contain' | 'none' | 'auto'

export type padding = length | [paddingTop, ?paddingRight, ?paddingBottom, ?paddingLeft] | 'initial' | 'inherit'
export type paddingBottom = length | 'initial' | 'inherit'
export type paddingLeft = length | 'initial' | 'inherit'
export type paddingRight = length | 'initial' | 'inherit'
export type paddingTop = length | 'initial' | 'inherit'

type pageBreak = 'auto' | 'always' | 'avoid' | 'left' | 'right' | 'initial' | 'inherit'
export type pageBreakAfter = pageBreak
export type pageBreakBefore = pageBreak
export type pageBreakInside = 'auto' | 'avoid' | 'initial' | 'inherit'

export type perspective = length | 'none' | 'initial' | 'inherit'

type axis = 'left' | 'center' | 'right' | length
export type perspectiveOrigin = [axis, ?axis] | 'initial' | 'inherit'

export type pointerEvents =
  | 'auto'
  | 'none'
  | 'visiblePainted'
  | 'visibleFill'
  | 'visibleStroke'
  | 'visible'
  | 'painted'
  | 'fill'
  | 'stroke'
  | 'all'
  | 'inherit'

export type position = 'static' | 'absolute' | 'fixed' | 'relative' | 'initial' | 'inherit'

export type quotes = 'none' | [string, ?string, ?string, ?string] | 'initial' | 'inherit'

export type resize = 'none' | 'both' | 'horizontal' | 'vertical' | 'initial' | 'inherit'

export type right = 'auto' | length | 'initial' | 'inherit'

export type scrollBehavior = 'auto' | 'smooth'

export type speak =
  | 'digits'
  | 'inherit'
  | 'initial'
  | 'initial-punctuation'
  | 'no-punctuation'
  | 'none'
  | 'normal'
  | 'spell-out'
  | 'unset'

export type tabSize = number | length | 'initial' | 'inherit'

export type tableLayout = 'auto' | 'fixed' | 'initial' | 'inherit'

export type textAlign = 'left' | 'right' | 'center' | 'justify' | 'initial' | 'inherit'
export type textAlignLast = 'auto' | 'left' | 'right' | 'center' | 'justify' | 'start' | 'end' | 'initial' | 'inherit'
export type textDecoration = 'none' | 'underline' | 'overline' | 'line-through' | 'initial' | 'inherit'
export type textDecorationColor = color
export type textDecorationLine = 'none' | 'underline' | 'overline' | 'line-through' | 'initial' | 'inherit'
export type textDecorationStyle = 'solid' | 'double' | 'dotted' | 'dashed' | 'wavy' | 'initial' | 'inherit'
export type textIndent = length | 'initial' | 'inherit'
export type textJustify = 'auto' | 'inter-word' | 'inter-ideograph' | 'inter-cluster' | 'distribute' | 'kashida' | 'trim' | 'initial' | 'inherit'
export type textOverflow = 'clip' | 'ellipsis' | string | 'initial' | 'inherit'
export type textShadow = [?length, ?length, ?length, ?color] | 'initial' | 'inherit'
export type textTransform = 'none' | 'capitalize' | 'uppercase' | 'lowercase' | 'initial' | 'inherit'

export type top = 'auto' | length | 'initial' | 'inherit'

export type touchAction =
  | 'auto'
  | 'none'
  | 'pan-x'
  | 'pan-left'
  | 'pan-right'
  | 'pan-y'
  | 'pan-up'
  | 'pan-down'
  | 'pinch-zoom'
  | 'manipulation'

type transformFunction = string
export type transform = 'none' | transformFunction | 'initial' | 'inherit'
export type transformOrigin = [axis, ?axis, ?length] | 'initial' | 'inherit'
export type transformStyle = 'flat' | 'preserve-3d' | 'initial' | 'inherit'

export type transition = [transitionProperty, ?transitionDuration, ?transitionTimingFunction, ?transitionDelay] | 'initial' | 'inherit'
export type transitionDelay = time | 'initial' | 'inherit'
export type transitionDuration = time | 'initial' | 'inherit'
export type transitionProperty = 'none' | 'all' | string | 'initial' | 'inherit'
// TODO: transitionTimingFunction type
export type transitionTimingFunction = string | 'initial' | 'inherit'

export type unicodeBidi = 'normal' | 'embed' | 'bidi-override' | 'initial' | 'inherit'

export type userSelect = 'auto' | 'none' | 'text' | 'all'

export type userZoom = 'zoom' | 'fixed'

export type verticalAlign = 'baseline' | length | 'sub' | 'super' | 'top' | 'text-top' | 'middle' | 'bottom' | 'text-bottom' | 'initial' | 'inherit'

export type visibility = 'visible' | 'hidden' | 'collapse' | 'initial' | 'inherit'

export type whiteSpace = 'normal' | 'nowrap' | 'pre' | 'pre-line' | 'pre-wrap' | 'initial' | 'inherit'

export type width = 'auto' | length | 'initial' | 'inherit'

export type widows = 'inherit' | 'initial' | 'unset' | number

export type willChange = string

export type wordBreak = 'normal' | 'break-all' | 'keep-all' | 'initial' | 'inherit'
export type wordSpacing = 'normal' | length | 'initial' | 'inherit'
export type wordWrap = 'normal' | 'break-word' | 'initial' | 'inherit'

export type zIndex = 'auto' | number | 'initial' | 'inherit'
