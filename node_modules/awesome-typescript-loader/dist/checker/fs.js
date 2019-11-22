"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var CaseSensitiveMap = (function () {
    function CaseSensitiveMap() {
        this.store = new Map();
    }
    CaseSensitiveMap.prototype.get = function (key) {
        return this.store.get(key);
    };
    CaseSensitiveMap.prototype.delete = function (key) {
        return this.store.delete(key);
    };
    CaseSensitiveMap.prototype.has = function (key) {
        return this.store.has(key);
    };
    CaseSensitiveMap.prototype.set = function (key, file) {
        return this.store.set(key, file);
    };
    CaseSensitiveMap.prototype.forEach = function (cb) {
        this.store.forEach(cb);
    };
    CaseSensitiveMap.prototype.map = function (cb) {
        var res = [];
        this.forEach(function (v, key) {
            res.push(cb(v, key));
        });
        return res;
    };
    return CaseSensitiveMap;
}());
exports.CaseSensitiveMap = CaseSensitiveMap;
var CaseInsensitiveMap = (function () {
    function CaseInsensitiveMap() {
        this.store = new Map();
    }
    CaseInsensitiveMap.prototype.get = function (key) {
        return this.store.get(key.toLowerCase());
    };
    CaseInsensitiveMap.prototype.delete = function (key) {
        return this.store.delete(key.toLowerCase());
    };
    CaseInsensitiveMap.prototype.has = function (key) {
        return this.store.has(key.toLowerCase());
    };
    CaseInsensitiveMap.prototype.set = function (key, file) {
        return this.store.set(key.toLowerCase(), file);
    };
    CaseInsensitiveMap.prototype.forEach = function (cb) {
        this.store.forEach(cb);
    };
    CaseInsensitiveMap.prototype.map = function (cb) {
        var res = [];
        this.forEach(function (v, key) {
            res.push(cb(v, key));
        });
        return res;
    };
    return CaseInsensitiveMap;
}());
exports.CaseInsensitiveMap = CaseInsensitiveMap;
//# sourceMappingURL=fs.js.map