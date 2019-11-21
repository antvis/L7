'use strict';

exports.__esModule = true;
exports.DEFAULT_INLINE_STYLE = exports.DEFAULT_ELEMENT = exports.EMPTY_SET = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports['default'] = GetHTML;

var _draftJs = require('draft-js');

var _immutable = require('immutable');

var _isUnitlessNumber = require('./isUnitlessNumber');

var _isUnitlessNumber2 = _interopRequireDefault(_isUnitlessNumber);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var EMPTY_SET = exports.EMPTY_SET = (0, _immutable.OrderedSet)();
var DEFAULT_ELEMENT = exports.DEFAULT_ELEMENT = 'span';
var DEFAULT_INLINE_STYLE = exports.DEFAULT_INLINE_STYLE = _draftJs.DefaultDraftInlineStyle;
function encodeContent(text) {
    return text.split('&').join('&amp;').split('<').join('&lt;').split('>').join('&gt;').split('\xA0').join('&nbsp;').split('\n').join('<br >' + '\n');
}
function encodeAttr(text) {
    return text.split('&').join('&amp;').split('<').join('&lt;').split('>').join('&gt;').split('"').join('&quot;');
}
var VENDOR_PREFIX = /^(moz|ms|o|webkit)-/;
var NUMERIC_STRING = /^\d+$/;
var UPPERCASE_PATTERN = /([A-Z])/g;
// Lifted from: https://github.com/facebook/react/blob/master/src/renderers/dom/shared/CSSPropertyOperations.js
function processStyleName(name) {
    return name.replace(UPPERCASE_PATTERN, '-$1').toLowerCase().replace(VENDOR_PREFIX, '-$1-');
}
// Lifted from: https://github.com/facebook/react/blob/master/src/renderers/dom/shared/dangerousStyleValue.js
function processStyleValue(name, value) {
    var isNumeric = void 0;
    if (typeof value === 'string') {
        isNumeric = NUMERIC_STRING.test(value);
    } else {
        isNumeric = true;
        value = String(value);
    }
    if (!isNumeric || value === '0' || _isUnitlessNumber2['default'][name] === true) {
        return value;
    } else {
        return value + 'px';
    }
}
function getStyleText(styleObject) {
    if (!styleObject) {
        return '';
    }
    return Object.keys(styleObject).map(function (name) {
        var styleName = processStyleName(name);
        var styleValue = processStyleValue(name, styleObject[name]);
        return styleName + ':' + styleValue;
    }).join(';');
}
function getEntityContent(contentState, entityKey, content) {
    if (entityKey) {
        var entity = contentState.getEntity(entityKey);
        var entityData = entity.getData();
        if (entityData && entityData['export']) {
            return entityData['export'](content, entityData);
        }
    }
    return content;
}
function GetHTML(configStore) {
    return function exportHtml(editorState) {
        var contentState = editorState.getCurrentContent();
        var blockMap = contentState.getBlockMap();
        var customStyleMap = configStore.get('customStyleMap') || {};
        var customBlockRenderMap = configStore.get('blockRenderMap') || {};
        var customStyleFn = configStore.get('customStyleFn');
        var toHTMLList = configStore.get('toHTMLList');
        _extends(customStyleMap, DEFAULT_INLINE_STYLE);
        return blockMap.map(function (block) {
            var resultText = '<div>';
            var closeTag = '</div>';
            var lastPosition = 0;
            var text = block.getText();
            var blockType = block.getType();
            var blockRender = customBlockRenderMap.get(blockType);
            if (blockRender) {
                var element = typeof blockRender.element === 'function' ? blockRender.elementTag || 'div' : 'div';
                resultText = '<' + (element || 'div') + ' style="' + getStyleText(customBlockRenderMap.get(blockType).style || {}) + '">';
                closeTag = '</' + (element || 'div') + '>';
            }
            var charMetaList = block.getCharacterList();
            var charEntity = null;
            var prevCharEntity = null;
            var ranges = [];
            var rangeStart = 0;
            for (var i = 0, len = text.length; i < len; i++) {
                prevCharEntity = charEntity;
                var meta = charMetaList.get(i);
                charEntity = meta ? meta.getEntity() : null;
                if (i > 0 && charEntity !== prevCharEntity) {
                    ranges.push([prevCharEntity, getStyleRanges(text.slice(rangeStart, i), charMetaList.slice(rangeStart, i))]);
                    rangeStart = i;
                }
            }
            ranges.push([charEntity, getStyleRanges(text.slice(rangeStart), charMetaList.slice(rangeStart))]);
            ranges.map(function (_ref) {
                var entityKey = _ref[0],
                    stylePieces = _ref[1];

                var element = DEFAULT_ELEMENT;
                var rawContent = stylePieces.map(function (_ref2) {
                    var text = _ref2[0];
                    return text;
                }).join('');
                var content = stylePieces.map(function (_ref3) {
                    var text = _ref3[0],
                        styleSet = _ref3[1];

                    var encodedContent = encodeContent(text);
                    if (styleSet.size) {
                        var inlineStyle = {};
                        styleSet.forEach(function (item) {
                            if (customStyleMap.hasOwnProperty(item)) {
                                var currentStyle = customStyleMap[item];
                                inlineStyle = _extends(inlineStyle, currentStyle);
                            }
                        });
                        var customedStyle = customStyleFn(styleSet);
                        inlineStyle = _extends(inlineStyle, customedStyle);
                        return '<span style="' + getStyleText(inlineStyle) + '">' + encodedContent + '</span>';
                    }
                    return '<span>' + encodedContent + '</span>';
                }).join('');
                if (entityKey) {
                    var entity = contentState.getEntity(entityKey);
                    var entityData = entity.getData();
                    if (entityData && entityData['export']) {
                        resultText += entityData['export'](content, entityData);
                    } else {
                        var HTMLText = '';
                        toHTMLList.forEach(function (toHTML) {
                            var text = toHTML(rawContent, entity, contentState);
                            if (text) {
                                HTMLText = text;
                            }
                        });
                        if (HTMLText) {
                            resultText += HTMLText;
                        }
                    }
                } else {
                    resultText += content;
                }
            });
            resultText += closeTag;
            return resultText;
        }).join('\n');
    };
}
function getStyleRanges(text, charMetaList) {
    var charStyle = EMPTY_SET;
    var prevCharStyle = EMPTY_SET;
    var ranges = [];
    var rangeStart = 0;
    for (var i = 0, len = text.length; i < len; i++) {
        prevCharStyle = charStyle;
        var meta = charMetaList.get(i);
        charStyle = meta ? meta.getStyle() : EMPTY_SET;
        if (i > 0 && !(0, _immutable.is)(charStyle, prevCharStyle)) {
            ranges.push([text.slice(rangeStart, i), prevCharStyle]);
            rangeStart = i;
        }
    }
    ranges.push([text.slice(rangeStart), charStyle]);
    return ranges;
}