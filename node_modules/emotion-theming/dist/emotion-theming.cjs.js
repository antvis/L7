'use strict';

if (process.env.NODE_ENV === "production") {
  module.exports = require("./emotion-theming.cjs.prod.js");
} else {
  module.exports = require("./emotion-theming.cjs.dev.js");
}
