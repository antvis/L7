'use strict';

exports.__esModule = true;

var _immutable = require('immutable');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ConfigStore = function () {
    function ConfigStore() {
        _classCallCheck(this, ConfigStore);

        this._store = (0, _immutable.Map)();
    }

    ConfigStore.prototype.set = function set(key, value) {
        this._store = this._store.set(key, value);
    };

    ConfigStore.prototype.get = function get(key) {
        return this._store.get(key);
    };

    return ConfigStore;
}();

exports['default'] = ConfigStore;
module.exports = exports['default'];