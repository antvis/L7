var now = +new Date();
var index = 0;

export default function uid() {
  return "rc-upload-" + now + "-" + ++index;
}