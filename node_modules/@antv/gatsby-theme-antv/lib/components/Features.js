"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const antd_1 = require("antd");
const classnames_1 = __importDefault(require("classnames"));
const FeatureCard_1 = __importDefault(require("./FeatureCard"));
const Features_module_less_1 = __importDefault(require("./Features.module.less"));
const Features = ({ title, features = [], className, style, id, }) => {
    const getCards = () => {
        const children = features.map(card => (react_1.default.createElement(antd_1.Col, { className: Features_module_less_1.default.cardWrapper, key: card.title, md: 8, xs: 24 },
            react_1.default.createElement(FeatureCard_1.default, Object.assign({}, card)))));
        return children;
    };
    // for small screen
    const getDots = () => {
        const dots = [];
        const { length } = features;
        const startTop = 45;
        const cardHeight = 350;
        const startLeftPercent = 0.028;
        const rows = length + 1;
        for (let i = 0; i < rows; i += 1) {
            const yOffset = 1;
            const top = `${startTop + cardHeight * i - yOffset}px`;
            const leftColLeft = `${startLeftPercent * 100}%`;
            const rigthColLeft = `${(startLeftPercent + 0.892) * 100}%`;
            dots.push(react_1.default.createElement("div", { key: `${i}-0`, className: Features_module_less_1.default.dot, style: { marginLeft: leftColLeft, marginTop: top } }));
            dots.push(react_1.default.createElement("div", { key: `${i}-1`, className: Features_module_less_1.default.dot, style: { marginLeft: rigthColLeft, marginTop: top } }));
        }
        return dots;
    };
    return (react_1.default.createElement("div", { id: id, className: classnames_1.default(Features_module_less_1.default.wrapper, className), style: style },
        title ? (react_1.default.createElement("div", { className: classnames_1.default(Features_module_less_1.default.lefttopWithTitle, Features_module_less_1.default.lefttop) })) : (react_1.default.createElement("div", { className: classnames_1.default(Features_module_less_1.default.lefttopWithoutTitle, Features_module_less_1.default.lefttop) })),
        react_1.default.createElement("div", { className: title
                ? Features_module_less_1.default.rightbottom
                : classnames_1.default(Features_module_less_1.default.rightbottomWithoutTitle, Features_module_less_1.default.rightbottom) },
            react_1.default.createElement("div", { className: classnames_1.default(Features_module_less_1.default.slicerbar, Features_module_less_1.default.slicerbarv, Features_module_less_1.default.slicerbarv1) }),
            react_1.default.createElement("div", { className: classnames_1.default(Features_module_less_1.default.slicerbar, Features_module_less_1.default.slicerbarv, Features_module_less_1.default.slicerbarv2) }),
            react_1.default.createElement("div", { className: classnames_1.default(Features_module_less_1.default.slicerbar, Features_module_less_1.default.slicerbarh, Features_module_less_1.default.slicerbarh1) }),
            react_1.default.createElement("div", { className: classnames_1.default(Features_module_less_1.default.slicerbar, Features_module_less_1.default.slicerbarh, Features_module_less_1.default.slicerbarh2) }),
            react_1.default.createElement("div", { className: classnames_1.default(Features_module_less_1.default.slicerbar, Features_module_less_1.default.slicerbarh, Features_module_less_1.default.slicerbarh3) }),
            react_1.default.createElement("div", { className: classnames_1.default(Features_module_less_1.default.slicerbar, Features_module_less_1.default.slicerbarh, Features_module_less_1.default.slicerbarh4) }),
            getDots()),
        react_1.default.createElement("div", { className: Features_module_less_1.default.content },
            react_1.default.createElement("div", { key: "content" },
                react_1.default.createElement("p", { key: "title", className: Features_module_less_1.default.title }, title),
                react_1.default.createElement("div", { key: "block", className: Features_module_less_1.default.cardsContainer },
                    react_1.default.createElement(antd_1.Row, { key: "cards", className: Features_module_less_1.default.cards }, getCards()))))));
};
exports.default = Features;
