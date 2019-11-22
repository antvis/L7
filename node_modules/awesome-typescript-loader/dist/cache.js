"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var os = require("os");
var path = require("path");
var zlib = require("zlib");
var crypto_1 = require("crypto");
function findCompiledModule(fileName) {
    var baseFileName = fileName.replace(/(\.ts|\.tsx)$/, '');
    var compiledFileName = baseFileName + ".js";
    if (fs.existsSync(compiledFileName)) {
        var mapFileName = baseFileName + ".js.map";
        var isMapExists = fs.existsSync(mapFileName);
        var result = {
            fileName: compiledFileName,
            text: fs.readFileSync(compiledFileName).toString(),
            mapName: isMapExists ? mapFileName : null,
            map: isMapExists ? fs.readFileSync(mapFileName).toString() : null
        };
        return result;
    }
    else {
        return null;
    }
}
exports.findCompiledModule = findCompiledModule;
function read(filename) {
    var content = fs.readFileSync(filename);
    var jsonString = zlib.gunzipSync(content);
    return JSON.parse(jsonString.toString());
}
function write(filename, result) {
    var jsonString = JSON.stringify(result);
    var content = zlib.gzipSync(jsonString);
    return fs.writeFileSync(filename, content);
}
function filename(source, identifier, options) {
    var hash = crypto_1.createHash('sha512');
    var contents = JSON.stringify({
        identifier: identifier,
        options: options,
        source: source
    });
    hash.end(contents);
    return hash.read().toString('hex') + '.json.gzip';
}
function cache(params) {
    var source = params.source;
    var options = params.options || {};
    var transform = params.transform;
    var identifier = params.identifier;
    var directory = typeof params.directory === 'string' ? params.directory : os.tmpdir();
    var file = path.join(directory, filename(source, identifier, options));
    try {
        return Promise.resolve({ cached: true, result: read(file) });
    }
    catch (e) {
        return transform().then(function (result) {
            write(file, result);
            return { cached: false, result: result };
        });
    }
}
exports.cache = cache;
//# sourceMappingURL=cache.js.map