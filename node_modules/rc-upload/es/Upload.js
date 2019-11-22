import _extends from 'babel-runtime/helpers/extends';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _createClass from 'babel-runtime/helpers/createClass';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import AjaxUpload from './AjaxUploader';
import IframeUpload from './IframeUploader';

function empty() {}

var Upload = function (_Component) {
  _inherits(Upload, _Component);

  function Upload() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, Upload);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Upload.__proto__ || Object.getPrototypeOf(Upload)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
      Component: null
    }, _this.saveUploader = function (node) {
      _this.uploader = node;
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(Upload, [{
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
      return typeof File !== 'undefined' ? AjaxUpload : IframeUpload;
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
          return React.createElement(_ComponentUploader, _extends({}, this.props, { ref: this.saveUploader }));
        }
        return null;
      }
      var ComponentUploader = this.getComponent();
      return React.createElement(ComponentUploader, _extends({}, this.props, { ref: this.saveUploader }));
    }
  }]);

  return Upload;
}(Component);

Upload.propTypes = {
  component: PropTypes.string,
  style: PropTypes.object,
  prefixCls: PropTypes.string,
  action: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  name: PropTypes.string,
  multipart: PropTypes.bool,
  directory: PropTypes.bool,
  onError: PropTypes.func,
  onSuccess: PropTypes.func,
  onProgress: PropTypes.func,
  onStart: PropTypes.func,
  data: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  headers: PropTypes.object,
  accept: PropTypes.string,
  multiple: PropTypes.bool,
  disabled: PropTypes.bool,
  beforeUpload: PropTypes.func,
  customRequest: PropTypes.func,
  onReady: PropTypes.func,
  withCredentials: PropTypes.bool,
  supportServerRender: PropTypes.bool,
  openFileDialogOnClick: PropTypes.bool
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


export default Upload;