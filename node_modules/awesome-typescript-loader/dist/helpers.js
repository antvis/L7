"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var path = require("path");
var double = /\/\//;
function toUnix(fileName) {
    var res = fileName.replace(/\\/g, '/');
    while (res.match(double)) {
        res = res.replace(double, '/');
    }
    return res;
}
exports.toUnix = toUnix;
var caseInsensitiveFs;
function isCaseInsensitive() {
    if (typeof caseInsensitiveFs !== 'undefined') {
        return caseInsensitiveFs;
    }
    var lowerCaseStat = statSyncNoException(process.execPath.toLowerCase());
    var upperCaseStat = statSyncNoException(process.execPath.toUpperCase());
    if (lowerCaseStat && upperCaseStat) {
        caseInsensitiveFs =
            lowerCaseStat.dev === upperCaseStat.dev && lowerCaseStat.ino === upperCaseStat.ino;
    }
    else {
        caseInsensitiveFs = false;
    }
    return caseInsensitiveFs;
}
exports.isCaseInsensitive = isCaseInsensitive;
function statSyncNoException(path) {
    try {
        return fs.statSync(path);
    }
    catch (e) {
        return undefined;
    }
}
function withoutExt(fileName) {
    return path.basename(fileName).split('.')[0];
}
function compareFileName(first, second) {
    if (isCaseInsensitive()) {
        return first.toLowerCase() === second.toLowerCase();
    }
    else {
        return first === second;
    }
}
function isFileEmit(fileName, outputFileName, sourceFileName) {
    return (compareFileName(sourceFileName, fileName) &&
        (outputFileName.substr(-3).toLowerCase() === '.js' ||
            outputFileName.substr(-4).toLowerCase() === '.jsx'));
}
function isSourceMapEmit(fileName, outputFileName, sourceFileName) {
    return (compareFileName(sourceFileName, fileName) &&
        (outputFileName.substr(-7).toLowerCase() === '.js.map' ||
            outputFileName.substr(-8).toLowerCase() === '.jsx.map'));
}
function isDeclarationEmit(fileName, outputFileName, sourceFileName) {
    return (compareFileName(sourceFileName, fileName) &&
        outputFileName.substr(-5).toLowerCase() === '.d.ts');
}
function findResultFor(fileName, outputFiles) {
    var text;
    var sourceMap;
    var declaration;
    fileName = withoutExt(fileName);
    for (var i = 0; i < outputFiles.length; i++) {
        var o = outputFiles[i];
        var outputFileName = o.name;
        var sourceFileName = withoutExt(o.name);
        if (isFileEmit(fileName, outputFileName, sourceFileName)) {
            text = o.text;
        }
        if (isSourceMapEmit(fileName, outputFileName, sourceFileName)) {
            sourceMap = o.text;
        }
        if (isDeclarationEmit(fileName, outputFileName, sourceFileName)) {
            declaration = o;
        }
    }
    return {
        text: text,
        sourceMap: sourceMap,
        declaration: declaration
    };
}
exports.findResultFor = findResultFor;
function codegenErrorReport(errors) {
    return errors
        .map(function (error) {
        return 'console.error(' + JSON.stringify(error) + ');';
    })
        .join('\n');
}
exports.codegenErrorReport = codegenErrorReport;
function formatError(diagnostic) {
    var lineChar;
    if (diagnostic.file) {
        lineChar = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start);
    }
    return ((diagnostic.file ? path.normalize(diagnostic.file.fileName) : '') +
        (lineChar ? formatLineChar(lineChar) + ' ' : '') +
        '\n' +
        (typeof diagnostic.messageText === 'string'
            ? diagnostic.messageText
            : formatMessageChain(diagnostic.messageText)));
}
exports.formatError = formatError;
function formatMessageChain(chain) {
    var result = '';
    var separator = '\n  ';
    var current = chain;
    while (current) {
        result += current.messageText;
        if (!!current.next) {
            result += separator;
            separator += '  ';
        }
        current = current.next;
    }
    return result;
}
exports.formatMessageChain = formatMessageChain;
function formatLineChar(lineChar) {
    return ':' + (lineChar.line + 1) + ':' + lineChar.character;
}
exports.formatLineChar = formatLineChar;
function loadLib(moduleId) {
    var fileName = require.resolve(moduleId);
    var text = fs.readFileSync(fileName, 'utf8');
    return {
        fileName: fileName,
        text: text
    };
}
exports.loadLib = loadLib;
var TYPESCRIPT_EXTENSION = /\.(d\.)?(t|j)s$/;
function withoutTypeScriptExtension(fileName) {
    return fileName.replace(TYPESCRIPT_EXTENSION, '');
}
exports.withoutTypeScriptExtension = withoutTypeScriptExtension;
function unorderedRemoveItem(array, item) {
    for (var i = 0; i < array.length; i++) {
        if (array[i] === item) {
            array[i] = array[array.length - 1];
            array.pop();
            return true;
        }
    }
    return false;
}
exports.unorderedRemoveItem = unorderedRemoveItem;
//# sourceMappingURL=helpers.js.map