'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.onCreatePage = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _defaultOptions = require('./defaultOptions');

var _defaultOptions2 = _interopRequireDefault(_defaultOptions);

var _getNewPage = require('./getNewPage');

var _ptzI18n = require('ptz-i18n');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Add context.slug and .langKey for react props
 * @param {*} args args
 * @param {*} pluginOptions plugin options from gatsby-config.js
 * @returns {Promise} Promise
 */
var onCreatePage = function onCreatePage(_ref, pluginOptions) {
  var page = _ref.page,
      actions = _ref.actions;

  if (page.context.slug) {
    return 'Skipping page already has slug'; // Allow only pages without slug
  }

  var options = _extends({}, _defaultOptions2.default, pluginOptions);

  return (0, _ptzI18n.isInPagesPaths)(options, page.componentPath).map(function (isInPaths) {
    if (isInPaths === false) {
      return 'Skipping page, not in pagesPaths';
    }

    var createPage = actions.createPage,
        deletePage = actions.deletePage;


    var newPage = (0, _getNewPage.getNewPage)(page, options);

    deletePage(page);

    if (page.path === '/404.html') {
      createPage(_extends({}, newPage, {
        path: '/404.html'
      }));
    } else {
      createPage(newPage);
    }

    return 'Page created';
  }).mapError(function (error) {
    var errorMsg = 'Error gatsby-plugin-i18n onCreatePage: ' + error;
    console.log(errorMsg);
    return errorMsg;
  }).merge();
};

exports.onCreatePage = onCreatePage;