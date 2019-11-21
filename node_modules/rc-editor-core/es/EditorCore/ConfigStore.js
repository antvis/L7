function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

import { Map } from 'immutable';

var ConfigStore = function () {
    function ConfigStore() {
        _classCallCheck(this, ConfigStore);

        this._store = Map();
    }

    ConfigStore.prototype.set = function set(key, value) {
        this._store = this._store.set(key, value);
    };

    ConfigStore.prototype.get = function get(key) {
        return this._store.get(key);
    };

    return ConfigStore;
}();

export default ConfigStore;