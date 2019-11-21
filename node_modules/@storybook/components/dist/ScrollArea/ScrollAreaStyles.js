"use strict";

require("core-js/modules/es.object.define-property");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getScrollAreaStyles = void 0;

var getScrollAreaStyles = function getScrollAreaStyles(theme) {
  return {
    '[data-simplebar]': {
      position: 'relative',
      flexDirection: 'column',
      flexWrap: 'wrap',
      justifyContent: 'flex-start',
      alignContent: 'flex-start',
      alignItems: 'flex-start'
    },
    '.simplebar-wrapper': {
      overflow: 'hidden',
      width: 'inherit',
      height: 'inherit',
      maxWidth: 'inherit',
      maxHeight: 'inherit'
    },
    '.simplebar-mask': {
      direction: 'inherit',
      position: 'absolute',
      overflow: 'hidden',
      padding: 0,
      margin: 0,
      left: 0,
      top: 0,
      bottom: 0,
      right: 0,
      width: 'auto !important',
      height: 'auto !important',
      zIndex: 0
    },
    '.simplebar-offset': {
      direction: 'inherit !important',
      resize: 'none !important',
      position: 'absolute',
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
      padding: 0,
      margin: 0,
      WebkitOverflowScrolling: 'touch'
    },
    '.simplebar-content-wrapper': {
      direction: 'inherit',
      position: 'relative',
      display: 'block',
      visibility: 'visible'
    },
    '.simplebar-placeholder': {
      maxHeight: '100%',
      maxWidth: '100%',
      width: '100%',
      pointerEvents: 'none'
    },
    '.simplebar-height-auto-observer-wrapper': {
      height: '100%',
      width: 'inherit',
      maxWidth: 1,
      position: 'relative',
      "float": 'left',
      maxHeight: 1,
      overflow: 'hidden',
      zIndex: -1,
      padding: 0,
      margin: 0,
      pointerEvents: 'none',
      flexGrow: 'inherit',
      flexShrink: 0,
      flexBasis: 0
    },
    '.simplebar-height-auto-observer': {
      display: 'block',
      opacity: 0,
      position: 'absolute',
      top: 0,
      left: 0,
      height: '1000%',
      width: '1000%',
      minHeight: 1,
      minWidth: 1,
      overflow: 'hidden',
      pointerEvents: 'none',
      zIndex: -1
    },
    '.simplebar-track': {
      zIndex: 1,
      position: 'absolute',
      right: 0,
      bottom: 0,
      pointerEvents: 'none',
      overflow: 'hidden'
    },
    '[data-simplebar].simplebar-dragging .simplebar-track': {
      pointerEvents: 'all'
    },
    '.simplebar-scrollbar': {
      position: 'absolute',
      right: 2,
      width: 7,
      minHeight: 10
    },
    '.simplebar-scrollbar:before': {
      position: 'absolute',
      content: '""',
      borderRadius: 7,
      left: 0,
      right: 0,
      opacity: 0,
      transition: 'opacity 0.2s linear',
      background: theme.base === 'light' ? theme.color.darkest : theme.color.lightest
    },
    '.simplebar-track .simplebar-scrollbar.simplebar-visible:before': {
      opacity: 0.5,
      transition: 'opacity 0s linear'
    },
    '.simplebar-track.simplebar-vertical': {
      top: 0,
      width: 11
    },
    '.simplebar-track.simplebar-vertical .simplebar-scrollbar:before': {
      top: 2,
      bottom: 2
    },
    '.simplebar-track.simplebar-horizontal': {
      left: 0,
      height: 11
    },
    '.simplebar-track.simplebar-horizontal .simplebar-scrollbar:before': {
      height: '100%',
      left: 2,
      right: 2
    },
    '.simplebar-track.simplebar-horizontal .simplebar-scrollbar': {
      right: 'auto',
      left: 0,
      top: 2,
      height: 7,
      minHeight: 0,
      minWidth: 10,
      width: 'auto'
    },
    '[data-simplebar-direction="rtl"] .simplebar-track.simplebar-vertical': {
      right: 'auto',
      left: 0
    }
  };
};

exports.getScrollAreaStyles = getScrollAreaStyles;