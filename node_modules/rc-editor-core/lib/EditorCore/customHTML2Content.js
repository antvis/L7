'use strict';

exports.__esModule = true;
exports['default'] = customHTML2Content;

var _draftJs = require('draft-js');

var _toArray = require('lodash/toArray');

var _toArray2 = _interopRequireDefault(_toArray);

var _immutable = require('immutable');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function compose() {
    for (var _len = arguments.length, argument = Array(_len), _key = 0; _key < _len; _key++) {
        argument[_key] = arguments[_key];
    }

    var args = arguments;
    var start = args.length - 1;
    return function () {
        var i = start;
        var result = args[start].apply(this, arguments);
        while (i--) {
            result = args[i].call(this, result);
        }return result;
    };
}
;
/*
 * Helpers
 */
// Prepares img meta data object based on img attributes
var getBlockSpecForElement = function getBlockSpecForElement(imgElement) {
    return {
        contentType: 'image',
        src: imgElement.getAttribute('src'),
        width: imgElement.getAttribute('width'),
        height: imgElement.getAttribute('height'),
        align: imgElement.style.cssFloat
    };
};
// Wraps meta data in HTML element which is 'understandable' by Draft, I used <blockquote />.
var wrapBlockSpec = function wrapBlockSpec(blockSpec) {
    if (blockSpec == null) {
        return null;
    }
    var tempEl = document.createElement('blockquote');
    // stringify meta data and insert it as text content of temp HTML element. We will later extract
    // and parse it.
    tempEl.innerText = JSON.stringify(blockSpec);
    return tempEl;
};
// Replaces <img> element with our temp element
var replaceElement = function replaceElement(oldEl, newEl) {
    if (!(newEl instanceof HTMLElement)) {
        return;
    }
    var parentNode = oldEl.parentNode;
    return parentNode.replaceChild(newEl, oldEl);
};
var elementToBlockSpecElement = compose(wrapBlockSpec, getBlockSpecForElement);
var imgReplacer = function imgReplacer(imgElement) {
    return replaceElement(imgElement, elementToBlockSpecElement(imgElement));
};
// creates ContentBlock based on provided spec
var createContentBlock = function createContentBlock(blockData, contentState) {
    var key = blockData.key,
        type = blockData.type,
        text = blockData.text,
        data = blockData.data,
        inlineStyles = blockData.inlineStyles,
        entityData = blockData.entityData;

    var blockSpec = {
        type: type != null ? type : 'unstyled',
        text: text != null ? text : '',
        key: key != null ? key : (0, _draftJs.genKey)(),
        data: null,
        characterList: (0, _immutable.List)([])
    };
    if (data) {
        blockSpec.data = (0, _immutable.fromJS)(data);
    }
    if (inlineStyles || entityData) {
        var entityKey = void 0;
        if (entityData) {
            var _type = entityData.type,
                mutability = entityData.mutability,
                _data = entityData.data;

            contentState.createEntity(_type, mutability, _data);
            entityKey = contentState.getLastCreatedEntityKey();
        } else {
            entityKey = null;
        }
        var style = (0, _immutable.OrderedSet)(inlineStyles || []);
        var charData = _draftJs.CharacterMetadata.create({ style: style, entityKey: entityKey });
        blockSpec.characterList = (0, _immutable.List)((0, _immutable.Repeat)(charData, text.length));
    }
    return new _draftJs.ContentBlock(blockSpec);
};
// takes HTML string and returns DraftJS ContentState
function customHTML2Content(HTML, contentState) {
    var tempDoc = new DOMParser().parseFromString(HTML, 'text/html');
    // replace all <img /> with <blockquote /> elements
    (0, _toArray2['default'])(tempDoc.querySelectorAll('img')).forEach(imgReplacer);
    // use DraftJS converter to do initial conversion. I don't provide DOMBuilder and
    // blockRenderMap arguments here since it should fall back to its default ones, which are fine

    var _convertFromHTML = (0, _draftJs.convertFromHTML)(tempDoc.body.innerHTML),
        contentBlocks = _convertFromHTML.contentBlocks;
    // now replace <blockquote /> ContentBlocks with 'atomic' ones


    contentBlocks = contentBlocks.reduce(function (contentBlocks, block) {
        if (block.getType() !== 'blockquote') {
            return contentBlocks.concat(block);
        }
        var image = JSON.parse(block.getText());
        contentState.createEntity('IMAGE-ENTITY', 'IMMUTABLE', image);
        var entityKey = contentState.getLastCreatedEntityKey();
        var charData = _draftJs.CharacterMetadata.create({ entity: entityKey });
        // const blockSpec = Object.assign({ type: 'atomic', text: ' ' }, { entityData })
        // const atomicBlock = createContentBlock(blockSpec)
        // const spacerBlock = createContentBlock({});
        var fragmentArray = [new _draftJs.ContentBlock({
            key: (0, _draftJs.genKey)(),
            type: 'image-block',
            text: ' ',
            characterList: (0, _immutable.List)((0, _immutable.Repeat)(charData, charData.count()))
        }), new _draftJs.ContentBlock({
            key: (0, _draftJs.genKey)(),
            type: 'unstyled',
            text: '',
            characterList: (0, _immutable.List)()
        })];
        return contentBlocks.concat(fragmentArray);
    }, []);
    // console.log('>> customHTML2Content contentBlocks', contentBlocks);
    tempDoc = null;
    return _draftJs.BlockMapBuilder.createFromArray(contentBlocks);
}
module.exports = exports['default'];