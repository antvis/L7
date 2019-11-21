'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _ajaxGet = require('./ajaxGet');

var _ajaxGet2 = _interopRequireDefault(_ajaxGet);

var _utils = require('./utils');

var utils = _interopRequireWildcard(_utils);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj["default"] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _defaults(obj, defaults) { var keys = Object.getOwnPropertyNames(defaults); for (var i = 0; i < keys.length; i++) { var key = keys[i]; var value = Object.getOwnPropertyDescriptor(defaults, key); if (value && value.configurable && obj[key] === undefined) { Object.defineProperty(obj, key, value); } } return obj; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : _defaults(subClass, superClass); }

var typeToLabel = {
  stargazers: 'Star',
  watchers: 'Watch',
  forks: 'Fork'
};

var typeToPath = {
  forks: 'network'
};

var GitHubButton = function (_React$Component) {
  _inherits(GitHubButton, _React$Component);

  function GitHubButton() {
    var _temp, _this, _ret;

    _classCallCheck(this, GitHubButton);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, _React$Component.call.apply(_React$Component, [this].concat(args))), _this), _this.state = {
      count: null
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  GitHubButton.prototype.componentDidMount = function componentDidMount() {
    var _this2 = this;

    this.xhr = (0, _ajaxGet2["default"])(this.getRequestUrl(), function (response) {
      _this2.setCount(response);
    });
  };

  GitHubButton.prototype.componentWillUnmount = function componentWillUnmount() {
    if (this.xhr) {
      this.xhr.abort();
    }
  };

  GitHubButton.prototype.setCount = function setCount(data) {
    if (!data) return;
    var count = data[this.props.type + '_count'];
    this.setState({ count: count });
  };

  GitHubButton.prototype.getRequestUrl = function getRequestUrl() {
    var _props = this.props,
        namespace = _props.namespace,
        repo = _props.repo;

    return '//api.github.com/repos/' + namespace + '/' + repo;
  };

  GitHubButton.prototype.getRepoUrl = function getRepoUrl() {
    var _props2 = this.props,
        namespace = _props2.namespace,
        repo = _props2.repo;

    return '//github.com/' + namespace + '/' + repo + '/';
  };

  GitHubButton.prototype.getCountUrl = function getCountUrl() {
    var _props3 = this.props,
        namespace = _props3.namespace,
        repo = _props3.repo,
        type = _props3.type;

    return '//github.com/' + namespace + '/' + repo + '/' + (typeToPath[type] || type) + '/';
  };

  GitHubButton.prototype.getCountStyle = function getCountStyle() {
    var count = this.state.count;
    if (count !== null) {
      return {
        display: 'block'
      };
    }
    return null;
  };

  GitHubButton.prototype.render = function render() {
    var _props4 = this.props,
        className = _props4.className,
        type = _props4.type,
        size = _props4.size,
        rest = _objectWithoutProperties(_props4, ['className', 'type', 'size']);

    delete rest.namespace;
    delete rest.repo;

    var count = this.state.count;

    var buttonClassName = utils.classNames(_defineProperty({
      'github-btn': true,
      'github-btn-large': size === 'large'
    }, className, className));

    return _react2["default"].createElement(
      'span',
      _extends({}, rest, { className: buttonClassName }),
      _react2["default"].createElement(
        'a',
        { className: 'gh-btn', href: this.getRepoUrl(), target: '_blank' },
        _react2["default"].createElement('span', { className: 'gh-ico', 'aria-hidden': 'true' }),
        _react2["default"].createElement(
          'span',
          { className: 'gh-text' },
          typeToLabel[type]
        )
      ),
      _react2["default"].createElement(
        'a',
        { className: 'gh-count', target: '_blank',
          href: this.getCountUrl(),
          style: this.getCountStyle()
        },
        count
      )
    );
  };

  return GitHubButton;
}(_react2["default"].Component);

GitHubButton.displayName = 'GitHubButton';
GitHubButton.propTypes = {
  className: _propTypes2["default"].string,
  type: _propTypes2["default"].oneOf(['stargazers', 'watchers', 'forks']).isRequired,
  namespace: _propTypes2["default"].string.isRequired,
  repo: _propTypes2["default"].string.isRequired,
  size: _propTypes2["default"].oneOf(['large'])
};
exports["default"] = GitHubButton;
module.exports = exports['default'];