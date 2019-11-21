const React = require('react');

exports.onRenderBody = ({ setHeadComponents }) => {
  setHeadComponents([
    <script
      key="polyfill"
      src="https://b.alicdn.com/s/polyfill.min.js?features=default,es2015,es2016,es2017,fetch,IntersectionObserver,NodeList.prototype.forEach,NodeList.prototype.@@iterator,EventSource,MutationObserver,ResizeObserver,HTMLCanvasElement.prototype.toBlob"
    />,
  ]);
};
