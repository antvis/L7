"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var path = require("path");
var _ = require("lodash");
var weblog = require("webpack-log");
var helpers_1 = require("./helpers");
var checker_1 = require("./checker");
var watch_mode_1 = require("./watch-mode");
var crypto_1 = require("crypto");
var chalk_1 = require("chalk");
var log = weblog({ name: 'atl' });
var pkg = require('../package.json');
var mkdirp = require('mkdirp');
var enhancedResolve = require('enhanced-resolve');
function getRootCompiler(compiler) {
    if (compiler.parentCompilation) {
        return getRootCompiler(compiler.parentCompilation.compiler);
    }
    else {
        return compiler;
    }
}
exports.getRootCompiler = getRootCompiler;
function resolveInstance(compiler, instanceName) {
    if (!compiler._tsInstances) {
        compiler._tsInstances = {};
    }
    return compiler._tsInstances[instanceName];
}
var COMPILER_ERROR = chalk_1.default.red("\n\nTypescript compiler cannot be found, please add it to your package.json file:\n    npm install --save-dev typescript\n");
var BABEL_ERROR = chalk_1.default.red("\n\nBabel compiler cannot be found, please add it to your package.json file:\n    npm install --save-dev babel-core\n");
var id = 0;
function ensureInstance(webpack, query, options, instanceName, rootCompiler) {
    var exInstance = resolveInstance(rootCompiler, instanceName);
    if (exInstance) {
        return exInstance;
    }
    var watching = isWatching(rootCompiler);
    var context = options.context || process.cwd();
    var compilerInfo = setupTs(query.compiler);
    var tsImpl = compilerInfo.tsImpl;
    var _a = readConfigFile(context, query, options, tsImpl), configFilePath = _a.configFilePath, compilerConfig = _a.compilerConfig, loaderConfig = _a.loaderConfig;
    applyDefaults(configFilePath, compilerConfig, loaderConfig, context);
    if (!loaderConfig.silent) {
        var tscVersion = compilerInfo.compilerVersion;
        var tscPath = compilerInfo.compilerPath;
        log.info("Using typescript@" + chalk_1.default.bold(tscVersion) + " from " + chalk_1.default.bold(tscPath));
        var sync = watching === WatchMode.Enabled ? ' (in a forked process)' : '';
        log.info("Using " + chalk_1.default.bold('tsconfig.json') + " from " + chalk_1.default.bold(configFilePath) + sync);
    }
    var babelImpl = setupBabel(loaderConfig, context);
    var cacheIdentifier = setupCache(compilerConfig, loaderConfig, tsImpl, webpack, babelImpl, context);
    var compiler = webpack._compiler;
    if (!rootCompiler.hooks) {
        throw new Error("It looks like you're using an old webpack version without hooks support. " +
            "If you're using awesome-script-loader with React storybooks consider " +
            'upgrading @storybook/react to at least version 4.0.0-alpha.3');
    }
    setupWatchRun(compiler, instanceName);
    setupAfterCompile(compiler, instanceName);
    var webpackOptions = _.pick(webpack._compiler.options, 'resolve');
    var checker = new checker_1.Checker(compilerInfo, loaderConfig, compilerConfig, webpackOptions, context, watching === WatchMode.Enabled);
    return (rootCompiler._tsInstances[instanceName] = {
        id: ++id,
        babelImpl: babelImpl,
        compiledFiles: {},
        compiledDeclarations: [],
        loaderConfig: loaderConfig,
        configFilePath: configFilePath,
        compilerConfig: compilerConfig,
        checker: checker,
        cacheIdentifier: cacheIdentifier,
        context: context,
        times: {}
    });
}
exports.ensureInstance = ensureInstance;
function findTsImplPackage(inputPath) {
    var pkgDir = path.dirname(inputPath);
    if (fs.readdirSync(pkgDir).find(function (value) { return value === 'package.json'; })) {
        return path.join(pkgDir, 'package.json');
    }
    else {
        return findTsImplPackage(pkgDir);
    }
}
function setupTs(compiler) {
    var compilerPath = compiler || 'typescript';
    var tsImpl;
    var tsImplPath;
    try {
        tsImplPath = require.resolve(compilerPath);
        tsImpl = require(tsImplPath);
    }
    catch (e) {
        console.error(e);
        console.error(COMPILER_ERROR);
        process.exit(1);
    }
    var pkgPath = findTsImplPackage(tsImplPath);
    var compilerVersion = require(pkgPath).version;
    var compilerInfo = {
        compilerPath: compilerPath,
        compilerVersion: compilerVersion,
        tsImpl: tsImpl
    };
    return compilerInfo;
}
exports.setupTs = setupTs;
function setupCache(compilerConfig, loaderConfig, tsImpl, webpack, babelImpl, context) {
    if (loaderConfig.useCache) {
        if (!loaderConfig.cacheDirectory) {
            loaderConfig.cacheDirectory = path.join(context, '.awcache');
        }
        if (!fs.existsSync(loaderConfig.cacheDirectory)) {
            mkdirp.sync(loaderConfig.cacheDirectory);
        }
        var hash = crypto_1.createHash('sha512');
        var contents = JSON.stringify({
            typescript: tsImpl.version,
            'awesome-typescript-loader': pkg.version,
            'babel-core': babelImpl ? babelImpl.version : null,
            babelPkg: pkg.babel,
            compilerConfig: compilerConfig,
            env: process.env.BABEL_ENV || process.env.NODE_ENV || 'development'
        });
        hash.end(contents);
        return hash.read().toString('hex');
    }
}
var resolver = enhancedResolve.create.sync();
function setupBabel(loaderConfig, context) {
    var babelImpl;
    if (loaderConfig.useBabel) {
        try {
            var babelPath = loaderConfig.babelCore || resolver(context, 'babel-core');
            babelImpl = require(babelPath);
        }
        catch (e) {
            console.error(BABEL_ERROR, e);
            process.exit(1);
        }
    }
    return babelImpl;
}
function applyDefaults(configFilePath, compilerConfig, loaderConfig, context) {
    var def = {
        sourceMap: true,
        verbose: false,
        skipDefaultLibCheck: true,
        suppressOutputPathCheck: true
    };
    if (compilerConfig.options.outDir && compilerConfig.options.declaration) {
        def.declarationDir = compilerConfig.options.outDir;
    }
    _.defaults(compilerConfig.options, def);
    if (loaderConfig.transpileOnly) {
        compilerConfig.options.isolatedModules = true;
    }
    _.defaults(compilerConfig.options, {
        sourceRoot: compilerConfig.options.sourceMap ? context : undefined
    });
    _.defaults(loaderConfig, {
        sourceMap: true,
        verbose: false
    });
    delete compilerConfig.options.outDir;
    delete compilerConfig.options.outFile;
    delete compilerConfig.options.out;
    delete compilerConfig.options.noEmit;
}
function absolutize(fileName, context) {
    if (path.isAbsolute(fileName)) {
        return fileName;
    }
    else {
        return path.join(context, fileName);
    }
}
function readConfigFile(context, query, options, tsImpl) {
    var configFilePath;
    if (query.configFileName && query.configFileName.match(/\.json$/)) {
        configFilePath = helpers_1.toUnix(absolutize(query.configFileName, context));
    }
    else {
        configFilePath = tsImpl.findConfigFile(context, tsImpl.sys.fileExists);
    }
    var existingOptions = tsImpl.convertCompilerOptionsFromJson(query, context, 'atl.query');
    if (!configFilePath || query.configFileContent) {
        return {
            configFilePath: configFilePath || helpers_1.toUnix(path.join(context, 'tsconfig.json')),
            compilerConfig: tsImpl.parseJsonConfigFileContent(query.configFileContent || {}, tsImpl.sys, context, _.extend({}, tsImpl.getDefaultCompilerOptions(), existingOptions.options), context),
            loaderConfig: query
        };
    }
    var jsonConfigFile = tsImpl.readConfigFile(configFilePath, tsImpl.sys.readFile);
    var compilerConfig = tsImpl.parseJsonConfigFileContent(jsonConfigFile.config, tsImpl.sys, path.dirname(configFilePath), existingOptions.options, configFilePath);
    return {
        configFilePath: configFilePath,
        compilerConfig: compilerConfig,
        loaderConfig: _.defaults(query, jsonConfigFile.config.awesomeTypescriptLoaderOptions, options)
    };
}
exports.readConfigFile = readConfigFile;
var EXTENSIONS = /\.tsx?$|\.jsx?$/;
var filterMtimes = function (mtimes) {
    var res = {};
    Object.keys(mtimes).forEach(function (fileName) {
        if (!!EXTENSIONS.test(fileName)) {
            res[fileName] = mtimes[fileName];
        }
    });
    return res;
};
function setupWatchRun(compiler, instanceName) {
    compiler.hooks.watchRun.tapAsync('at-loader', function (compiler, callback) {
        var instance = resolveInstance(compiler, instanceName);
        var checker = instance.checker;
        var watcher = compiler.watchFileSystem.watcher || compiler.watchFileSystem.wfs.watcher;
        var startTime = instance.startTime || compiler.startTime;
        var times = filterMtimes(watcher.getTimes());
        var lastCompiled = instance.compiledFiles;
        instance.compiledFiles = {};
        instance.compiledDeclarations = [];
        instance.startTime = startTime;
        var set = new Set(Object.keys(times).map(helpers_1.toUnix));
        if (instance.watchedFiles || lastCompiled) {
            var removedFiles_1 = [];
            var checkFiles = (instance.watchedFiles || Object.keys(lastCompiled));
            checkFiles.forEach(function (file) {
                if (!set.has(file)) {
                    removedFiles_1.push(file);
                }
            });
            removedFiles_1.forEach(function (file) {
                checker.removeFile(file);
            });
        }
        instance.watchedFiles = set;
        var instanceTimes = instance.times;
        instance.times = __assign({}, times);
        var changedFiles = Object.keys(times).filter(function (fileName) {
            var updated = times[fileName] > (instanceTimes[fileName] || startTime);
            return updated;
        });
        var updates = changedFiles.map(function (fileName) {
            var unixFileName = helpers_1.toUnix(fileName);
            if (fs.existsSync(unixFileName)) {
                return checker.updateFile(unixFileName, fs.readFileSync(unixFileName).toString(), true);
            }
            else {
                return checker.removeFile(unixFileName);
            }
        });
        Promise.all(updates)
            .then(function () {
            callback();
        })
            .catch(callback);
    });
}
var WatchMode;
(function (WatchMode) {
    WatchMode[WatchMode["Enabled"] = 0] = "Enabled";
    WatchMode[WatchMode["Disabled"] = 1] = "Disabled";
    WatchMode[WatchMode["Unknown"] = 2] = "Unknown";
})(WatchMode || (WatchMode = {}));
function isWatching(compiler) {
    var value = compiler && compiler[watch_mode_1.WatchModeSymbol];
    if (value === true) {
        return WatchMode.Enabled;
    }
    else if (value === false) {
        return WatchMode.Disabled;
    }
    else {
        return WatchMode.Unknown;
    }
}
function setupAfterCompile(compiler, instanceName, forkChecker) {
    if (forkChecker === void 0) { forkChecker = false; }
    compiler.hooks.afterCompile.tapAsync('at-loader', function (compilation, callback) {
        if (compilation.compiler.isChild()) {
            callback();
            return;
        }
        var watchMode = isWatching(compilation.compiler);
        var instance = resolveInstance(compilation.compiler, instanceName);
        var silent = instance.loaderConfig.silent;
        var asyncErrors = watchMode === WatchMode.Enabled && !silent;
        var emitError = function (msg) {
            if (asyncErrors) {
                console.log(msg, '\n');
            }
            else {
                if (!instance.loaderConfig.errorsAsWarnings) {
                    compilation.errors.push(new Error(msg));
                }
                else {
                    compilation.warnings.push(new Error(msg));
                }
            }
        };
        var files = instance.checker.getFiles().then(function (_a) {
            var files = _a.files;
            Array.prototype.push.apply(compilation.fileDependencies, files.map(path.normalize));
        });
        instance.compiledDeclarations.forEach(function (declaration) {
            var assetPath = path.relative(compilation.compiler.outputPath, declaration.name);
            compilation.assets[assetPath] = {
                source: function () { return declaration.text; },
                size: function () { return declaration.text.length; }
            };
        });
        var timeStart = +new Date();
        var diag = function () {
            return instance.loaderConfig.transpileOnly
                ? Promise.resolve()
                : instance.checker.getDiagnostics().then(function (diags) {
                    if (!silent) {
                        if (diags.length) {
                            log.error(chalk_1.default.red("Checking finished with " + diags.length + " errors"));
                        }
                        else {
                            var totalTime = (+new Date() - timeStart).toString();
                            log.info("Time: " + chalk_1.default.bold(totalTime) + "ms");
                        }
                    }
                    diags.forEach(function (diag) { return emitError(diag.pretty); });
                });
        };
        files
            .then(function () {
            if (asyncErrors) {
                diag();
                return;
            }
            else {
                return diag();
            }
        })
            .then(function () { return callback(); })
            .catch(callback);
    });
}
//# sourceMappingURL=instance.js.map