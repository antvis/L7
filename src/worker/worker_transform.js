export function serialize(input, transferables) {
  if (input === null ||
    input === undefined ||
    typeof input === 'boolean' ||
    typeof input === 'number' ||
    typeof input === 'string' ||
    input instanceof Boolean ||
    input instanceof Number ||
    input instanceof String ||
    input instanceof Date ||
    input instanceof RegExp) {
    return input;
  }
  if (input instanceof ArrayBuffer) {
    if (transferables) {
      transferables.push(input);
    }
    return input;
  }
  if (ArrayBuffer.isView(input)) {
    const view = input;
    if (transferables) {
      transferables.push(view.buffer);
    }
    return view;
  }

  if (input instanceof ImageData) {
    if (transferables) {
      transferables.push(input.data.buffer);
    }
    return input;
  }
  if (Array.isArray(input)) {
    const serialized = [];
    for (const item of input) {
      serialized.push(serialize(item, transferables));
    }
    return serialized;
  }
  if (typeof input === 'object') {
    const properties = {};
    for (const key in input) {
      if (!input.hasOwnProperty(key)) {
        continue;
      }
      const property = input[key];
      properties[key] = serialize(property, transferables);
    }
    return properties;
  }

}

export function deserialize() {

}
