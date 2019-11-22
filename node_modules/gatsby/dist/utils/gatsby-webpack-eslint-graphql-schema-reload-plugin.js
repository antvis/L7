"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

/**
 * The problem: after GraphQL schema rebuilds, eslint loader keeps validating against
 * the old schema.
 *
 * This plugin replaces options of eslint-plugin-graphql during develop
 */
const {
  store
} = require(`../redux`);

const eslintConfig = require(`./eslint-config`);

const hasLocalEslint = require(`./local-eslint-config-finder`);

const isEslintRule = rule => {
  const options = rule && rule.use && rule.use[0] && rule.use[0].options;
  return options && typeof options.useEslintrc !== `undefined`;
};

class GatsbyWebpackEslintGraphqlSchemaReload {
  constructor(options) {
    (0, _defineProperty2.default)(this, "schema", null);
    (0, _defineProperty2.default)(this, "findEslintOptions", compiler => compiler.options.module.rules.find(isEslintRule).use[0].options);
    this.plugin = {
      name: `GatsbyWebpackEslintGraphqlSchemaReload`
    };
    this.options = options || {};
  }

  apply(compiler) {
    compiler.hooks.compile.tap(this.plugin.name, () => {
      const {
        schema,
        program
      } = store.getState();

      if (!this.schema) {
        // initial build
        this.schema = schema;
        return;
      }

      if (this.schema === schema || hasLocalEslint(program.directory)) {
        return;
      }

      this.schema = schema; // Original eslint config object from webpack rules

      const options = this.findEslintOptions(compiler); // Hackish but works:
      // replacing original eslint options object with updated config

      Object.assign(options, eslintConfig(schema));
    });
  }

}

module.exports = GatsbyWebpackEslintGraphqlSchemaReload;
//# sourceMappingURL=gatsby-webpack-eslint-graphql-schema-reload-plugin.js.map