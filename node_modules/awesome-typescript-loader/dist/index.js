"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _ = require("lodash");
var path = require("path");
var cache_1 = require("./cache");
var helpers = require("./helpers");
var instance_1 = require("./instance");
var paths_plugin_1 = require("./paths-plugin");
var watch_mode_1 = require("./watch-mode");
var loaderUtils = require('loader-utils');
function loader(text) {
    try {
        compiler.call(undefined, this, text);
    }
    catch (e) {
        console.error(e, e.stack);
        throw e;
    }
}
(function (loader) {
    loader.TsConfigPathsPlugin = paths_plugin_1.PathPlugin;
    loader.CheckerPlugin = watch_mode_1.CheckerPlugin;
})(loader || (loader = {}));
var DECLARATION = /\.d.ts$/i;
function compiler(loader, text) {
    var _this = this;
    if (loader.cacheable) {
        loader.cacheable();
    }
    var rootCompiler = instance_1.getRootCompiler(loader._compiler);
    var query = (loaderUtils.getOptions(loader) || {});
    var options = (loader.options && loader.options.ts) || {};
    var instanceName = query.instance || 'at-loader';
    var instance = instance_1.ensureInstance(loader, query, options, instanceName, rootCompiler);
    var callback = loader.async();
    var fileName = helpers.toUnix(loader.resourcePath);
    instance.compiledFiles[fileName] = true;
    if (DECLARATION.test(fileName)) {
        loader.emitWarning(new Error("[" + instanceName + "] TypeScript declaration files should never be required"));
        return callback(null, '');
    }
    var compiledModule;
    if (instance.loaderConfig.usePrecompiledFiles) {
        compiledModule = cache_1.findCompiledModule(fileName);
    }
    var transformation = null;
    if (compiledModule) {
        transformation = Promise.resolve({
            deps: [],
            text: compiledModule.text,
            map: compiledModule.map ? JSON.parse(compiledModule.map) : null
        }).then(function (result) { return ({ cached: true, result: result }); });
    }
    else {
        var transformationFunction = function () { return transform(loader, instance, fileName, text); };
        if (instance.loaderConfig.useCache) {
            transformation = cache_1.cache({
                source: text,
                identifier: instance.cacheIdentifier,
                directory: instance.loaderConfig.cacheDirectory,
                options: loader.query,
                transform: transformationFunction
            });
        }
        else {
            transformation = transformationFunction().then(function (result) { return ({ cached: false, result: result }); });
        }
    }
    transformation
        .then(function (_a) {
        var cached = _a.cached, result = _a.result;
        return __awaiter(_this, void 0, void 0, function () {
            var isolated, updated;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        isolated = instance.loaderConfig.forceIsolatedModules ||
                            instance.compilerConfig.options.isolatedModules;
                        if (!isolated && result.deps) {
                            result.deps.forEach(function (dep) { return loader.addDependency(path.normalize(dep)); });
                        }
                        if (!cached) return [3, 2];
                        return [4, instance.checker.updateFile(fileName, text)];
                    case 1:
                        updated = _b.sent();
                        if (updated) {
                            if (typeof loader._module.meta.tsLoaderFileVersion === 'number') {
                                loader._module.meta.tsLoaderFileVersion++;
                            }
                            else {
                                loader._module.meta.tsLoaderFileVersion = 0;
                            }
                        }
                        _b.label = 2;
                    case 2: return [2, result];
                }
            });
        });
    })
        .then(function (_a) {
        var text = _a.text, map = _a.map;
        callback(null, text, map);
    })
        .catch(callback)
        .catch(function (e) {
        console.error('Error in bail mode:', e, e.stack.join ? e.stack.join('\n') : e.stack);
        process.exit(1);
    });
}
function transform(webpack, instance, fileName, text) {
    var resultText;
    var resultSourceMap = null;
    return instance.checker.emitFile(fileName, text).then(function (_a) {
        var emitResult = _a.emitResult, deps = _a.deps;
        resultSourceMap = emitResult.sourceMap;
        resultText = emitResult.text;
        var sourceFileName = fileName.replace(instance.context + '/', '');
        if (resultSourceMap) {
            resultSourceMap = JSON.parse(resultSourceMap);
            resultSourceMap.sources = [sourceFileName];
            resultSourceMap.file = sourceFileName;
            resultSourceMap.sourcesContent = [text];
            resultText = resultText.replace(/^\/\/# sourceMappingURL=[^\r\n]*/gm, '');
        }
        if (instance.loaderConfig.useBabel) {
            var defaultOptions = {
                inputSourceMap: resultSourceMap,
                sourceRoot: instance.context,
                filename: fileName,
                sourceMap: true
            };
            var babelOptions = _.assign({}, defaultOptions, instance.loaderConfig.babelOptions);
            var babelResult = instance.babelImpl.transform(resultText, babelOptions);
            resultText = babelResult.code;
            resultSourceMap = babelResult.map;
        }
        if (resultSourceMap) {
            var sourcePath = path.relative(instance.compilerConfig.options.sourceRoot || instance.context, loaderUtils.getRemainingRequest(webpack));
            resultSourceMap.sources = [sourcePath];
            resultSourceMap.file = fileName;
            resultSourceMap.sourcesContent = [text];
        }
        if (emitResult.declaration) {
            instance.compiledDeclarations.push(emitResult.declaration);
        }
        return {
            text: resultText,
            map: resultSourceMap,
            deps: deps
        };
    });
}
module.exports = loader;
//# sourceMappingURL=index.js.map