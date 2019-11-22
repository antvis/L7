"use strict";

require("core-js/modules/es.symbol");

require("core-js/modules/es.symbol.description");

require("core-js/modules/es.array.for-each");

require("core-js/modules/es.array.iterator");

require("core-js/modules/es.function.name");

require("core-js/modules/es.map");

require("core-js/modules/es.object.assign");

require("core-js/modules/es.object.define-property");

require("core-js/modules/es.object.keys");

require("core-js/modules/es.object.to-string");

require("core-js/modules/es.object.values");

require("core-js/modules/es.string.iterator");

require("core-js/modules/web.dom-collections.for-each");

require("core-js/modules/web.dom-collections.iterator");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = makeTableComponent;

var _propTypes = _interopRequireDefault(require("prop-types"));

var _react = _interopRequireDefault(require("react"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var PropTypesMap = new Map();
Object.keys(_propTypes["default"]).forEach(function (typeName) {
  var type = _propTypes["default"][typeName];
  PropTypesMap.set(type, typeName);
  PropTypesMap.set(type.isRequired, typeName);
});

var isNotEmpty = function isNotEmpty(obj) {
  return obj && obj.props && Object.keys(obj.props).length > 0;
};

var hasDocgen = function hasDocgen(type) {
  return isNotEmpty(type.__docgenInfo);
};

var propsFromDocgen = function propsFromDocgen(type) {
  var props = {};
  var docgenInfoProps = type.__docgenInfo.props;
  Object.keys(docgenInfoProps).forEach(function (property) {
    var docgenInfoProp = docgenInfoProps[property];
    var defaultValueDesc = docgenInfoProp.defaultValue || {};
    var propType = docgenInfoProp.flowType || docgenInfoProp.type || 'other';
    props[property] = {
      property: property,
      propType: propType,
      required: docgenInfoProp.required,
      description: docgenInfoProp.description,
      defaultValue: defaultValueDesc.value
    };
  });
  return props;
};

var propsFromPropTypes = function propsFromPropTypes(type) {
  var props = {};

  if (type.propTypes) {
    Object.keys(type.propTypes).forEach(function (property) {
      var typeInfo = type.propTypes[property];
      var required = typeInfo.isRequired === undefined;
      var docgenInfo = type.__docgenInfo && type.__docgenInfo.props && type.__docgenInfo.props[property];
      var description = docgenInfo ? docgenInfo.description : null;
      var propType = PropTypesMap.get(typeInfo) || 'other';

      if (propType === 'other') {
        if (docgenInfo && docgenInfo.type) {
          propType = docgenInfo.type.name;
        }
      }

      props[property] = {
        property: property,
        propType: propType,
        required: required,
        description: description
      };
    });
  }

  if (type.defaultProps) {
    Object.keys(type.defaultProps).forEach(function (property) {
      var value = type.defaultProps[property];

      if (value === undefined) {
        return;
      }

      if (!props[property]) {
        props[property] = {
          property: property
        };
      }

      props[property].defaultValue = value;
    });
  }

  return props;
};

function makeTableComponent(Component) {
  var TableComponent = function TableComponent(props) {
    var type = props.type;

    if (!type) {
      return null;
    }

    var propDefinitionsMap = hasDocgen(type) ? propsFromDocgen(type) : propsFromPropTypes(type);
    var propDefinitions = Object.values(propDefinitionsMap);
    return _react["default"].createElement(Component, _extends({
      propDefinitions: propDefinitions
    }, props));
  };

  TableComponent.propTypes = {
    type: _propTypes["default"].func.isRequired
  };
  return TableComponent;
}