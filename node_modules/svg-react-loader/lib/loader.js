var R          = require('ramda');
var path       = require('path');
var lutils     = require('loader-utils');
var svgToReact = require('./index');
var titleCase  = require('./util/title-case');

function titleCaseBasename (filepath, delim) {
    var ext = path.extname(filepath);
    var base = path.basename(filepath, ext);
    return titleCase(delim)(base);
}

function mapKeyValue (acc, cur) {
    var keyValue = cur.split(':');
    acc[keyValue[0]] = keyValue[1];
    return acc;
}

module.exports = function svgReactLoader (source) {
    var context   = this;
    var callback  = context.async();
    var ctxOpts   = context.svgReactLoader;
    var filters   = ctxOpts && ctxOpts.filters || [];
    var query     = lutils.getOptions(context);
    var rsrcQuery = context.resourceQuery && lutils.parseQuery(context.resourceQuery);
    var params    = R.merge(query || {}, rsrcQuery || {});

    var titleCaseDelim = params.titleCaseDelim || /[._-]/;
    var displayName    = params.name || titleCaseBasename(context.resourcePath, titleCaseDelim);
    var tagname        = params.tag;
    var tagprops       = params.props || params.attrs;
    var propsMap       = params.propsMap || {};
    var raw            = params.raw;
    var xmlnsTest      = params.xmlnsTest;
    var classIdPrefix  = params.classIdPrefix || false;

    context.cacheable();

    var options = { displayName: displayName };

    if (typeof raw !== 'undefined') {
        options.raw = raw;
    }

    if (typeof xmlnsTest === 'string') {
        options.xmlnsTest = new RegExp(xmlnsTest);
    }

    if (Array.isArray(tagprops)) {
        tagprops =
            tagprops.
            reduce(mapKeyValue, {});
    }

    if (tagname || tagprops) {
        options.root = {};
        if (tagname) {
            options.root.tagname = tagname;
        }
        if (tagprops) {
            options.root.props = tagprops;
        }
    }

    options.propsMap = Array.isArray(propsMap)?
        propsMap.reduce(mapKeyValue, {}) : propsMap;

    options.classIdPrefix =
        classIdPrefix === true ?
            displayName + '__' :
            typeof classIdPref === 'string' ?
                lutils.interpolatename(context, classIdPrefix) :
                classIdPrefix;

    if (params.filters) {
        filters =
            filters.
            concat(
                params.
                filters.
                map(function (name) {
                    return typeof name === 'function' ?
                        name :
                        require(context.resolveSync(context.context, name));
                })
            );
    }

    options.filters = filters;

    svgToReact(options, source).
        subscribe(
            function (result) { callback(null, result); },
            callback
        );
};
