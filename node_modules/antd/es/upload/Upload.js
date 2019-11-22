function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

import * as React from 'react';
import { polyfill } from 'react-lifecycles-compat';
import RcUpload from 'rc-upload';
import classNames from 'classnames';
import uniqBy from 'lodash/uniqBy';
import findIndex from 'lodash/findIndex';
import UploadList from './UploadList';
import { T, fileToObject, genPercentAdd, getFileItem, removeFileItem } from './utils';
import LocaleReceiver from '../locale-provider/LocaleReceiver';
import defaultLocale from '../locale/default';
import { ConfigConsumer } from '../config-provider';
import warning from '../_util/warning';

var Upload =
/*#__PURE__*/
function (_React$Component) {
  _inherits(Upload, _React$Component);

  function Upload(props) {
    var _this;

    _classCallCheck(this, Upload);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Upload).call(this, props));

    _this.saveUpload = function (node) {
      _this.upload = node;
    };

    _this.onStart = function (file) {
      var fileList = _this.state.fileList;
      var targetItem = fileToObject(file);
      targetItem.status = 'uploading';
      var nextFileList = fileList.concat();
      var fileIndex = findIndex(nextFileList, function (_ref) {
        var uid = _ref.uid;
        return uid === targetItem.uid;
      });

      if (fileIndex === -1) {
        nextFileList.push(targetItem);
      } else {
        nextFileList[fileIndex] = targetItem;
      }

      _this.onChange({
        file: targetItem,
        fileList: nextFileList
      }); // fix ie progress


      if (!window.File || process.env.TEST_IE) {
        _this.autoUpdateProgress(0, targetItem);
      }
    };

    _this.onSuccess = function (response, file, xhr) {
      _this.clearProgressTimer();

      try {
        if (typeof response === 'string') {
          response = JSON.parse(response);
        }
      } catch (e) {
        /* do nothing */
      }

      var fileList = _this.state.fileList;
      var targetItem = getFileItem(file, fileList); // removed

      if (!targetItem) {
        return;
      }

      targetItem.status = 'done';
      targetItem.response = response;
      targetItem.xhr = xhr;

      _this.onChange({
        file: _extends({}, targetItem),
        fileList: fileList
      });
    };

    _this.onProgress = function (e, file) {
      var fileList = _this.state.fileList;
      var targetItem = getFileItem(file, fileList); // removed

      if (!targetItem) {
        return;
      }

      targetItem.percent = e.percent;

      _this.onChange({
        event: e,
        file: _extends({}, targetItem),
        fileList: fileList
      });
    };

    _this.onError = function (error, response, file) {
      _this.clearProgressTimer();

      var fileList = _this.state.fileList;
      var targetItem = getFileItem(file, fileList); // removed

      if (!targetItem) {
        return;
      }

      targetItem.error = error;
      targetItem.response = response;
      targetItem.status = 'error';

      _this.onChange({
        file: _extends({}, targetItem),
        fileList: fileList
      });
    };

    _this.handleRemove = function (file) {
      var onRemove = _this.props.onRemove;
      var fileList = _this.state.fileList;
      Promise.resolve(typeof onRemove === 'function' ? onRemove(file) : onRemove).then(function (ret) {
        // Prevent removing file
        if (ret === false) {
          return;
        }

        var removedFileList = removeFileItem(file, fileList);

        if (removedFileList) {
          file.status = 'removed'; // eslint-disable-line

          if (_this.upload) {
            _this.upload.abort(file);
          }

          _this.onChange({
            file: file,
            fileList: removedFileList
          });
        }
      });
    };

    _this.onChange = function (info) {
      if (!('fileList' in _this.props)) {
        _this.setState({
          fileList: info.fileList
        });
      }

      var onChange = _this.props.onChange;

      if (onChange) {
        onChange(info);
      }
    };

    _this.onFileDrop = function (e) {
      _this.setState({
        dragState: e.type
      });
    };

    _this.beforeUpload = function (file, fileList) {
      var beforeUpload = _this.props.beforeUpload;
      var stateFileList = _this.state.fileList;

      if (!beforeUpload) {
        return true;
      }

      var result = beforeUpload(file, fileList);

      if (result === false) {
        _this.onChange({
          file: file,
          fileList: uniqBy(stateFileList.concat(fileList.map(fileToObject)), function (item) {
            return item.uid;
          })
        });

        return false;
      }

      if (result && result.then) {
        return result;
      }

      return true;
    };

    _this.renderUploadList = function (locale) {
      var _this$props = _this.props,
          showUploadList = _this$props.showUploadList,
          listType = _this$props.listType,
          onPreview = _this$props.onPreview,
          onDownload = _this$props.onDownload,
          previewFile = _this$props.previewFile,
          disabled = _this$props.disabled,
          propLocale = _this$props.locale;
      var showRemoveIcon = showUploadList.showRemoveIcon,
          showPreviewIcon = showUploadList.showPreviewIcon,
          showDownloadIcon = showUploadList.showDownloadIcon;
      var fileList = _this.state.fileList;
      return React.createElement(UploadList, {
        listType: listType,
        items: fileList,
        previewFile: previewFile,
        onPreview: onPreview,
        onDownload: onDownload,
        onRemove: _this.handleRemove,
        showRemoveIcon: !disabled && showRemoveIcon,
        showPreviewIcon: showPreviewIcon,
        showDownloadIcon: showDownloadIcon,
        locale: _extends(_extends({}, locale), propLocale)
      });
    };

    _this.renderUpload = function (_ref2) {
      var _classNames2;

      var getPrefixCls = _ref2.getPrefixCls;
      var _this$props2 = _this.props,
          customizePrefixCls = _this$props2.prefixCls,
          className = _this$props2.className,
          showUploadList = _this$props2.showUploadList,
          listType = _this$props2.listType,
          type = _this$props2.type,
          disabled = _this$props2.disabled,
          children = _this$props2.children;
      var _this$state = _this.state,
          fileList = _this$state.fileList,
          dragState = _this$state.dragState;
      var prefixCls = getPrefixCls('upload', customizePrefixCls);

      var rcUploadProps = _extends(_extends({
        onStart: _this.onStart,
        onError: _this.onError,
        onProgress: _this.onProgress,
        onSuccess: _this.onSuccess
      }, _this.props), {
        prefixCls: prefixCls,
        beforeUpload: _this.beforeUpload
      });

      delete rcUploadProps.className;
      var uploadList = showUploadList ? React.createElement(LocaleReceiver, {
        componentName: "Upload",
        defaultLocale: defaultLocale.Upload
      }, _this.renderUploadList) : null;

      if (type === 'drag') {
        var _classNames;

        var dragCls = classNames(prefixCls, (_classNames = {}, _defineProperty(_classNames, "".concat(prefixCls, "-drag"), true), _defineProperty(_classNames, "".concat(prefixCls, "-drag-uploading"), fileList.some(function (file) {
          return file.status === 'uploading';
        })), _defineProperty(_classNames, "".concat(prefixCls, "-drag-hover"), dragState === 'dragover'), _defineProperty(_classNames, "".concat(prefixCls, "-disabled"), disabled), _classNames));
        return React.createElement("span", {
          className: className
        }, React.createElement("div", {
          className: dragCls,
          onDrop: _this.onFileDrop,
          onDragOver: _this.onFileDrop,
          onDragLeave: _this.onFileDrop
        }, React.createElement(RcUpload, _extends({}, rcUploadProps, {
          ref: _this.saveUpload,
          className: "".concat(prefixCls, "-btn")
        }), React.createElement("div", {
          className: "".concat(prefixCls, "-drag-container")
        }, children))), uploadList);
      }

      var uploadButtonCls = classNames(prefixCls, (_classNames2 = {}, _defineProperty(_classNames2, "".concat(prefixCls, "-select"), true), _defineProperty(_classNames2, "".concat(prefixCls, "-select-").concat(listType), true), _defineProperty(_classNames2, "".concat(prefixCls, "-disabled"), disabled), _classNames2)); // Remove id to avoid open by label when trigger is hidden
      // https://github.com/ant-design/ant-design/issues/14298
      // https://github.com/ant-design/ant-design/issues/16478

      if (!children || disabled) {
        delete rcUploadProps.id;
      }

      var uploadButton = React.createElement("div", {
        className: uploadButtonCls,
        style: children ? undefined : {
          display: 'none'
        }
      }, React.createElement(RcUpload, _extends({}, rcUploadProps, {
        ref: _this.saveUpload
      })));

      if (listType === 'picture-card') {
        return React.createElement("span", {
          className: classNames(className, "".concat(prefixCls, "-picture-card-wrapper"))
        }, uploadList, uploadButton);
      }

      return React.createElement("span", {
        className: className
      }, uploadButton, uploadList);
    };

    _this.state = {
      fileList: props.fileList || props.defaultFileList || [],
      dragState: 'drop'
    };
    warning('fileList' in props || !('value' in props), 'Upload', '`value` is not validate prop, do you mean `fileList`?');
    return _this;
  }

  _createClass(Upload, [{
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this.clearProgressTimer();
    }
  }, {
    key: "clearProgressTimer",
    value: function clearProgressTimer() {
      clearInterval(this.progressTimer);
    }
  }, {
    key: "autoUpdateProgress",
    value: function autoUpdateProgress(_, file) {
      var _this2 = this;

      var getPercent = genPercentAdd();
      var curPercent = 0;
      this.clearProgressTimer();
      this.progressTimer = setInterval(function () {
        curPercent = getPercent(curPercent);

        _this2.onProgress({
          percent: curPercent * 100
        }, file);
      }, 200);
    }
  }, {
    key: "render",
    value: function render() {
      return React.createElement(ConfigConsumer, null, this.renderUpload);
    }
  }], [{
    key: "getDerivedStateFromProps",
    value: function getDerivedStateFromProps(nextProps) {
      if ('fileList' in nextProps) {
        return {
          fileList: nextProps.fileList || []
        };
      }

      return null;
    }
  }]);

  return Upload;
}(React.Component);

Upload.defaultProps = {
  type: 'select',
  multiple: false,
  action: '',
  data: {},
  accept: '',
  beforeUpload: T,
  showUploadList: true,
  listType: 'text',
  className: '',
  disabled: false,
  supportServerRender: true
};
polyfill(Upload);
export default Upload;
//# sourceMappingURL=Upload.js.map
