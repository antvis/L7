'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _dotenvDefaults = require('dotenv-defaults');

var _dotenvDefaults2 = _interopRequireDefault(_dotenvDefaults);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _webpack = require('webpack');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// Mostly taken from here: https://github.com/motdotla/dotenv-expand/blob/master/lib/main.js#L4
var interpolate = function interpolate(env, vars) {
  var matches = env.match(/\$([a-zA-Z0-9_]+)|\${([a-zA-Z0-9_]+)}/g) || [];

  matches.forEach(function (match) {
    var key = match.replace(/\$|{|}/g, '');
    var variable = vars[key] || '';
    variable = interpolate(variable, vars);
    env = env.replace(match, variable);
  });

  return env;
};

var Dotenv = function () {
  /**
   * The dotenv-webpack plugin.
   * @param {Object} options - The parameters.
   * @param {String} [options.path=./.env] - The location of the environment variable.
   * @param {Boolean|String} [options.safe=false] - If false ignore safe-mode, if true load `'./.env.example'`, if a string load that file as the sample.
   * @param {Boolean} [options.systemvars=false] - If true, load system environment variables.
   * @param {Boolean} [options.silent=false] - If true, suppress warnings, if false, display warnings.
   * @returns {webpack.DefinePlugin}
   */
  function Dotenv() {
    var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, Dotenv);

    this.config = _extends({}, {
      path: './.env'
    }, config);

    this.checkDeprecation();

    return new _webpack.DefinePlugin(this.formatData(this.gatherVariables()));
  }

  _createClass(Dotenv, [{
    key: 'checkDeprecation',
    value: function checkDeprecation() {
      var _config = this.config,
          sample = _config.sample,
          safe = _config.safe,
          silent = _config.silent;
      // Catch older packages, but hold their hand (just for a bit)

      if (sample) {
        if (safe) {
          this.config.safe = sample;
        }
        this.warn('dotenv-webpack: "options.sample" is a deprecated property. Please update your configuration to use "options.safe" instead.', silent);
      }
    }
  }, {
    key: 'gatherVariables',
    value: function gatherVariables() {
      var safe = this.config.safe;

      var vars = this.initializeVars();

      var _getEnvs = this.getEnvs(),
          env = _getEnvs.env,
          blueprint = _getEnvs.blueprint;

      Object.keys(blueprint).map(function (key) {
        var value = vars.hasOwnProperty(key) ? vars[key] : env[key];
        if (!value && safe) {
          throw new Error('Missing environment variable: ' + key);
        } else {
          vars[key] = value;
        }
      });

      // add the leftovers
      if (safe) {
        _extends(vars, env);
      }

      return vars;
    }
  }, {
    key: 'initializeVars',
    value: function initializeVars() {
      return this.config.systemvars ? _extends({}, process.env) : {};
    }
  }, {
    key: 'getEnvs',
    value: function getEnvs() {
      var _config2 = this.config,
          path = _config2.path,
          silent = _config2.silent,
          safe = _config2.safe;


      var env = _dotenvDefaults2.default.parse(this.loadFile({
        file: path,
        silent: silent
      }), this.getDefaults());

      var blueprint = env;
      if (safe) {
        var file = './.env.example';
        if (safe !== true) {
          file = safe;
        }
        blueprint = _dotenvDefaults2.default.parse(this.loadFile({
          file: file,
          silent: silent
        }));
      }

      return {
        env: env,
        blueprint: blueprint
      };
    }
  }, {
    key: 'getDefaults',
    value: function getDefaults() {
      var _config3 = this.config,
          silent = _config3.silent,
          defaults = _config3.defaults;


      if (defaults) {
        return this.loadFile({
          file: defaults === true ? './.env.defaults' : defaults,
          silent: silent
        });
      }

      return '';
    }
  }, {
    key: 'formatData',
    value: function formatData() {
      var vars = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var expand = this.config.expand;

      return Object.keys(vars).reduce(function (obj, key) {
        var v = vars[key];
        var vKey = 'process.env.' + key;
        var vValue = void 0;
        if (expand) {
          if (v.substring(0, 2) === '\\$') {
            vValue = v.substring(1);
          } else if (v.indexOf('\\$') > 0) {
            vValue = v.replace(/\\\$/g, '$');
          } else {
            vValue = interpolate(v, vars);
          }
        } else {
          vValue = v;
        }

        obj[vKey] = JSON.stringify(vValue);

        return obj;
      }, {});
    }

    /**
     * Load a file.
     * @param {String} config.file - The file to load.
     * @param {Boolean} config.silent - If true, suppress warnings, if false, display warnings.
     * @returns {Object}
     */

  }, {
    key: 'loadFile',
    value: function loadFile(_ref) {
      var file = _ref.file,
          silent = _ref.silent;

      try {
        return _fs2.default.readFileSync(file, 'utf8');
      } catch (err) {
        this.warn('Failed to load ' + file + '.', silent);
        return {};
      }
    }

    /**
     * Displays a console message if 'silent' is falsey
     * @param {String} msg - The message.
     * @param {Boolean} silent - If true, display the message, if false, suppress the message.
     */

  }, {
    key: 'warn',
    value: function warn(msg, silent) {
      !silent && console.warn(msg);
    }
  }]);

  return Dotenv;
}();

exports.default = Dotenv;