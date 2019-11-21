"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_i18next_1 = require("react-i18next");
const i18next_1 = __importDefault(require("i18next"));
const common_json_1 = __importDefault(require("../common.json"));
const i18n = i18next_1.default.createInstance();
i18n
    .use(react_i18next_1.initReactI18next) // passes i18n down to react-i18next
    .init({
    initImmediate: false,
    resources: {
        en: {
            translation: { ...common_json_1.default },
        },
    },
    fallbackLng: 'zh',
    keySeparator: false,
    react: {
        useSuspense: false,
    },
});
function withProvider(Element) {
    return function withProviderInner(props) {
        return (react_1.default.createElement(react_i18next_1.I18nextProvider, { i18n: i18n },
            react_1.default.createElement(Element, Object.assign({}, props))));
    };
}
exports.default = withProvider;
