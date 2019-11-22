'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getNewPage = undefined;

var _ptzI18n = require('ptz-i18n');

/**
 * Get a new page with langKey, slug and layout
 * @param {*} oldPage page created before by other plugins
 * @param {{langKeyDefault:string, useLangKeyLayout:boolean}} options default options + user options
 * @return {*} new page
 */
var getNewPage = function getNewPage(oldPage, options) {
  var slugAndLang = (0, _ptzI18n.getSlugAndLang)(options, oldPage.componentPath);

  return Object.assign({}, oldPage, {
    path: slugAndLang.slug,
    context: {
      slug: slugAndLang.slug,
      langKey: slugAndLang.langKey
    },
    layout: options.useLangKeyLayout ? slugAndLang.langKey : oldPage.layout
  });
};

exports.getNewPage = getNewPage;