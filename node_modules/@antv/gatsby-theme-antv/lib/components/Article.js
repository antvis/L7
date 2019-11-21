"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const antd_1 = require("antd");
const Article_module_less_1 = __importDefault(require("./Article.module.less"));
const Article = props => (react_1.default.createElement(antd_1.Layout.Content, { className: Article_module_less_1.default.article },
    react_1.default.createElement("article", Object.assign({}, props))));
exports.default = Article;
