import warning, { resetWarned } from "rc-util/es/warning";
export { resetWarned };
export default (function (valid, component, message) {
  warning(valid, "[antd: ".concat(component, "] ").concat(message));
});
//# sourceMappingURL=warning.js.map
