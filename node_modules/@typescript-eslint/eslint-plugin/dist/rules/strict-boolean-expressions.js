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
const typescript_1 = __importDefault(require("typescript"));
const tsutils = __importStar(require("tsutils"));
const util = __importStar(require("../util"));
exports.default = util.createRule({
    name: 'strict-boolean-expressions',
    meta: {
        type: 'suggestion',
        docs: {
            description: 'Restricts the types allowed in boolean expressions',
            category: 'Best Practices',
            recommended: false,
            requiresTypeChecking: true,
        },
        schema: [
            {
                type: 'object',
                properties: {
                    ignoreRhs: {
                        type: 'boolean',
                    },
                    allowNullable: {
                        type: 'boolean',
                    },
                },
                additionalProperties: false,
            },
        ],
        messages: {
            strictBooleanExpression: 'Unexpected non-boolean in conditional.',
        },
    },
    defaultOptions: [
        {
            ignoreRhs: false,
            allowNullable: false,
        },
    ],
    create(context, [options]) {
        const service = util.getParserServices(context);
        const checker = service.program.getTypeChecker();
        /**
         * Determines if the node has a boolean type.
         */
        function isBooleanType(node) {
            const tsNode = service.esTreeNodeToTSNodeMap.get(node);
            const type = util.getConstrainedTypeAtLocation(checker, tsNode);
            if (tsutils.isTypeFlagSet(type, typescript_1.default.TypeFlags.BooleanLike)) {
                return true;
            }
            // Check variants of union
            if (tsutils.isTypeFlagSet(type, typescript_1.default.TypeFlags.Union)) {
                let hasBoolean = false;
                for (const ty of type.types) {
                    if (tsutils.isTypeFlagSet(ty, typescript_1.default.TypeFlags.BooleanLike)) {
                        hasBoolean = true;
                        continue;
                    }
                    if (options.allowNullable) {
                        if (tsutils.isTypeFlagSet(ty, typescript_1.default.TypeFlags.Null)) {
                            continue;
                        }
                        if (tsutils.isTypeFlagSet(ty, typescript_1.default.TypeFlags.Undefined)) {
                            continue;
                        }
                    }
                    // Union variant is something else
                    return false;
                }
                return hasBoolean;
            }
            return false;
        }
        /**
         * Asserts that a testable expression contains a boolean, reports otherwise.
         * Filters all LogicalExpressions to prevent some duplicate reports.
         */
        function assertTestExpressionContainsBoolean(node) {
            if (node.test !== null &&
                node.test.type !== experimental_utils_1.AST_NODE_TYPES.LogicalExpression &&
                !isBooleanType(node.test)) {
                reportNode(node.test);
            }
        }
        /**
         * Asserts that a logical expression contains a boolean, reports otherwise.
         */
        function assertLocalExpressionContainsBoolean(node) {
            if (!isBooleanType(node.left) ||
                (!options.ignoreRhs && !isBooleanType(node.right))) {
                reportNode(node);
            }
        }
        /**
         * Asserts that a unary expression contains a boolean, reports otherwise.
         */
        function assertUnaryExpressionContainsBoolean(node) {
            if (!isBooleanType(node.argument)) {
                reportNode(node.argument);
            }
        }
        /**
         * Reports an offending node in context.
         */
        function reportNode(node) {
            context.report({ node, messageId: 'strictBooleanExpression' });
        }
        return {
            ConditionalExpression: assertTestExpressionContainsBoolean,
            DoWhileStatement: assertTestExpressionContainsBoolean,
            ForStatement: assertTestExpressionContainsBoolean,
            IfStatement: assertTestExpressionContainsBoolean,
            WhileStatement: assertTestExpressionContainsBoolean,
            LogicalExpression: assertLocalExpressionContainsBoolean,
            'UnaryExpression[operator="!"]': assertUnaryExpressionContainsBoolean,
        };
    },
});
//# sourceMappingURL=strict-boolean-expressions.js.map