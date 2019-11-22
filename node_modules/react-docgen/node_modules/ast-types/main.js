"use strict";;
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fork_1 = __importDefault(require("./fork"));
var core_1 = __importDefault(require("./def/core"));
var es6_1 = __importDefault(require("./def/es6"));
var es7_1 = __importDefault(require("./def/es7"));
var jsx_1 = __importDefault(require("./def/jsx"));
var flow_1 = __importDefault(require("./def/flow"));
var esprima_1 = __importDefault(require("./def/esprima"));
var babel_1 = __importDefault(require("./def/babel"));
var typescript_1 = __importDefault(require("./def/typescript"));
var es_proposals_1 = __importDefault(require("./def/es-proposals"));
var defs = [
    // This core module of AST types captures ES5 as it is parsed today by
    // git://github.com/ariya/esprima.git#master.
    core_1.default,
    // Feel free to add to or remove from this list of extension modules to
    // configure the precise type hierarchy that you need.
    es6_1.default,
    es7_1.default,
    jsx_1.default,
    flow_1.default,
    esprima_1.default,
    babel_1.default,
    typescript_1.default,
    es_proposals_1.default,
];
var main = fork_1.default(defs);
exports.default = main;
module.exports = exports["default"];
