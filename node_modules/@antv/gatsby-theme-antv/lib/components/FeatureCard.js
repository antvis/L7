"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const classnames_1 = __importDefault(require("classnames"));
const FeatureCard_module_less_1 = __importDefault(require("./FeatureCard.module.less"));
const FeatureCard = ({ icon, title, description }) => {
    return (react_1.default.createElement("div", { className: FeatureCard_module_less_1.default.card },
        react_1.default.createElement("div", { className: FeatureCard_module_less_1.default.content },
            react_1.default.createElement("img", { className: classnames_1.default(FeatureCard_module_less_1.default.icon, 'feature-logo'), src: icon, alt: "advantage" }),
            react_1.default.createElement("p", { className: FeatureCard_module_less_1.default.title }, title),
            react_1.default.createElement("p", { className: FeatureCard_module_less_1.default.description }, description))));
};
exports.default = FeatureCard;
