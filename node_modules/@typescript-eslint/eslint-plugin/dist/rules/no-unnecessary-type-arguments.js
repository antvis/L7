"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tsutils = __importStar(require("tsutils"));
const typescript_1 = __importDefault(require("typescript"));
const util = __importStar(require("../util"));
const util_1 = require("../util");
exports.default = util.createRule({
    name: 'no-unnecessary-type-arguments',
    meta: {
        docs: {
            description: 'Warns if an explicitly specified type argument is the default for that type parameter',
            category: 'Best Practices',
            recommended: false,
            requiresTypeChecking: true,
        },
        fixable: 'code',
        messages: {
            unnecessaryTypeParameter: 'This is the default value for this type parameter, so it can be omitted.',
        },
        schema: [],
        type: 'suggestion',
    },
    defaultOptions: [],
    create(context) {
        const parserServices = util.getParserServices(context);
        const checker = parserServices.program.getTypeChecker();
        function checkTSArgsAndParameters(esParameters, { typeArguments, typeParameters }) {
            // Just check the last one. Must specify previous type parameters if the last one is specified.
            const i = typeArguments.length - 1;
            const arg = typeArguments[i];
            const param = typeParameters[i];
            // TODO: would like checker.areTypesEquivalent. https://github.com/Microsoft/TypeScript/issues/13502
            if (param.default === undefined ||
                param.default.getText() !== arg.getText()) {
                return;
            }
            context.report({
                fix: fixer => fixer.removeRange(i === 0
                    ? [typeArguments.pos - 1, typeArguments.end + 1]
                    : [typeArguments[i - 1].end, arg.end]),
                messageId: 'unnecessaryTypeParameter',
                node: esParameters.params[i],
            });
        }
        return {
            TSTypeParameterInstantiation(node) {
                const parentDeclaration = parserServices.esTreeNodeToTSNodeMap.get(node.parent);
                const expression = tsutils.isClassLikeDeclaration(parentDeclaration)
                    ? parentDeclaration.heritageClauses[0].types[0]
                    : parentDeclaration;
                const argsAndParams = getArgsAndParameters(expression, checker);
                if (argsAndParams !== undefined) {
                    checkTSArgsAndParameters(node, argsAndParams);
                }
            },
        };
    },
});
function getArgsAndParameters(node, checker) {
    const typeParameters = getTypeParametersFromNode(node, checker);
    return typeParameters === undefined
        ? undefined
        : { typeArguments: node.typeArguments, typeParameters };
}
function getTypeParametersFromNode(node, checker) {
    if (typescript_1.default.isExpressionWithTypeArguments(node)) {
        return getTypeParametersFromType(node.expression, checker);
    }
    if (typescript_1.default.isTypeReferenceNode(node)) {
        return getTypeParametersFromType(node.typeName, checker);
    }
    if (typescript_1.default.isCallExpression(node) || typescript_1.default.isNewExpression(node)) {
        return getTypeParametersFromCall(node, checker);
    }
    return undefined;
}
function getTypeParametersFromType(type, checker) {
    const symAtLocation = checker.getSymbolAtLocation(type);
    if (symAtLocation === undefined) {
        return undefined;
    }
    const sym = getAliasedSymbol(symAtLocation, checker);
    if (sym === undefined || sym.declarations === undefined) {
        return undefined;
    }
    return util_1.findFirstResult(sym.declarations, decl => tsutils.isClassLikeDeclaration(decl) ||
        typescript_1.default.isTypeAliasDeclaration(decl) ||
        typescript_1.default.isInterfaceDeclaration(decl)
        ? decl.typeParameters
        : undefined);
}
function getTypeParametersFromCall(node, checker) {
    const sig = checker.getResolvedSignature(node);
    const sigDecl = sig === undefined ? undefined : sig.getDeclaration();
    if (sigDecl === undefined) {
        return typescript_1.default.isNewExpression(node)
            ? getTypeParametersFromType(node.expression, checker)
            : undefined;
    }
    return sigDecl.typeParameters;
}
function getAliasedSymbol(symbol, checker) {
    return tsutils.isSymbolFlagSet(symbol, typescript_1.default.SymbolFlags.Alias)
        ? checker.getAliasedSymbol(symbol)
        : symbol;
}
//# sourceMappingURL=no-unnecessary-type-arguments.js.map