export function autobind(obj) {
  let predefined = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : ['constructor'];
  const proto = Object.getPrototypeOf(obj);
  const propNames = Object.getOwnPropertyNames(proto);

  for (const key of propNames) {
    if (typeof obj[key] === 'function') {
      if (!predefined.find(name => key === name)) {
        obj[key] = obj[key].bind(obj);
      }
    }
  }
}
//# sourceMappingURL=autobind.js.map