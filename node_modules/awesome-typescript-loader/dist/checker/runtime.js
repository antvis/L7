"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var path = require("path");
var micromatch = require("micromatch");
var chalk_1 = require("chalk");
var weblog = require("webpack-log");
var helpers_1 = require("../helpers");
var protocol_1 = require("./protocol");
var fs_1 = require("./fs");
var helpers_2 = require("../helpers");
var caseInsensitive = helpers_2.isCaseInsensitive();
if (!module.parent) {
    process.on('uncaughtException', function (err) {
        console.log('UNCAUGHT EXCEPTION in awesome-typescript-loader');
        console.log("[Inside 'uncaughtException' event] ", err.message, err.stack);
    });
    process.on('disconnect', function () {
        process.exit();
    });
    process.on('exit', function () {
    });
    createChecker(process.on.bind(process, 'message'), process.send.bind(process));
}
else {
    module.exports.run = function run() {
        var send;
        var receive = function (msg) { };
        createChecker(function (receive) {
            send = function (msg, cb) {
                receive(msg);
                if (cb) {
                    cb();
                }
            };
        }, function (msg) { return receive(msg); });
        return {
            on: function (type, cb) {
                if (type === 'message') {
                    receive = cb;
                }
            },
            send: send,
            kill: function () { }
        };
    };
}
function createChecker(receive, send) {
    var loaderConfig;
    var compilerConfig;
    var compilerOptions;
    var compiler;
    var files = new fs_1.CaseInsensitiveMap();
    var ignoreDiagnostics = {};
    var instanceName;
    var context;
    var rootFilesChanged = false;
    var log = weblog({ name: 'atl' });
    var filesRegex;
    var watchedFiles = new Map();
    var watchedDirectories = new Map();
    var watchedDirectoriesRecursive = new Map();
    var useCaseSensitiveFileNames = function () { return !caseInsensitive; };
    var getCanonicalFileName = caseInsensitive
        ? function (fileName) { return fileName.toLowerCase(); }
        : function (fileName) { return fileName; };
    var watchHost;
    var watch;
    var finalTransformers;
    function createWatchHost() {
        return {
            rootFiles: getRootFiles(),
            options: compilerOptions,
            useCaseSensitiveFileNames: useCaseSensitiveFileNames,
            getNewLine: function () { return compiler.sys.newLine; },
            getCurrentDirectory: function () { return context; },
            getDefaultLibFileName: getDefaultLibFileName,
            fileExists: function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                return compiler.sys.fileExists.apply(compiler.sys, args);
            },
            readFile: readFile,
            directoryExists: function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                return compiler.sys.directoryExists.apply(compiler.sys, args);
            },
            getDirectories: function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                return compiler.sys.getDirectories.apply(compiler.sys, args);
            },
            readDirectory: function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                return compiler.sys.readDirectory.apply(compiler.sys, args);
            },
            realpath: function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                return compiler.sys.resolvePath.apply(compiler.sys, args);
            },
            watchFile: watchFile,
            watchDirectory: watchDirectory,
            createProgram: compiler.createSemanticDiagnosticsBuilderProgram,
            createHash: function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                return compiler.sys.createHash.apply(compiler.sys, args);
            }
        };
        function readFile(fileName) {
            ensureFile(fileName);
            var file = files.get(fileName);
            if (file) {
                return file.text;
            }
        }
    }
    function createWatch() {
        watchHost = createWatchHost();
        return compiler.createWatchProgram(watchHost);
    }
    function getProgram() {
        if (rootFilesChanged) {
            rootFilesChanged = false;
            watch.updateRootFileNames(getRootFiles());
        }
        return watch.getProgram();
    }
    function getRootFiles() {
        var names = files.map(function (file) { return file.fileName; }).filter(function (fileName) { return filesRegex.test(fileName); });
        return names;
    }
    function getDefaultLibFileName(options) {
        return helpers_1.toUnix(path.join(path.dirname(compiler.sys.getExecutingFilePath()), compiler.getDefaultLibFileName(options)));
    }
    function invokeWatcherCallbacks(callbacks, fileName, eventKind) {
        if (callbacks) {
            var cbs = callbacks.slice();
            for (var _i = 0, cbs_1 = cbs; _i < cbs_1.length; _i++) {
                var cb = cbs_1[_i];
                cb(fileName, eventKind);
            }
        }
    }
    function invokeFileWatcher(fileName, eventKind) {
        fileName = getCanonicalFileName(fileName);
        invokeWatcherCallbacks(watchedFiles.get(fileName), fileName, eventKind);
    }
    function invokeDirectoryWatcher(directory, fileAddedOrRemoved) {
        directory = getCanonicalFileName(directory);
        invokeWatcherCallbacks(watchedDirectories.get(directory), fileAddedOrRemoved);
        invokeRecursiveDirectoryWatcher(directory, fileAddedOrRemoved);
    }
    function invokeRecursiveDirectoryWatcher(directory, fileAddedOrRemoved) {
        invokeWatcherCallbacks(watchedDirectoriesRecursive.get(directory), fileAddedOrRemoved);
        var basePath = path.dirname(directory);
        if (directory !== basePath) {
            invokeRecursiveDirectoryWatcher(basePath, fileAddedOrRemoved);
        }
    }
    function createWatcher(file, callbacks, callback) {
        file = getCanonicalFileName(file);
        var existing = callbacks.get(file);
        if (existing) {
            existing.push(callback);
        }
        else {
            callbacks.set(file, [callback]);
        }
        return {
            close: function () {
                var existing = callbacks.get(file);
                if (existing) {
                    helpers_1.unorderedRemoveItem(existing, callback);
                }
            }
        };
    }
    function watchFile(fileName, callback, _pollingInterval) {
        return createWatcher(fileName, watchedFiles, callback);
    }
    function watchDirectory(fileName, callback, recursive) {
        return createWatcher(fileName, recursive ? watchedDirectoriesRecursive : watchedDirectories, callback);
    }
    function onFileCreated(fileName) {
        rootFilesChanged = true;
        invokeFileWatcher(fileName, compiler.FileWatcherEventKind.Created);
        invokeDirectoryWatcher(path.dirname(fileName), fileName);
    }
    function onFileRemoved(fileName) {
        rootFilesChanged = true;
        invokeFileWatcher(fileName, compiler.FileWatcherEventKind.Deleted);
        invokeDirectoryWatcher(path.dirname(fileName), fileName);
    }
    function onFileChanged(fileName) {
        invokeFileWatcher(fileName, compiler.FileWatcherEventKind.Changed);
    }
    function ensureFile(fileName) {
        var file = files.get(fileName);
        if (!file) {
            var text = compiler.sys.readFile(fileName);
            if (text) {
                files.set(fileName, {
                    fileName: fileName,
                    text: text
                });
                onFileCreated(fileName);
            }
        }
        else {
            if (file.fileName !== fileName) {
                if (caseInsensitive) {
                    file.fileName = fileName;
                    onFileChanged(fileName);
                }
                else {
                    removeFile(file.fileName);
                    var text = compiler.sys.readFile(fileName);
                    files.set(fileName, {
                        fileName: fileName,
                        text: text
                    });
                    onFileCreated(fileName);
                }
            }
        }
    }
    var TS_AND_JS_FILES = /\.tsx?$|\.jsx?$/i;
    var TS_FILES = /\.tsx?$/i;
    function processInit(_a) {
        var seq = _a.seq, payload = _a.payload;
        compiler = require(payload.compilerInfo.compilerPath);
        loaderConfig = payload.loaderConfig;
        compilerConfig = payload.compilerConfig;
        compilerOptions = compilerConfig.options;
        context = payload.context;
        filesRegex = compilerOptions.allowJs ? TS_AND_JS_FILES : TS_FILES;
        if (loaderConfig.debug) {
            log = weblog({ name: 'atl', level: 'debug' });
        }
        instanceName = loaderConfig.instance || 'at-loader';
        compilerConfig.fileNames.forEach(function (fileName) { return ensureFile(fileName); });
        watch = createWatch();
        log.debug('Initial files:', Object.keys(files)
            .map(function (file) { return chalk_1.default.cyan(file); })
            .join(', '));
        if (loaderConfig.ignoreDiagnostics) {
            loaderConfig.ignoreDiagnostics.forEach(function (diag) {
                ignoreDiagnostics[diag] = true;
            });
        }
        var getCustomTransformers = loaderConfig.getCustomTransformers;
        if (typeof getCustomTransformers === 'function') {
            finalTransformers = getCustomTransformers;
        }
        else if (typeof getCustomTransformers === 'string') {
            try {
                getCustomTransformers = require(getCustomTransformers);
            }
            catch (err) {
                throw new Error("Failed to load customTransformers from \"" + loaderConfig.getCustomTransformers + "\": " + err.message);
            }
            if (typeof getCustomTransformers !== 'function') {
                throw new Error("Custom transformers in \"" + loaderConfig.getCustomTransformers + "\" should export a function, got " + typeof getCustomTransformers);
            }
            finalTransformers = getCustomTransformers;
        }
        replyOk(seq, null);
    }
    function updateFile(fileName, text, ifExist) {
        if (ifExist === void 0) { ifExist = false; }
        var file = files.get(fileName);
        if (file) {
            var updated = false;
            if (file.fileName !== fileName) {
                if (caseInsensitive) {
                    file.fileName = fileName;
                }
                else {
                    removeFile(file.fileName);
                    files.set(fileName, {
                        fileName: fileName,
                        text: text
                    });
                    onFileCreated(fileName);
                }
            }
            if (file.text !== text) {
                updated = updated || true;
            }
            if (!updated) {
                return;
            }
            file.text = text;
            onFileChanged(fileName);
        }
        else if (!ifExist) {
            files.set(fileName, {
                fileName: fileName,
                text: text
            });
            onFileCreated(fileName);
        }
    }
    function removeFile(fileName) {
        if (files.has(fileName)) {
            files.delete(fileName);
            onFileRemoved(fileName);
        }
    }
    function getEmitOutput(fileName) {
        var program = getProgram();
        var outputFiles = [];
        var writeFile = function (fileName, text, writeByteOrderMark) {
            return outputFiles.push({ name: fileName, writeByteOrderMark: writeByteOrderMark, text: text });
        };
        var sourceFile = program.getSourceFile(fileName);
        program.emit(sourceFile, writeFile, undefined, false, finalTransformers && finalTransformers(program.getProgram()));
        return outputFiles;
    }
    function emit(fileName) {
        if (loaderConfig.useTranspileModule || loaderConfig.transpileOnly) {
            return fastEmit(fileName);
        }
        else {
            var outputFiles = getEmitOutput(fileName);
            if (outputFiles.length > 0) {
                return helpers_1.findResultFor(fileName, outputFiles);
            }
            else {
                return fastEmit(fileName);
            }
        }
    }
    function fastEmit(fileName) {
        var trans = compiler.transpileModule(files.get(fileName).text, {
            compilerOptions: compilerOptions,
            fileName: fileName,
            reportDiagnostics: false,
            transformers: finalTransformers ? finalTransformers(getProgram().getProgram()) : undefined
        });
        return {
            text: trans.outputText,
            sourceMap: trans.sourceMapText
        };
    }
    function processUpdate(_a) {
        var seq = _a.seq, payload = _a.payload;
        updateFile(payload.fileName, payload.text, payload.ifExist);
        replyOk(seq, null);
    }
    function processRemove(_a) {
        var seq = _a.seq, payload = _a.payload;
        removeFile(payload.fileName);
        replyOk(seq, null);
    }
    function processEmit(_a) {
        var seq = _a.seq, payload = _a.payload;
        updateFile(payload.fileName, payload.text);
        var emitResult = emit(payload.fileName);
        var program = getProgram();
        var sourceFile = program.getSourceFile(payload.fileName);
        var deps = program.getAllDependencies(sourceFile);
        replyOk(seq, { emitResult: emitResult, deps: deps });
    }
    function processFiles(_a) {
        var seq = _a.seq;
        replyOk(seq, {
            files: getProgram()
                .getSourceFiles()
                .map(function (f) { return f.fileName; })
        });
    }
    function isAffectedSourceFile(affected) {
        return affected.kind === compiler.SyntaxKind.SourceFile;
    }
    function processDiagnostics(_a) {
        var seq = _a.seq;
        var silent = !!loaderConfig.silent;
        if (!silent) {
            log.info("Checking started in a separate process...");
        }
        var program = getProgram();
        var sourceFiles = program.getSourceFiles();
        var allDiagnostics = program
            .getOptionsDiagnostics()
            .concat(program.getGlobalDiagnostics());
        var filters = [];
        if (compilerConfig.options.skipLibCheck) {
            filters.push(function (file) {
                return !file.isDeclarationFile;
            });
        }
        if (loaderConfig.reportFiles) {
            filters.push(function (file) {
                var fileName = path.relative(context, file.fileName);
                return micromatch([fileName], loaderConfig.reportFiles).length > 0;
            });
        }
        var diagnosticsCollected = new Array(sourceFiles.length);
        var ignoreSouceFile = function (file) {
            return filters.length && filters.some(function (f) { return !f(file); });
        };
        var result;
        while ((result = program.getSemanticDiagnosticsOfNextAffectedFile(undefined, ignoreSouceFile))) {
            if (isAffectedSourceFile(result.affected)) {
                var file = result.affected;
                allDiagnostics.push.apply(allDiagnostics, program.getSyntacticDiagnostics(file));
                allDiagnostics.push.apply(allDiagnostics, result.result);
                diagnosticsCollected[sourceFiles.indexOf(file)] = true;
            }
        }
        sourceFiles.forEach(function (file) {
            if (diagnosticsCollected[sourceFiles.indexOf(file)] || ignoreSouceFile(file)) {
                return;
            }
            allDiagnostics.push.apply(allDiagnostics, program.getSyntacticDiagnostics(file));
            allDiagnostics.push.apply(allDiagnostics, program.getSemanticDiagnostics(file));
        });
        log.debug("Typechecked files:", program.getSourceFiles());
        var processedDiagnostics = allDiagnostics
            .filter(function (diag) { return !ignoreDiagnostics[diag.code]; })
            .map(function (diagnostic) {
            var message = compiler.flattenDiagnosticMessageText(diagnostic.messageText, '\n');
            var fileName = diagnostic.file && path.relative(context, diagnostic.file.fileName);
            if (fileName && fileName[0] !== '.') {
                fileName = './' + helpers_1.toUnix(fileName);
            }
            var pretty = '';
            var line = 0;
            var character = 0;
            var code = diagnostic.code;
            if (diagnostic.file) {
                var pos = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start);
                line = pos.line;
                character = pos.character;
                pretty = "[" + instanceName + "] " + chalk_1.default.red(fileName) + ":" + (line + 1) + ":" + (character +
                    1) + " \n    TS" + code + ": " + chalk_1.default.red(message);
            }
            else {
                pretty = chalk_1.default.red("[" + instanceName + "] TS" + code + ": " + message);
            }
            return {
                category: diagnostic.category,
                code: diagnostic.code,
                fileName: fileName,
                start: diagnostic.start,
                message: message,
                pretty: pretty,
                line: line,
                character: character
            };
        });
        replyOk(seq, processedDiagnostics);
    }
    function replyOk(seq, payload) {
        send({
            seq: seq,
            success: true,
            payload: payload
        });
    }
    function replyErr(seq, payload) {
        send({
            seq: seq,
            success: false,
            payload: payload
        });
    }
    receive(function (req) {
        try {
            switch (req.type) {
                case protocol_1.MessageType.Init:
                    processInit(req);
                    break;
                case protocol_1.MessageType.RemoveFile:
                    processRemove(req);
                    break;
                case protocol_1.MessageType.UpdateFile:
                    processUpdate(req);
                    break;
                case protocol_1.MessageType.EmitFile:
                    processEmit(req);
                    break;
                case protocol_1.MessageType.Diagnostics:
                    processDiagnostics(req);
                    break;
                case protocol_1.MessageType.Files:
                    processFiles(req);
                    break;
            }
        }
        catch (e) {
            log.error("Child process failed to process the request:", e);
            replyErr(req.seq, null);
        }
    });
}
//# sourceMappingURL=runtime.js.map