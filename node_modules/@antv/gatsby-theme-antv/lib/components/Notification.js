"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const gatsby_1 = require("gatsby");
const Notification_module_less_1 = __importDefault(require("./Notification.module.less"));
const numberImages = [
    'https://gw.alipayobjects.com/zos/antfincdn/IqREAm36K7/1.png',
    'https://gw.alipayobjects.com/zos/antfincdn/3fG1Iqjfnz/2.png',
];
const Notification = ({ index = 0, type, title, date, link = '', }) => {
    const children = (react_1.default.createElement("div", { className: Notification_module_less_1.default.container },
        react_1.default.createElement("img", { className: Notification_module_less_1.default.number, src: numberImages[index], alt: index.toString() }),
        react_1.default.createElement("div", { className: Notification_module_less_1.default.content },
            react_1.default.createElement("p", { className: Notification_module_less_1.default.description },
                type,
                " \u2027 ",
                title),
            react_1.default.createElement("p", { className: Notification_module_less_1.default.date }, date))));
    if (link.startsWith('http')) {
        return (react_1.default.createElement("a", { href: link, target: "_blank", rel: "noopener noreferrer", className: Notification_module_less_1.default.notification }, children));
    }
    return (react_1.default.createElement(gatsby_1.Link, { to: link, className: Notification_module_less_1.default.notification }, children));
};
exports.default = Notification;
