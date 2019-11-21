// ---------------------
// Should pass through unaltered
// ---------------------
var f1 = function ({ value }) {
  return "somestring";
};

function f2({ value }) {
  return "somestring";
}

let f3 = class f3 {
  method1() {
    return "whatever";
  }
};


var f4 = React.createElement(
  "div",
  null,
  (() => React.createElement("span", null))()
);

// Known component which doesn't sit directly on the `Program` node get left alone
{
  var Component5c = function () {
    function Component5c() {}
    return Component5c;
  }();
}

// ---------------------
// Not supported
// ---------------------

// High-order things will be hard to catch
var jsxChunk = React.createElement(
  "div",
  null,
  value
);
function UnsupportedComponent1({ value }) {
  return function () {
    return jsxChunk;
  };
}

var a = {
  smoke: function () {},
  Component1d: function ({ value }) {
    return React.createElement(
      "div",
      null,
      value
    );
  }
};

var external = function () {
  var internal = function () {
    return React.createElement("div", null);
  };
  return internal;
};
