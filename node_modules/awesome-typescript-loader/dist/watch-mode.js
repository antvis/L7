"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WatchModeSymbol = Symbol('WatchMode');
var CheckerPlugin = (function () {
    function CheckerPlugin() {
    }
    CheckerPlugin.prototype.apply = function (compiler) {
        compiler.hooks.run.tapAsync('at-loader', function (params, callback) {
            compiler[exports.WatchModeSymbol] = false;
            callback();
        });
        compiler.hooks.watchRun.tapAsync('at-loader', function (params, callback) {
            compiler[exports.WatchModeSymbol] = true;
            callback();
        });
    };
    return CheckerPlugin;
}());
exports.CheckerPlugin = CheckerPlugin;
//# sourceMappingURL=watch-mode.js.map