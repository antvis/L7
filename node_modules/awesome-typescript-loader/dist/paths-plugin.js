"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var instance_1 = require("./instance");
var path = require("path");
var _ = require("lodash");
var ModulesInRootPlugin = require('enhanced-resolve/lib/ModulesInRootPlugin');
var getInnerRequest = require('enhanced-resolve/lib/getInnerRequest');
function escapeRegExp(str) {
    return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
}
var PathPlugin = (function () {
    function PathPlugin(config) {
        if (config === void 0) { config = {}; }
        var _this = this;
        this.ts = instance_1.setupTs(config.compiler).tsImpl;
        var context = config.context || process.cwd();
        var _a = instance_1.readConfigFile(context, config, {}, this.ts), configFilePath = _a.configFilePath, compilerConfig = _a.compilerConfig;
        this.options = compilerConfig.options;
        this.configFilePath = configFilePath;
        this.baseUrl = this.options.baseUrl;
        this.absoluteBaseUrl = path.resolve(path.dirname(this.configFilePath), this.baseUrl || '.');
        this.mappings = [];
        var paths = this.options.paths || {};
        Object.keys(paths).forEach(function (alias) {
            var onlyModule = alias.indexOf('*') === -1;
            var excapedAlias = escapeRegExp(alias);
            var targets = paths[alias];
            targets.forEach(function (target) {
                var aliasPattern;
                if (onlyModule) {
                    aliasPattern = new RegExp("^" + excapedAlias + "$");
                }
                else {
                    var withStarCapturing = excapedAlias.replace('\\*', '(.*)');
                    aliasPattern = new RegExp("^" + withStarCapturing);
                }
                _this.mappings.push({
                    onlyModule: onlyModule,
                    alias: alias,
                    aliasPattern: aliasPattern,
                    target: target
                });
            });
        });
    }
    PathPlugin.prototype.apply = function (resolver) {
        var _this = this;
        var _a = this, baseUrl = _a.baseUrl, mappings = _a.mappings;
        if (baseUrl) {
            new ModulesInRootPlugin('module', this.absoluteBaseUrl, 'resolve').apply(resolver);
        }
        mappings.forEach(function (mapping) {
            if (!_this.isTyping(mapping.target)) {
                resolver.hooks.describedResolve.tapAsync('at-loader', _this.createPlugin(resolver, mapping));
            }
        });
    };
    PathPlugin.prototype.isTyping = function (target) {
        return target.indexOf('@types') !== -1 || target.indexOf('.d.ts') !== -1;
    };
    PathPlugin.prototype.createPlugin = function (resolver, mapping) {
        var _this = this;
        return function (request, resolveContext, callback) {
            var innerRequest = getInnerRequest(resolver, request);
            if (!innerRequest) {
                return callback();
            }
            var match = innerRequest.match(mapping.aliasPattern);
            if (!match) {
                return callback();
            }
            var newRequestStr = mapping.target;
            if (!mapping.onlyModule) {
                newRequestStr = newRequestStr.replace('*', match[1]);
            }
            if (newRequestStr[0] === '.') {
                newRequestStr = path.resolve(_this.absoluteBaseUrl, newRequestStr);
            }
            var newRequest = _.extend({}, request, {
                request: newRequestStr
            });
            var target = resolver.ensureHook('resolve');
            return resolver.doResolve(target, newRequest, "aliased with mapping '" +
                innerRequest +
                "': '" +
                mapping.alias +
                "' to '" +
                newRequestStr +
                "'", resolveContext, callback);
        };
    };
    return PathPlugin;
}());
exports.PathPlugin = PathPlugin;
//# sourceMappingURL=paths-plugin.js.map