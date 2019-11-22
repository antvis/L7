"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const experimental_utils_1 = require("@typescript-eslint/experimental-utils");
const brace_style_1 = __importDefault(require("eslint/lib/rules/brace-style"));
const util = __importStar(require("../util"));
exports.default = util.createRule({
    name: 'brace-style',
    meta: {
        type: 'layout',
        docs: {
            description: 'Enforce consistent brace style for blocks',
            category: 'Stylistic Issues',
            recommended: false,
        },
        messages: brace_style_1.default.meta.messages,
        fixable: brace_style_1.default.meta.fixable,
        schema: brace_style_1.default.meta.schema,
    },
    defaultOptions: ['1tbs'],
    create(context) {
        const rules = brace_style_1.default.create(context);
        const checkBlockStatement = (node) => {
            rules.BlockStatement({
                type: experimental_utils_1.AST_NODE_TYPES.BlockStatement,
                parent: node.parent,
                range: node.range,
                body: node.body,
                loc: node.loc,
            });
        };
        return Object.assign(Object.assign({}, rules), { TSInterfaceBody: checkBlockStatement, TSModuleBlock: checkBlockStatement });
    },
});
//# sourceMappingURL=brace-style.js.map