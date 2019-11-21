// Specifically configured to set name on Component5a and Component5b
function Component5a() {
  return "some string"
}

var Component5b = function () {
  return "some string"
}

// Known component's name used inside another function
var Component5c = function () {
  function Component5c() {}
  return Component5c
}()
