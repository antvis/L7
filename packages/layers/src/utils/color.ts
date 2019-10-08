export function rgb2arr(str: string) {
  const arr = [];
  if (str.length === 4) {
    str = `#${str[1]}${str[1]}${str[2]}${str[2]}${str[3]}${str[3]}`;
  }
  arr.push(parseInt(str.substr(1, 2), 16) / 255);
  arr.push(parseInt(str.substr(3, 2), 16) / 255);
  arr.push(parseInt(str.substr(5, 2), 16) / 255);
  arr.push(1.0);
  return arr;
}
