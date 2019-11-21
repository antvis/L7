'use strict';

function _defaults(obj, defaults) { var keys = Object.getOwnPropertyNames(defaults); for (var i = 0; i < keys.length; i++) { var key = keys[i]; var value = Object.getOwnPropertyDescriptor(defaults, key); if (value && value.configurable && obj[key] === undefined) { Object.defineProperty(obj, key, value); } } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : _defaults(subClass, superClass); }

var Declaration = require('../declaration');

var _require = require('./grid-utils'),
    parseGridAreas = _require.parseGridAreas,
    insertAreas = _require.insertAreas;

function getGridRows(tpl) {
    return tpl.trim().slice(1, -1).split(/['"]\s*['"]?/g);
}

var GridTemplateAreas = function (_Declaration) {
    _inherits(GridTemplateAreas, _Declaration);

    function GridTemplateAreas() {
        _classCallCheck(this, GridTemplateAreas);

        return _possibleConstructorReturn(this, _Declaration.apply(this, arguments));
    }

    /**
     * Translate grid-template-areas to separate -ms- prefixed properties
     */
    GridTemplateAreas.prototype.insert = function insert(decl, prefix, prefixes, result) {
        if (prefix !== '-ms-') return _Declaration.prototype.insert.call(this, decl, prefix, prefixes);

        var areas = parseGridAreas(getGridRows(decl.value));

        insertAreas(areas, decl, result);

        return decl;
    };

    return GridTemplateAreas;
}(Declaration);

Object.defineProperty(GridTemplateAreas, 'names', {
    enumerable: true,
    writable: true,
    value: ['grid-template-areas']
});


module.exports = GridTemplateAreas;