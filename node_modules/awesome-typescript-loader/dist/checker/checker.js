"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("lodash");
var childProcess = require("child_process");
var path = require("path");
var send_1 = require("./send");
var Checker = (function () {
    function Checker(compilerInfo, loaderConfig, compilerConfig, webpackOptions, context, fork) {
        if (fork === void 0) { fork = false; }
        var _this = this;
        this.seq = 0;
        this.pending = new Map();
        var execArgv = getExecArgv();
        var checker = fork
            ? childProcess.fork(path.join(__dirname, 'runtime.js'), [], { execArgv: execArgv })
            : require('./runtime').run();
        this.sender = fork ? send_1.createQueuedSender(checker) : { send: checker.send };
        this.checker = checker;
        this.compilerInfo = compilerInfo;
        this.loaderConfig = loaderConfig;
        this.compilerConfig = compilerConfig;
        this.webpackOptions = webpackOptions;
        checker.on('error', function (e) {
            console.error('Typescript checker error:', e);
        });
        checker.on('message', function (res) {
            var seq = res.seq, success = res.success, payload = res.payload;
            if (seq && _this.pending.has(seq)) {
                var resolver = _this.pending.get(seq);
                if (success) {
                    resolver.resolve(payload);
                }
                else {
                    resolver.reject(payload);
                }
                _this.pending.delete(seq);
            }
            else {
                console.warn('Unknown message: ', payload);
            }
        });
        this.req({
            type: 'Init',
            payload: {
                compilerInfo: _.omit(compilerInfo, 'tsImpl'),
                loaderConfig: loaderConfig,
                compilerConfig: compilerConfig,
                webpackOptions: webpackOptions,
                context: context
            }
        });
    }
    Checker.prototype.req = function (message) {
        var _this = this;
        message.seq = ++this.seq;
        var promise = new Promise(function (resolve, reject) {
            var resolver = {
                resolve: resolve,
                reject: reject
            };
            _this.pending.set(message.seq, resolver);
        });
        this.sender.send(message);
        return promise;
    };
    Checker.prototype.emitFile = function (fileName, text) {
        return this.req({
            type: 'EmitFile',
            payload: {
                fileName: fileName,
                text: text
            }
        });
    };
    Checker.prototype.updateFile = function (fileName, text, ifExist) {
        if (ifExist === void 0) { ifExist = false; }
        return this.req({
            type: 'UpdateFile',
            payload: {
                fileName: fileName,
                text: text,
                ifExist: ifExist
            }
        });
    };
    Checker.prototype.removeFile = function (fileName) {
        return this.req({
            type: 'RemoveFile',
            payload: {
                fileName: fileName
            }
        });
    };
    Checker.prototype.getDiagnostics = function () {
        return this.req({
            type: 'Diagnostics'
        });
    };
    Checker.prototype.getFiles = function () {
        return this.req({
            type: 'Files'
        });
    };
    Checker.prototype.kill = function () {
        this.checker.kill('SIGKILL');
    };
    return Checker;
}());
exports.Checker = Checker;
function getExecArgv() {
    var execArgv = [];
    for (var _i = 0, _a = process.execArgv; _i < _a.length; _i++) {
        var arg = _a[_i];
        var match = /^--(debug|inspect)(=(\d+))?$/.exec(arg);
        if (match) {
            var currentPort = match[3] !== undefined ? +match[3] : match[1] === 'debug' ? 5858 : 9229;
            execArgv.push('--' + match[1] + '=' + (currentPort + 1));
        }
        else {
            execArgv.push(arg);
        }
    }
    return execArgv;
}
//# sourceMappingURL=checker.js.map