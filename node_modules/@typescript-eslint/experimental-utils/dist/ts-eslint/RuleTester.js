"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const eslint_1 = require("eslint");
// the cast on the extends is so that we don't want to have the built type defs to attempt to import eslint
class RuleTester extends eslint_1.RuleTester {
    constructor(config) {
        super(config);
        // nobody will ever need watching in tests
        // so we can give everyone a perf win by disabling watching
        if (config && config.parserOptions && config.parserOptions.project) {
            config.parserOptions.noWatch =
                typeof config.parserOptions.noWatch === 'boolean' || true;
        }
    }
    run(name, rule, tests) {
        // this method is only defined here because we lazily type the eslint import with `any`
        super.run(name, rule, tests);
    }
}
exports.RuleTester = RuleTester;
//# sourceMappingURL=RuleTester.js.map