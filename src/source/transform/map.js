export function map(data, options) {
  const { callback } = options;
  if (callback) {
    data.dataArray = data.dataArray.map(callback);
  }
  return data;
}
