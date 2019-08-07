export function bindAll(fns, context) {
  fns.forEach(fn => {
    if (!context[fn]) { return; }
    context[fn] = context[fn].bind(context);
  });
}
