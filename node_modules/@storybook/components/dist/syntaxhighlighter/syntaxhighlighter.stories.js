"use strict";

require("core-js/modules/es.object.define-property");

require("core-js/modules/es.object.get-own-property-descriptor");

var React = _interopRequireWildcard(require("react"));

var _react2 = require("@storybook/react");

var _theming = require("@storybook/theming");

var _syntaxhighlighter = require("./syntaxhighlighter");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

var _ref =
/*#__PURE__*/
React.createElement(_syntaxhighlighter.SyntaxHighlighter, {
  language: "bash",
  copyable: false
}, "npx npm-check-updates '/storybook/' -u && npm install");

var _ref2 =
/*#__PURE__*/
React.createElement(_syntaxhighlighter.SyntaxHighlighter, {
  language: "jsx",
  copyable: false
}, "import { Good, Things } from 'life';\n\n        const result = () => <Good><Things all={true} /></Good>;\n\n        export { result as default };\n      ");

var _ref3 =
/*#__PURE__*/
React.createElement(_syntaxhighlighter.SyntaxHighlighter, {
  language: "C#",
  bordered: true,
  copyable: true
}, "\n        // A Hello World! program in C#.\n        using System;\n        namespace HelloWorld\n        {\n          class Hello \n          {\n            static void Main() \n            {\n              Console.WriteLine(\"Hello World!\");\n\n              // Keep the console window open in debug mode.\n              Console.WriteLine(\"Press any key to exit.\");\n              Console.ReadKey();\n            }\n          }\n        }\n      ");

var _ref4 =
/*#__PURE__*/
React.createElement(_syntaxhighlighter.SyntaxHighlighter, {
  bordered: true,
  language: "C#",
  copyable: true
}, "\n            // A Hello World! program in C#.\n            using System;\n            namespace HelloWorld\n            {\n              class Hello \n              {\n                static void Main() \n                {\n                  Console.WriteLine(\"Hello World!\");\n\n                  // Keep the console window open in debug mode.\n                  Console.WriteLine(\"Press any key to exit.\");\n                  Console.ReadKey();\n                }\n              }\n            }\n          ");

var _ref5 =
/*#__PURE__*/
React.createElement(_syntaxhighlighter.SyntaxHighlighter, {
  language: "jsx",
  copyable: false
}, "\n        import React from 'react';\n        import { storiesOf } from '@storybook/react';\n        import { styled } from '@storybook/theming';\n\n        import Heading from './heading';\n\n        const Holder = styled.div({\n          margin: 10,\n          border: '1px dashed deepskyblue',\n          // overflow: 'hidden',\n        });\n\n        storiesOf('Basics|Heading', module).add('types', () => (\n          <div>\n            <Holder>\n              <Heading>DEFAULT WITH ALL CAPS</Heading>\n            </Holder>\n            <Holder>\n              <Heading sub=\"With a great sub\">THIS LONG DEFAULT WITH ALL CAPS & SUB</Heading>\n            </Holder>\n            <Holder>\n              <Heading type=\"page\">page type</Heading>\n            </Holder>\n            <Holder>\n              <Heading type=\"page\" sub=\"With a sub\">\n                page type\n              </Heading>\n            </Holder>\n          </div>\n        ));\n      ");

var _ref6 =
/*#__PURE__*/
React.createElement(_syntaxhighlighter.SyntaxHighlighter, {
  language: "jsx",
  copyable: true,
  bordered: true
}, "import { Good, Things } from 'life';\n\n        const result = () => <Good><Things /></Good>;\n\n        export { result as default };\n      ");

var _ref7 =
/*#__PURE__*/
React.createElement(_syntaxhighlighter.SyntaxHighlighter, {
  language: "jsx",
  padded: true
}, "import { Good, Things } from 'life';\n\n        const result = () => <Good><Things /></Good>;\n\n        export { result as default };\n      ");

var _ref8 =
/*#__PURE__*/
React.createElement(_syntaxhighlighter.SyntaxHighlighter, {
  language: "jsx",
  copyable: false,
  showLineNumbers: true
}, "import { Good, Things } from 'life';\n\n        const result = () => <Good><Things /></Good>;\n\n        export { result as default };\n      ");

(0, _react2.storiesOf)('Basics|SyntaxHighlighter', module).add('bash', function () {
  return _ref;
}).add('jsx', function () {
  return _ref2;
}).add('unsupported', function () {
  return _ref3;
}).add('dark unsupported', function () {
  var theme = (0, _theming.ensure)(_theming.themes.dark);
  return React.createElement(_theming.ThemeProvider, {
    theme: theme
  }, _ref4);
}).add('story', function () {
  return _ref5;
}).add('bordered & copy-able', function () {
  return _ref6;
}).add('padded', function () {
  return _ref7;
}).add('showLineNumbers', function () {
  return _ref8;
});