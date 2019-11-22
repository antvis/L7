"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var React = _interopRequireWildcard(require("react"));

var _rcAnimate = _interopRequireDefault(require("rc-animate"));

var _classnames = _interopRequireDefault(require("classnames"));

var _utils = require("./utils");

var _icon = _interopRequireDefault(require("../icon"));

var _tooltip = _interopRequireDefault(require("../tooltip"));

var _progress = _interopRequireDefault(require("../progress"));

var _configProvider = require("../config-provider");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

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

var UploadList =
/*#__PURE__*/
function (_React$Component) {
  _inherits(UploadList, _React$Component);

  function UploadList() {
    var _this;

    _classCallCheck(this, UploadList);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(UploadList).apply(this, arguments));

    _this.handlePreview = function (file, e) {
      var onPreview = _this.props.onPreview;

      if (!onPreview) {
        return;
      }

      e.preventDefault();
      return onPreview(file);
    };

    _this.handleDownload = function (file) {
      var onDownload = _this.props.onDownload;

      if (typeof onDownload === 'function') {
        onDownload(file);
      } else if (file.url) {
        window.open(file.url);
      }
    };

    _this.handleClose = function (file) {
      var onRemove = _this.props.onRemove;

      if (onRemove) {
        onRemove(file);
      }
    };

    _this.renderUploadList = function (_ref) {
      var _classNames3;

      var getPrefixCls = _ref.getPrefixCls;
      var _this$props = _this.props,
          customizePrefixCls = _this$props.prefixCls,
          _this$props$items = _this$props.items,
          items = _this$props$items === void 0 ? [] : _this$props$items,
          listType = _this$props.listType,
          showPreviewIcon = _this$props.showPreviewIcon,
          showRemoveIcon = _this$props.showRemoveIcon,
          showDownloadIcon = _this$props.showDownloadIcon,
          locale = _this$props.locale,
          progressAttr = _this$props.progressAttr;
      var prefixCls = getPrefixCls('upload', customizePrefixCls);
      var list = items.map(function (file) {
        var _classNames, _classNames2;

        var progress;
        var icon = React.createElement(_icon["default"], {
          type: file.status === 'uploading' ? 'loading' : 'paper-clip'
        });

        if (listType === 'picture' || listType === 'picture-card') {
          if (listType === 'picture-card' && file.status === 'uploading') {
            icon = React.createElement("div", {
              className: "".concat(prefixCls, "-list-item-uploading-text")
            }, locale.uploading);
          } else if (!file.thumbUrl && !file.url) {
            icon = React.createElement(_icon["default"], {
              className: "".concat(prefixCls, "-list-item-thumbnail"),
              type: "picture",
              theme: "twoTone"
            });
          } else {
            var thumbnail = (0, _utils.isImageUrl)(file) ? React.createElement("img", {
              src: file.thumbUrl || file.url,
              alt: file.name,
              className: "".concat(prefixCls, "-list-item-image")
            }) : React.createElement(_icon["default"], {
              type: "file",
              className: "".concat(prefixCls, "-list-item-icon"),
              theme: "twoTone"
            });
            icon = React.createElement("a", {
              className: "".concat(prefixCls, "-list-item-thumbnail"),
              onClick: function onClick(e) {
                return _this.handlePreview(file, e);
              },
              href: file.url || file.thumbUrl,
              target: "_blank",
              rel: "noopener noreferrer"
            }, thumbnail);
          }
        }

        if (file.status === 'uploading') {
          // show loading icon if upload progress listener is disabled
          var loadingProgress = 'percent' in file ? React.createElement(_progress["default"], _extends({
            type: "line"
          }, progressAttr, {
            percent: file.percent
          })) : null;
          progress = React.createElement("div", {
            className: "".concat(prefixCls, "-list-item-progress"),
            key: "progress"
          }, loadingProgress);
        }

        var infoUploadingClass = (0, _classnames["default"])((_classNames = {}, _defineProperty(_classNames, "".concat(prefixCls, "-list-item"), true), _defineProperty(_classNames, "".concat(prefixCls, "-list-item-").concat(file.status), true), _defineProperty(_classNames, "".concat(prefixCls, "-list-item-list-type-").concat(listType), true), _classNames));
        var linkProps = typeof file.linkProps === 'string' ? JSON.parse(file.linkProps) : file.linkProps;
        var removeIcon = showRemoveIcon ? React.createElement(_icon["default"], {
          type: "delete",
          title: locale.removeFile,
          onClick: function onClick() {
            return _this.handleClose(file);
          }
        }) : null;
        var downloadIcon = showDownloadIcon && file.status === 'done' ? React.createElement(_icon["default"], {
          type: "download",
          title: locale.downloadFile,
          onClick: function onClick() {
            return _this.handleDownload(file);
          }
        }) : null;
        var downloadOrDelete = listType !== 'picture-card' && React.createElement("span", {
          key: "download-delete",
          className: "".concat(prefixCls, "-list-item-card-actions ").concat(listType === 'picture' ? 'picture' : '')
        }, downloadIcon && React.createElement("a", {
          title: locale.downloadFile
        }, downloadIcon), removeIcon && React.createElement("a", {
          title: locale.removeFile
        }, removeIcon));
        var listItemNameClass = (0, _classnames["default"])((_classNames2 = {}, _defineProperty(_classNames2, "".concat(prefixCls, "-list-item-name"), true), _defineProperty(_classNames2, "".concat(prefixCls, "-list-item-name-icon-count-").concat([downloadIcon, removeIcon].filter(function (x) {
          return x;
        }).length), true), _classNames2));
        var preview = file.url ? [React.createElement("a", _extends({
          key: "view",
          target: "_blank",
          rel: "noopener noreferrer",
          className: listItemNameClass,
          title: file.name
        }, linkProps, {
          href: file.url,
          onClick: function onClick(e) {
            return _this.handlePreview(file, e);
          }
        }), file.name), downloadOrDelete] : [React.createElement("span", {
          key: "view",
          className: listItemNameClass,
          onClick: function onClick(e) {
            return _this.handlePreview(file, e);
          },
          title: file.name
        }, file.name), downloadOrDelete];
        var style = {
          pointerEvents: 'none',
          opacity: 0.5
        };
        var previewIcon = showPreviewIcon ? React.createElement("a", {
          href: file.url || file.thumbUrl,
          target: "_blank",
          rel: "noopener noreferrer",
          style: file.url || file.thumbUrl ? undefined : style,
          onClick: function onClick(e) {
            return _this.handlePreview(file, e);
          },
          title: locale.previewFile
        }, React.createElement(_icon["default"], {
          type: "eye-o"
        })) : null;
        var actions = listType === 'picture-card' && file.status !== 'uploading' && React.createElement("span", {
          className: "".concat(prefixCls, "-list-item-actions")
        }, previewIcon, file.status === 'done' && downloadIcon, removeIcon);
        var message;

        if (file.response && typeof file.response === 'string') {
          message = file.response;
        } else {
          message = file.error && file.error.statusText || locale.uploadError;
        }

        var iconAndPreview = React.createElement("span", null, icon, preview);
        var dom = React.createElement("div", {
          className: infoUploadingClass
        }, React.createElement("div", null, React.createElement("div", {
          className: "".concat(prefixCls, "-list-item-info")
        }, iconAndPreview), actions, React.createElement(_rcAnimate["default"], {
          transitionName: "fade",
          component: ""
        }, progress)));
        return React.createElement("div", {
          key: file.uid
        }, file.status === 'error' ? React.createElement(_tooltip["default"], {
          title: message
        }, dom) : React.createElement("span", null, dom));
      });
      var listClassNames = (0, _classnames["default"])((_classNames3 = {}, _defineProperty(_classNames3, "".concat(prefixCls, "-list"), true), _defineProperty(_classNames3, "".concat(prefixCls, "-list-").concat(listType), true), _classNames3));
      var animationDirection = listType === 'picture-card' ? 'animate-inline' : 'animate';
      return React.createElement(_rcAnimate["default"], {
        transitionName: "".concat(prefixCls, "-").concat(animationDirection),
        component: "div",
        className: listClassNames
      }, list);
    };

    return _this;
  }

  _createClass(UploadList, [{
    key: "componentDidUpdate",
    value: function componentDidUpdate() {
      var _this2 = this;

      var _this$props2 = this.props,
          listType = _this$props2.listType,
          items = _this$props2.items,
          previewFile = _this$props2.previewFile;

      if (listType !== 'picture' && listType !== 'picture-card') {
        return;
      }

      (items || []).forEach(function (file) {
        if (typeof document === 'undefined' || typeof window === 'undefined' || !window.FileReader || !window.File || !(file.originFileObj instanceof File || file.originFileObj instanceof Blob) || file.thumbUrl !== undefined) {
          return;
        }

        file.thumbUrl = '';

        if (previewFile) {
          previewFile(file.originFileObj).then(function (previewDataUrl) {
            // Need append '' to avoid dead loop
            file.thumbUrl = previewDataUrl || '';

            _this2.forceUpdate();
          });
        }
      });
    }
  }, {
    key: "render",
    value: function render() {
      return React.createElement(_configProvider.ConfigConsumer, null, this.renderUploadList);
    }
  }]);

  return UploadList;
}(React.Component);

exports["default"] = UploadList;
UploadList.defaultProps = {
  listType: 'text',
  progressAttr: {
    strokeWidth: 2,
    showInfo: false
  },
  showRemoveIcon: true,
  showDownloadIcon: true,
  showPreviewIcon: true,
  previewFile: _utils.previewImage
};
//# sourceMappingURL=UploadList.js.map
