"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _objectWithoutPropertiesLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutPropertiesLoose"));

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _path = _interopRequireDefault(require("path"));

var _sitemap = _interopRequireDefault(require("sitemap"));

var _internals = require("./internals");

var publicPath = "./public";

exports.onPostBuild = function _callee(_ref, pluginOptions) {
  var graphql, pathPrefix, _ref$basePath, basePath, options, _defaultOptions$optio, query, serialize, output, exclude, hostname, rest, saved, excludeOptions, queryRecords, urls, map, siteUrl;

  return _regenerator["default"].async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          graphql = _ref.graphql, pathPrefix = _ref.pathPrefix, _ref$basePath = _ref.basePath, basePath = _ref$basePath === void 0 ? pathPrefix : _ref$basePath;
          options = (0, _extends2["default"])({}, pluginOptions);
          delete options.plugins;
          delete options.createLinkInHead;
          _defaultOptions$optio = (0, _extends2["default"])({}, _internals.defaultOptions, {}, options), query = _defaultOptions$optio.query, serialize = _defaultOptions$optio.serialize, output = _defaultOptions$optio.output, exclude = _defaultOptions$optio.exclude, hostname = _defaultOptions$optio.hostname, rest = (0, _objectWithoutPropertiesLoose2["default"])(_defaultOptions$optio, ["query", "serialize", "output", "exclude", "hostname"]);
          saved = _path["default"].join(publicPath, output); // Paths we're excluding...

          excludeOptions = exclude.concat(_internals.defaultOptions.exclude);
          _context.next = 9;
          return _regenerator["default"].awrap((0, _internals.runQuery)(graphql, query, excludeOptions, basePath));

        case 9:
          queryRecords = _context.sent;
          urls = serialize(queryRecords);

          if (!(!rest.sitemapSize || urls.length <= rest.sitemapSize)) {
            _context.next = 15;
            break;
          }

          map = _sitemap["default"].createSitemap(rest);
          urls.forEach(function (u) {
            return map.add(u);
          });
          return _context.abrupt("return", (0, _internals.writeFile)(saved, map.toString()));

        case 15:
          siteUrl = queryRecords.site.siteMetadata.siteUrl;
          return _context.abrupt("return", new Promise(function (resolve) {
            // sitemap-index.xml is default file name. (https://git.io/fhNgG)
            var indexFilePath = _path["default"].join(publicPath, (rest.sitemapName || "sitemap") + "-index.xml");

            var sitemapIndexOptions = (0, _extends2["default"])({}, rest, {
              hostname: (hostname || (0, _internals.withoutTrailingSlash)(siteUrl)) + (0, _internals.withoutTrailingSlash)(pathPrefix || ""),
              targetFolder: publicPath,
              urls: urls,
              callback: function callback(error) {
                if (error) throw new Error(error);
                (0, _internals.renameFile)(indexFilePath, saved).then(resolve);
              }
            });

            _sitemap["default"].createSitemapIndex(sitemapIndexOptions);
          }));

        case 17:
        case "end":
          return _context.stop();
      }
    }
  });
};