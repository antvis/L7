'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _AjaxUploader = require('./AjaxUploader');

var _AjaxUploader2 = _interopRequireDefault(_AjaxUploader);

var _IframeUploader = require('./IframeUploader');

var _IframeUploader2 = _interopRequireDefault(_IframeUploader);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function empty() {}

var Upload = function (_Component) {
  (0, _inherits3['default'])(Upload, _Component);

  function Upload() {
    var _ref;

    var _temp, _this, _ret;

    (0, _classCallCheck3['default'])(this, Upload);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3['default'])(this, (_ref = Upload.__proto__ || Object.getPrototypeOf(Upload)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
      Component: null
    }, _this.saveUploader = function (node) {
      _this.uploader = node;
    }, _temp), (0, _possibleConstructorReturn3['default'])(_this, _ret);
  }

  (0, _createClass3['default'])(Upload, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      if (this.props.supportServerRender) {
        /* eslint react/no-did-mount-set-state:0 */
        this.setState({
          Component: this.getComponent()
        }, this.props.onReady);
      }
    }
  }, {
    key: 'getComponent',
    value: function getComponent() {
      return typeof File !== 'undefined' ? _AjaxUploader2['default'] : _IframeUploader2['default'];
    }
  }, {
    key: 'abort',
    value: function abort(file) {
      this.uploader.abort(file);
    }
  }, {
    key: 'render',
    value: function render() {
      if (this.props.supportServerRender) {
        var _ComponentUploader = this.state.Component;
        if (_ComponentUploader) {
          return _react2['default'].createElement(_ComponentUploader, (0, _extends3['default'])({}, this.props, { ref: this.saveUploader }));
        }
        return null;
      }
      var ComponentUploader = this.getComponent();
      return _react2['default'].createElement(ComponentUploader, (0, _extends3['default'])({}, this.props, { ref: this.saveUploader }));
    }
  }]);
  return Upload;
}(_react.Component);

Upload.propTypes = {
  component: _propTypes2['default'].string,
  style: _propTypes2['default'].object,
  prefixCls: _propTypes2['default'].string,
  action: _propTypes2['default'].oneOfType([_propTypes2['default'].string, _propTypes2['default'].func]),
  name: _propTypes2['default'].string,
  multipart: _propTypes2['default'].bool,
  directory: _propTypes2['default'].bool,
  onError: _propTypes2['default'].func,
  onSuccess: _propTypes2['default'].func,
  onProgress: _propTypes2['default'].func,
  onStart: _propTypes2['default'].func,
  data: _propTypes2['default'].oneOfType([_propTypes2['default'].object, _propTypes2['default'].func]),
  headers: _propTypes2['default'].object,
  accept: _propTypes2['default'].string,
  multiple: _propTypes2['default'].bool,
  disabled: _propTypes2['default'].bool,
  beforeUpload: _propTypes2['default'].func,
  customRequest: _propTypes2['default'].func,
  onReady: _propTypes2['default'].func,
  withCredentials: _propTypes2['default'].bool,
  supportServerRender: _propTypes2['default'].bool,
  openFileDialogOnClick: _propTypes2['default'].bool
};
Upload.defaultProps = {
  component: 'span',
  prefixCls: 'rc-upload',
  data: {},
  headers: {},
  name: 'file',
  multipart: false,
  onReady: empty,
  onStart: empty,
  onError: empty,
  onSuccess: empty,
  supportServerRender: false,
  multiple: false,
  beforeUpload: null,
  customRequest: null,
  withCredentials: false,
  openFileDialogOnClick: true
};
exports['default'] = Upload;
module.exports = exports['default'];