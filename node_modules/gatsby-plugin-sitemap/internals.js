"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.defaultOptions = exports.runQuery = exports.renameFile = exports.writeFile = exports.withoutTrailingSlash = void 0;

var _fs = _interopRequireDefault(require("fs"));

var _pify = _interopRequireDefault(require("pify"));

var _minimatch = _interopRequireDefault(require("minimatch"));

var withoutTrailingSlash = function withoutTrailingSlash(path) {
  return path === "/" ? path : path.replace(/\/$/, "");
};

exports.withoutTrailingSlash = withoutTrailingSlash;
var writeFile = (0, _pify["default"])(_fs["default"].writeFile);
exports.writeFile = writeFile;
var renameFile = (0, _pify["default"])(_fs["default"].rename);
exports.renameFile = renameFile;

var runQuery = function runQuery(handler, query, excludes, pathPrefix) {
  return handler(query).then(function (r) {
    if (r.errors) {
      throw new Error(r.errors.join(", "));
    } // Removing excluded paths


    r.data.allSitePage.edges = r.data.allSitePage.edges.filter(function (page) {
      return !excludes.some(function (excludedRoute) {
        return (0, _minimatch["default"])(withoutTrailingSlash(page.node.path), excludedRoute);
      });
    }); // Add path prefix

    r.data.allSitePage.edges = r.data.allSitePage.edges.map(function (page) {
      page.node.path = (pathPrefix + page.node.path).replace(/^\/\//g, "/");
      return page;
    }); // siteUrl Validation

    if (!r.data.site.siteMetadata.siteUrl || r.data.site.siteMetadata.siteUrl.trim().length == 0) {
      throw new Error("SiteMetaData 'siteUrl' property is required and cannot be left empty. Check out the documentation to see a working example: https://www.gatsbyjs.org/packages/gatsby-plugin-sitemap/#how-to-use");
    } // remove trailing slash of siteUrl


    r.data.site.siteMetadata.siteUrl = withoutTrailingSlash(r.data.site.siteMetadata.siteUrl);
    return r.data;
  });
};

exports.runQuery = runQuery;
var defaultOptions = {
  query: "\n    {\n      site {\n        siteMetadata {\n          siteUrl\n        }\n      }\n\n      allSitePage {\n        edges {\n          node {\n            path\n          }\n        }\n      }\n  }",
  output: "/sitemap.xml",
  exclude: ["/dev-404-page", "/404", "/404.html", "/offline-plugin-app-shell-fallback"],
  createLinkInHead: true,
  serialize: function serialize(_ref) {
    var site = _ref.site,
        allSitePage = _ref.allSitePage;
    return allSitePage.edges.map(function (edge) {
      return {
        url: site.siteMetadata.siteUrl + edge.node.path,
        changefreq: "daily",
        priority: 0.7
      };
    });
  }
};
exports.defaultOptions = defaultOptions;