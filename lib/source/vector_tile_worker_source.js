"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _ajax = require("../util/ajax");

var _pbf = _interopRequireDefault(require("pbf"));

var VectorParser = _interopRequireWildcard(require("@mapbox/vector-tile"));

var _workerTile = _interopRequireDefault(require("../worker/workerTile"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

// import WorkerTile from '../worker/workerTile';
function loadVectorTile(params, callback) {
  var request = (0, _ajax.getArrayBuffer)({
    url: params.url
  }, function (err, data) {
    if (err) {
      callback(err);
    } else if (data) {
      callback(null, {
        vectorTile: new VectorParser.VectorTile(new _pbf["default"](data.data)),
        rawData: data.data
      });
    }
  });
  return function () {
    request.abort();
    callback();
  };
}

var VectorTileWorkerSource =
/*#__PURE__*/
function () {
  function VectorTileWorkerSource(actor, layerStyle, loadVectorData) {
    _classCallCheck(this, VectorTileWorkerSource);

    this.actor = actor;
    this.layerStyle = layerStyle;
    this.loadVectorData = loadVectorData || loadVectorTile;
    this.loaded = {};
    this.loading = {};
  }

  _createClass(VectorTileWorkerSource, [{
    key: "loadTile",
    value: function loadTile(params, callback) {
      var _this = this;

      var uid = params.id;

      if (!this.loading) {
        this.loading = {};
      }

      var workerTile = this.loading[uid] = new _workerTile["default"](params);
      workerTile.abort = this.loadVectorData(params, function (err, response) {
        if (err || !response) {
          workerTile.status = 'done';
          _this.loaded[uid] = workerTile;
          return callback(err);
        } // const rawTileData = response.rawData;


        workerTile.vectorTile = response.vectorTile;
        workerTile.parse(response.vectorTile, _this.layerStyle, _this.actor, function (err, result) {
          if (err || !result) return callback(err); // Transferring a copy of rawTileData because the worker needs to retain its copy.

          callback(null, _objectSpread({}, result));
        });
        _this.loaded = _this.loaded || {};
        _this.loaded[uid] = workerTile;
      });
    }
  }, {
    key: "abortTile",
    value: function abortTile(params, callback) {
      var loading = this.loading;
      var uid = params.id;

      if (loading && loading[uid] && loading[uid].abort) {
        loading[uid].abort();
        delete loading[uid];
      }

      callback();
    }
  }, {
    key: "reloadTile",
    value: function reloadTile(params, callback) {
      // 重新加载 tile
      var loaded = this.loaded,
          uid = params.id,
          vtSource = this;

      if (loaded && loaded[uid]) {
        var workerTile = loaded[uid];

        var done = function done(err, data) {
          var reloadCallback = workerTile.reloadCallback;

          if (reloadCallback) {
            delete workerTile.reloadCallback;
            workerTile.parse(workerTile.vectorTile, vtSource.layerStyle, vtSource.actor, reloadCallback);
          }

          callback(err, data);
        };

        if (workerTile.status === 'parsing') {
          workerTile.reloadCallback = done;
        } else if (workerTile.status === 'done') {
          // if there was no vector tile data on the initial load, don't try and re-parse tile
          if (workerTile.vectorTile) {
            workerTile.parse(workerTile.vectorTile, this.layerIndex, this.actor, done);
          } else {
            done();
          }
        }
      }
    }
  }, {
    key: "removeTile",
    value: function removeTile(params, callback) {
      var loaded = this.loaded,
          uid = params.id;

      if (loaded && loaded[uid]) {
        delete loaded[uid];
      }

      callback();
    }
  }, {
    key: "unloadTile",
    value: function unloadTile() {}
  }, {
    key: "hasTransition",
    value: function hasTransition() {}
  }]);

  return VectorTileWorkerSource;
}();

exports["default"] = VectorTileWorkerSource;