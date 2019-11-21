"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const antd_1 = require("antd");
const classnames_1 = __importDefault(require("classnames"));
const Companies_module_less_1 = __importDefault(require("./Companies.module.less"));
const Companies = ({ title, companies = [], className, style, }) => {
    const getCompanies = companies.map(company => (react_1.default.createElement(antd_1.Col, { key: company.name, className: Companies_module_less_1.default.company, md: 6, sm: 8, xs: 12 },
        react_1.default.createElement("img", { className: Companies_module_less_1.default.companyimg, src: company.img, alt: company.name }))));
    return (react_1.default.createElement("div", { className: classnames_1.default(Companies_module_less_1.default.wrapper, className), style: style },
        react_1.default.createElement("div", { key: "content", className: Companies_module_less_1.default.content },
            react_1.default.createElement("p", { key: "title", className: Companies_module_less_1.default.title }, title),
            react_1.default.createElement("div", { key: "slicer", className: Companies_module_less_1.default.slicer }),
            react_1.default.createElement("div", { key: "companies-container", className: Companies_module_less_1.default.companiesContainer },
                react_1.default.createElement(antd_1.Row, { key: "companies", gutter: [{ xs: 77, sm: 77, md: 50, lg: 124 }, 10], className: Companies_module_less_1.default.companies }, getCompanies)))));
};
exports.default = Companies;
