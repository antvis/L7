"use strict";

require("core-js/modules/es.object.create");

require("core-js/modules/es.object.define-property");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ScanCodeBinding = exports.IMMUTABLE_KEYCODE_TO_CODE = exports.IMMUTABLE_CODE_TO_KEYCODE = exports.ScanCodeUtils = exports.ScanCode = void 0;

var _keyCodes = require("./keyCodes");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * keyboardEvent.code
 */
var ScanCode;
exports.ScanCode = ScanCode;

(function (ScanCode) {
  ScanCode[ScanCode["None"] = 0] = "None";
  ScanCode[ScanCode["Hyper"] = 1] = "Hyper";
  ScanCode[ScanCode["Super"] = 2] = "Super";
  ScanCode[ScanCode["Fn"] = 3] = "Fn";
  ScanCode[ScanCode["FnLock"] = 4] = "FnLock";
  ScanCode[ScanCode["Suspend"] = 5] = "Suspend";
  ScanCode[ScanCode["Resume"] = 6] = "Resume";
  ScanCode[ScanCode["Turbo"] = 7] = "Turbo";
  ScanCode[ScanCode["Sleep"] = 8] = "Sleep";
  ScanCode[ScanCode["WakeUp"] = 9] = "WakeUp";
  ScanCode[ScanCode["KeyA"] = 10] = "KeyA";
  ScanCode[ScanCode["KeyB"] = 11] = "KeyB";
  ScanCode[ScanCode["KeyC"] = 12] = "KeyC";
  ScanCode[ScanCode["KeyD"] = 13] = "KeyD";
  ScanCode[ScanCode["KeyE"] = 14] = "KeyE";
  ScanCode[ScanCode["KeyF"] = 15] = "KeyF";
  ScanCode[ScanCode["KeyG"] = 16] = "KeyG";
  ScanCode[ScanCode["KeyH"] = 17] = "KeyH";
  ScanCode[ScanCode["KeyI"] = 18] = "KeyI";
  ScanCode[ScanCode["KeyJ"] = 19] = "KeyJ";
  ScanCode[ScanCode["KeyK"] = 20] = "KeyK";
  ScanCode[ScanCode["KeyL"] = 21] = "KeyL";
  ScanCode[ScanCode["KeyM"] = 22] = "KeyM";
  ScanCode[ScanCode["KeyN"] = 23] = "KeyN";
  ScanCode[ScanCode["KeyO"] = 24] = "KeyO";
  ScanCode[ScanCode["KeyP"] = 25] = "KeyP";
  ScanCode[ScanCode["KeyQ"] = 26] = "KeyQ";
  ScanCode[ScanCode["KeyR"] = 27] = "KeyR";
  ScanCode[ScanCode["KeyS"] = 28] = "KeyS";
  ScanCode[ScanCode["KeyT"] = 29] = "KeyT";
  ScanCode[ScanCode["KeyU"] = 30] = "KeyU";
  ScanCode[ScanCode["KeyV"] = 31] = "KeyV";
  ScanCode[ScanCode["KeyW"] = 32] = "KeyW";
  ScanCode[ScanCode["KeyX"] = 33] = "KeyX";
  ScanCode[ScanCode["KeyY"] = 34] = "KeyY";
  ScanCode[ScanCode["KeyZ"] = 35] = "KeyZ";
  ScanCode[ScanCode["Digit1"] = 36] = "Digit1";
  ScanCode[ScanCode["Digit2"] = 37] = "Digit2";
  ScanCode[ScanCode["Digit3"] = 38] = "Digit3";
  ScanCode[ScanCode["Digit4"] = 39] = "Digit4";
  ScanCode[ScanCode["Digit5"] = 40] = "Digit5";
  ScanCode[ScanCode["Digit6"] = 41] = "Digit6";
  ScanCode[ScanCode["Digit7"] = 42] = "Digit7";
  ScanCode[ScanCode["Digit8"] = 43] = "Digit8";
  ScanCode[ScanCode["Digit9"] = 44] = "Digit9";
  ScanCode[ScanCode["Digit0"] = 45] = "Digit0";
  ScanCode[ScanCode["Enter"] = 46] = "Enter";
  ScanCode[ScanCode["Escape"] = 47] = "Escape";
  ScanCode[ScanCode["Backspace"] = 48] = "Backspace";
  ScanCode[ScanCode["Tab"] = 49] = "Tab";
  ScanCode[ScanCode["Space"] = 50] = "Space";
  ScanCode[ScanCode["Minus"] = 51] = "Minus";
  ScanCode[ScanCode["Equal"] = 52] = "Equal";
  ScanCode[ScanCode["BracketLeft"] = 53] = "BracketLeft";
  ScanCode[ScanCode["BracketRight"] = 54] = "BracketRight";
  ScanCode[ScanCode["Backslash"] = 55] = "Backslash";
  ScanCode[ScanCode["IntlHash"] = 56] = "IntlHash";
  ScanCode[ScanCode["Semicolon"] = 57] = "Semicolon";
  ScanCode[ScanCode["Quote"] = 58] = "Quote";
  ScanCode[ScanCode["Backquote"] = 59] = "Backquote";
  ScanCode[ScanCode["Comma"] = 60] = "Comma";
  ScanCode[ScanCode["Period"] = 61] = "Period";
  ScanCode[ScanCode["Slash"] = 62] = "Slash";
  ScanCode[ScanCode["CapsLock"] = 63] = "CapsLock";
  ScanCode[ScanCode["F1"] = 64] = "F1";
  ScanCode[ScanCode["F2"] = 65] = "F2";
  ScanCode[ScanCode["F3"] = 66] = "F3";
  ScanCode[ScanCode["F4"] = 67] = "F4";
  ScanCode[ScanCode["F5"] = 68] = "F5";
  ScanCode[ScanCode["F6"] = 69] = "F6";
  ScanCode[ScanCode["F7"] = 70] = "F7";
  ScanCode[ScanCode["F8"] = 71] = "F8";
  ScanCode[ScanCode["F9"] = 72] = "F9";
  ScanCode[ScanCode["F10"] = 73] = "F10";
  ScanCode[ScanCode["F11"] = 74] = "F11";
  ScanCode[ScanCode["F12"] = 75] = "F12";
  ScanCode[ScanCode["PrintScreen"] = 76] = "PrintScreen";
  ScanCode[ScanCode["ScrollLock"] = 77] = "ScrollLock";
  ScanCode[ScanCode["Pause"] = 78] = "Pause";
  ScanCode[ScanCode["Insert"] = 79] = "Insert";
  ScanCode[ScanCode["Home"] = 80] = "Home";
  ScanCode[ScanCode["PageUp"] = 81] = "PageUp";
  ScanCode[ScanCode["Delete"] = 82] = "Delete";
  ScanCode[ScanCode["End"] = 83] = "End";
  ScanCode[ScanCode["PageDown"] = 84] = "PageDown";
  ScanCode[ScanCode["ArrowRight"] = 85] = "ArrowRight";
  ScanCode[ScanCode["ArrowLeft"] = 86] = "ArrowLeft";
  ScanCode[ScanCode["ArrowDown"] = 87] = "ArrowDown";
  ScanCode[ScanCode["ArrowUp"] = 88] = "ArrowUp";
  ScanCode[ScanCode["NumLock"] = 89] = "NumLock";
  ScanCode[ScanCode["NumpadDivide"] = 90] = "NumpadDivide";
  ScanCode[ScanCode["NumpadMultiply"] = 91] = "NumpadMultiply";
  ScanCode[ScanCode["NumpadSubtract"] = 92] = "NumpadSubtract";
  ScanCode[ScanCode["NumpadAdd"] = 93] = "NumpadAdd";
  ScanCode[ScanCode["NumpadEnter"] = 94] = "NumpadEnter";
  ScanCode[ScanCode["Numpad1"] = 95] = "Numpad1";
  ScanCode[ScanCode["Numpad2"] = 96] = "Numpad2";
  ScanCode[ScanCode["Numpad3"] = 97] = "Numpad3";
  ScanCode[ScanCode["Numpad4"] = 98] = "Numpad4";
  ScanCode[ScanCode["Numpad5"] = 99] = "Numpad5";
  ScanCode[ScanCode["Numpad6"] = 100] = "Numpad6";
  ScanCode[ScanCode["Numpad7"] = 101] = "Numpad7";
  ScanCode[ScanCode["Numpad8"] = 102] = "Numpad8";
  ScanCode[ScanCode["Numpad9"] = 103] = "Numpad9";
  ScanCode[ScanCode["Numpad0"] = 104] = "Numpad0";
  ScanCode[ScanCode["NumpadDecimal"] = 105] = "NumpadDecimal";
  ScanCode[ScanCode["IntlBackslash"] = 106] = "IntlBackslash";
  ScanCode[ScanCode["ContextMenu"] = 107] = "ContextMenu";
  ScanCode[ScanCode["Power"] = 108] = "Power";
  ScanCode[ScanCode["NumpadEqual"] = 109] = "NumpadEqual";
  ScanCode[ScanCode["F13"] = 110] = "F13";
  ScanCode[ScanCode["F14"] = 111] = "F14";
  ScanCode[ScanCode["F15"] = 112] = "F15";
  ScanCode[ScanCode["F16"] = 113] = "F16";
  ScanCode[ScanCode["F17"] = 114] = "F17";
  ScanCode[ScanCode["F18"] = 115] = "F18";
  ScanCode[ScanCode["F19"] = 116] = "F19";
  ScanCode[ScanCode["F20"] = 117] = "F20";
  ScanCode[ScanCode["F21"] = 118] = "F21";
  ScanCode[ScanCode["F22"] = 119] = "F22";
  ScanCode[ScanCode["F23"] = 120] = "F23";
  ScanCode[ScanCode["F24"] = 121] = "F24";
  ScanCode[ScanCode["Open"] = 122] = "Open";
  ScanCode[ScanCode["Help"] = 123] = "Help";
  ScanCode[ScanCode["Select"] = 124] = "Select";
  ScanCode[ScanCode["Again"] = 125] = "Again";
  ScanCode[ScanCode["Undo"] = 126] = "Undo";
  ScanCode[ScanCode["Cut"] = 127] = "Cut";
  ScanCode[ScanCode["Copy"] = 128] = "Copy";
  ScanCode[ScanCode["Paste"] = 129] = "Paste";
  ScanCode[ScanCode["Find"] = 130] = "Find";
  ScanCode[ScanCode["AudioVolumeMute"] = 131] = "AudioVolumeMute";
  ScanCode[ScanCode["AudioVolumeUp"] = 132] = "AudioVolumeUp";
  ScanCode[ScanCode["AudioVolumeDown"] = 133] = "AudioVolumeDown";
  ScanCode[ScanCode["NumpadComma"] = 134] = "NumpadComma";
  ScanCode[ScanCode["IntlRo"] = 135] = "IntlRo";
  ScanCode[ScanCode["KanaMode"] = 136] = "KanaMode";
  ScanCode[ScanCode["IntlYen"] = 137] = "IntlYen";
  ScanCode[ScanCode["Convert"] = 138] = "Convert";
  ScanCode[ScanCode["NonConvert"] = 139] = "NonConvert";
  ScanCode[ScanCode["Lang1"] = 140] = "Lang1";
  ScanCode[ScanCode["Lang2"] = 141] = "Lang2";
  ScanCode[ScanCode["Lang3"] = 142] = "Lang3";
  ScanCode[ScanCode["Lang4"] = 143] = "Lang4";
  ScanCode[ScanCode["Lang5"] = 144] = "Lang5";
  ScanCode[ScanCode["Abort"] = 145] = "Abort";
  ScanCode[ScanCode["Props"] = 146] = "Props";
  ScanCode[ScanCode["NumpadParenLeft"] = 147] = "NumpadParenLeft";
  ScanCode[ScanCode["NumpadParenRight"] = 148] = "NumpadParenRight";
  ScanCode[ScanCode["NumpadBackspace"] = 149] = "NumpadBackspace";
  ScanCode[ScanCode["NumpadMemoryStore"] = 150] = "NumpadMemoryStore";
  ScanCode[ScanCode["NumpadMemoryRecall"] = 151] = "NumpadMemoryRecall";
  ScanCode[ScanCode["NumpadMemoryClear"] = 152] = "NumpadMemoryClear";
  ScanCode[ScanCode["NumpadMemoryAdd"] = 153] = "NumpadMemoryAdd";
  ScanCode[ScanCode["NumpadMemorySubtract"] = 154] = "NumpadMemorySubtract";
  ScanCode[ScanCode["NumpadClear"] = 155] = "NumpadClear";
  ScanCode[ScanCode["NumpadClearEntry"] = 156] = "NumpadClearEntry";
  ScanCode[ScanCode["ControlLeft"] = 157] = "ControlLeft";
  ScanCode[ScanCode["ShiftLeft"] = 158] = "ShiftLeft";
  ScanCode[ScanCode["AltLeft"] = 159] = "AltLeft";
  ScanCode[ScanCode["MetaLeft"] = 160] = "MetaLeft";
  ScanCode[ScanCode["ControlRight"] = 161] = "ControlRight";
  ScanCode[ScanCode["ShiftRight"] = 162] = "ShiftRight";
  ScanCode[ScanCode["AltRight"] = 163] = "AltRight";
  ScanCode[ScanCode["MetaRight"] = 164] = "MetaRight";
  ScanCode[ScanCode["BrightnessUp"] = 165] = "BrightnessUp";
  ScanCode[ScanCode["BrightnessDown"] = 166] = "BrightnessDown";
  ScanCode[ScanCode["MediaPlay"] = 167] = "MediaPlay";
  ScanCode[ScanCode["MediaRecord"] = 168] = "MediaRecord";
  ScanCode[ScanCode["MediaFastForward"] = 169] = "MediaFastForward";
  ScanCode[ScanCode["MediaRewind"] = 170] = "MediaRewind";
  ScanCode[ScanCode["MediaTrackNext"] = 171] = "MediaTrackNext";
  ScanCode[ScanCode["MediaTrackPrevious"] = 172] = "MediaTrackPrevious";
  ScanCode[ScanCode["MediaStop"] = 173] = "MediaStop";
  ScanCode[ScanCode["Eject"] = 174] = "Eject";
  ScanCode[ScanCode["MediaPlayPause"] = 175] = "MediaPlayPause";
  ScanCode[ScanCode["MediaSelect"] = 176] = "MediaSelect";
  ScanCode[ScanCode["LaunchMail"] = 177] = "LaunchMail";
  ScanCode[ScanCode["LaunchApp2"] = 178] = "LaunchApp2";
  ScanCode[ScanCode["LaunchApp1"] = 179] = "LaunchApp1";
  ScanCode[ScanCode["SelectTask"] = 180] = "SelectTask";
  ScanCode[ScanCode["LaunchScreenSaver"] = 181] = "LaunchScreenSaver";
  ScanCode[ScanCode["BrowserSearch"] = 182] = "BrowserSearch";
  ScanCode[ScanCode["BrowserHome"] = 183] = "BrowserHome";
  ScanCode[ScanCode["BrowserBack"] = 184] = "BrowserBack";
  ScanCode[ScanCode["BrowserForward"] = 185] = "BrowserForward";
  ScanCode[ScanCode["BrowserStop"] = 186] = "BrowserStop";
  ScanCode[ScanCode["BrowserRefresh"] = 187] = "BrowserRefresh";
  ScanCode[ScanCode["BrowserFavorites"] = 188] = "BrowserFavorites";
  ScanCode[ScanCode["ZoomToggle"] = 189] = "ZoomToggle";
  ScanCode[ScanCode["MailReply"] = 190] = "MailReply";
  ScanCode[ScanCode["MailForward"] = 191] = "MailForward";
  ScanCode[ScanCode["MailSend"] = 192] = "MailSend";
  ScanCode[ScanCode["MAX_VALUE"] = 193] = "MAX_VALUE";
})(ScanCode || (exports.ScanCode = ScanCode = {}));

var scanCodeIntToStr = [];
var scanCodeStrToInt = Object.create(null);
var scanCodeLowerCaseStrToInt = Object.create(null);
var ScanCodeUtils = {
  lowerCaseToEnum: function lowerCaseToEnum(scanCode) {
    return scanCodeLowerCaseStrToInt[scanCode] || ScanCode.None;
  },
  toEnum: function toEnum(scanCode) {
    return scanCodeStrToInt[scanCode] || ScanCode.None;
  },
  toString: function toString(scanCode) {
    return scanCodeIntToStr[scanCode] || 'None';
  }
};
/**
 * -1 if a ScanCode => KeyCode mapping depends on kb layout.
 */

exports.ScanCodeUtils = ScanCodeUtils;
var IMMUTABLE_CODE_TO_KEYCODE = [];
/**
 * -1 if a KeyCode => ScanCode mapping depends on kb layout.
 */

exports.IMMUTABLE_CODE_TO_KEYCODE = IMMUTABLE_CODE_TO_KEYCODE;
var IMMUTABLE_KEYCODE_TO_CODE = [];
exports.IMMUTABLE_KEYCODE_TO_CODE = IMMUTABLE_KEYCODE_TO_CODE;

var ScanCodeBinding =
/*#__PURE__*/
function () {
  function ScanCodeBinding(ctrlKey, shiftKey, altKey, metaKey, scanCode) {
    _classCallCheck(this, ScanCodeBinding);

    this.ctrlKey = void 0;
    this.shiftKey = void 0;
    this.altKey = void 0;
    this.metaKey = void 0;
    this.scanCode = void 0;
    this.ctrlKey = ctrlKey;
    this.shiftKey = shiftKey;
    this.altKey = altKey;
    this.metaKey = metaKey;
    this.scanCode = scanCode;
  }

  _createClass(ScanCodeBinding, [{
    key: "equals",
    value: function equals(other) {
      return this.ctrlKey === other.ctrlKey && this.shiftKey === other.shiftKey && this.altKey === other.altKey && this.metaKey === other.metaKey && this.scanCode === other.scanCode;
    }
    /**
     * Does this keybinding refer to the key code of a modifier and it also has the modifier flag?
     */

  }, {
    key: "isDuplicateModifierCase",
    value: function isDuplicateModifierCase() {
      return this.ctrlKey && (this.scanCode === ScanCode.ControlLeft || this.scanCode === ScanCode.ControlRight) || this.shiftKey && (this.scanCode === ScanCode.ShiftLeft || this.scanCode === ScanCode.ShiftRight) || this.altKey && (this.scanCode === ScanCode.AltLeft || this.scanCode === ScanCode.AltRight) || this.metaKey && (this.scanCode === ScanCode.MetaLeft || this.scanCode === ScanCode.MetaRight);
    }
  }]);

  return ScanCodeBinding;
}();

exports.ScanCodeBinding = ScanCodeBinding;

(function () {
  function d(intScanCode, strScanCode) {
    scanCodeIntToStr[intScanCode] = strScanCode;
    scanCodeStrToInt[strScanCode] = intScanCode;
    scanCodeLowerCaseStrToInt[strScanCode.toLowerCase()] = intScanCode;
  }

  d(ScanCode.None, 'None');
  d(ScanCode.Hyper, 'Hyper');
  d(ScanCode.Super, 'Super');
  d(ScanCode.Fn, 'Fn');
  d(ScanCode.FnLock, 'FnLock');
  d(ScanCode.Suspend, 'Suspend');
  d(ScanCode.Resume, 'Resume');
  d(ScanCode.Turbo, 'Turbo');
  d(ScanCode.Sleep, 'Sleep');
  d(ScanCode.WakeUp, 'WakeUp');
  d(ScanCode.KeyA, 'KeyA');
  d(ScanCode.KeyB, 'KeyB');
  d(ScanCode.KeyC, 'KeyC');
  d(ScanCode.KeyD, 'KeyD');
  d(ScanCode.KeyE, 'KeyE');
  d(ScanCode.KeyF, 'KeyF');
  d(ScanCode.KeyG, 'KeyG');
  d(ScanCode.KeyH, 'KeyH');
  d(ScanCode.KeyI, 'KeyI');
  d(ScanCode.KeyJ, 'KeyJ');
  d(ScanCode.KeyK, 'KeyK');
  d(ScanCode.KeyL, 'KeyL');
  d(ScanCode.KeyM, 'KeyM');
  d(ScanCode.KeyN, 'KeyN');
  d(ScanCode.KeyO, 'KeyO');
  d(ScanCode.KeyP, 'KeyP');
  d(ScanCode.KeyQ, 'KeyQ');
  d(ScanCode.KeyR, 'KeyR');
  d(ScanCode.KeyS, 'KeyS');
  d(ScanCode.KeyT, 'KeyT');
  d(ScanCode.KeyU, 'KeyU');
  d(ScanCode.KeyV, 'KeyV');
  d(ScanCode.KeyW, 'KeyW');
  d(ScanCode.KeyX, 'KeyX');
  d(ScanCode.KeyY, 'KeyY');
  d(ScanCode.KeyZ, 'KeyZ');
  d(ScanCode.Digit1, 'Digit1');
  d(ScanCode.Digit2, 'Digit2');
  d(ScanCode.Digit3, 'Digit3');
  d(ScanCode.Digit4, 'Digit4');
  d(ScanCode.Digit5, 'Digit5');
  d(ScanCode.Digit6, 'Digit6');
  d(ScanCode.Digit7, 'Digit7');
  d(ScanCode.Digit8, 'Digit8');
  d(ScanCode.Digit9, 'Digit9');
  d(ScanCode.Digit0, 'Digit0');
  d(ScanCode.Enter, 'Enter');
  d(ScanCode.Escape, 'Escape');
  d(ScanCode.Backspace, 'Backspace');
  d(ScanCode.Tab, 'Tab');
  d(ScanCode.Space, 'Space');
  d(ScanCode.Minus, 'Minus');
  d(ScanCode.Equal, 'Equal');
  d(ScanCode.BracketLeft, 'BracketLeft');
  d(ScanCode.BracketRight, 'BracketRight');
  d(ScanCode.Backslash, 'Backslash');
  d(ScanCode.IntlHash, 'IntlHash');
  d(ScanCode.Semicolon, 'Semicolon');
  d(ScanCode.Quote, 'Quote');
  d(ScanCode.Backquote, 'Backquote');
  d(ScanCode.Comma, 'Comma');
  d(ScanCode.Period, 'Period');
  d(ScanCode.Slash, 'Slash');
  d(ScanCode.CapsLock, 'CapsLock');
  d(ScanCode.F1, 'F1');
  d(ScanCode.F2, 'F2');
  d(ScanCode.F3, 'F3');
  d(ScanCode.F4, 'F4');
  d(ScanCode.F5, 'F5');
  d(ScanCode.F6, 'F6');
  d(ScanCode.F7, 'F7');
  d(ScanCode.F8, 'F8');
  d(ScanCode.F9, 'F9');
  d(ScanCode.F10, 'F10');
  d(ScanCode.F11, 'F11');
  d(ScanCode.F12, 'F12');
  d(ScanCode.PrintScreen, 'PrintScreen');
  d(ScanCode.ScrollLock, 'ScrollLock');
  d(ScanCode.Pause, 'Pause');
  d(ScanCode.Insert, 'Insert');
  d(ScanCode.Home, 'Home');
  d(ScanCode.PageUp, 'PageUp');
  d(ScanCode.Delete, 'Delete');
  d(ScanCode.End, 'End');
  d(ScanCode.PageDown, 'PageDown');
  d(ScanCode.ArrowRight, 'ArrowRight');
  d(ScanCode.ArrowLeft, 'ArrowLeft');
  d(ScanCode.ArrowDown, 'ArrowDown');
  d(ScanCode.ArrowUp, 'ArrowUp');
  d(ScanCode.NumLock, 'NumLock');
  d(ScanCode.NumpadDivide, 'NumpadDivide');
  d(ScanCode.NumpadMultiply, 'NumpadMultiply');
  d(ScanCode.NumpadSubtract, 'NumpadSubtract');
  d(ScanCode.NumpadAdd, 'NumpadAdd');
  d(ScanCode.NumpadEnter, 'NumpadEnter');
  d(ScanCode.Numpad1, 'Numpad1');
  d(ScanCode.Numpad2, 'Numpad2');
  d(ScanCode.Numpad3, 'Numpad3');
  d(ScanCode.Numpad4, 'Numpad4');
  d(ScanCode.Numpad5, 'Numpad5');
  d(ScanCode.Numpad6, 'Numpad6');
  d(ScanCode.Numpad7, 'Numpad7');
  d(ScanCode.Numpad8, 'Numpad8');
  d(ScanCode.Numpad9, 'Numpad9');
  d(ScanCode.Numpad0, 'Numpad0');
  d(ScanCode.NumpadDecimal, 'NumpadDecimal');
  d(ScanCode.IntlBackslash, 'IntlBackslash');
  d(ScanCode.ContextMenu, 'ContextMenu');
  d(ScanCode.Power, 'Power');
  d(ScanCode.NumpadEqual, 'NumpadEqual');
  d(ScanCode.F13, 'F13');
  d(ScanCode.F14, 'F14');
  d(ScanCode.F15, 'F15');
  d(ScanCode.F16, 'F16');
  d(ScanCode.F17, 'F17');
  d(ScanCode.F18, 'F18');
  d(ScanCode.F19, 'F19');
  d(ScanCode.F20, 'F20');
  d(ScanCode.F21, 'F21');
  d(ScanCode.F22, 'F22');
  d(ScanCode.F23, 'F23');
  d(ScanCode.F24, 'F24');
  d(ScanCode.Open, 'Open');
  d(ScanCode.Help, 'Help');
  d(ScanCode.Select, 'Select');
  d(ScanCode.Again, 'Again');
  d(ScanCode.Undo, 'Undo');
  d(ScanCode.Cut, 'Cut');
  d(ScanCode.Copy, 'Copy');
  d(ScanCode.Paste, 'Paste');
  d(ScanCode.Find, 'Find');
  d(ScanCode.AudioVolumeMute, 'AudioVolumeMute');
  d(ScanCode.AudioVolumeUp, 'AudioVolumeUp');
  d(ScanCode.AudioVolumeDown, 'AudioVolumeDown');
  d(ScanCode.NumpadComma, 'NumpadComma');
  d(ScanCode.IntlRo, 'IntlRo');
  d(ScanCode.KanaMode, 'KanaMode');
  d(ScanCode.IntlYen, 'IntlYen');
  d(ScanCode.Convert, 'Convert');
  d(ScanCode.NonConvert, 'NonConvert');
  d(ScanCode.Lang1, 'Lang1');
  d(ScanCode.Lang2, 'Lang2');
  d(ScanCode.Lang3, 'Lang3');
  d(ScanCode.Lang4, 'Lang4');
  d(ScanCode.Lang5, 'Lang5');
  d(ScanCode.Abort, 'Abort');
  d(ScanCode.Props, 'Props');
  d(ScanCode.NumpadParenLeft, 'NumpadParenLeft');
  d(ScanCode.NumpadParenRight, 'NumpadParenRight');
  d(ScanCode.NumpadBackspace, 'NumpadBackspace');
  d(ScanCode.NumpadMemoryStore, 'NumpadMemoryStore');
  d(ScanCode.NumpadMemoryRecall, 'NumpadMemoryRecall');
  d(ScanCode.NumpadMemoryClear, 'NumpadMemoryClear');
  d(ScanCode.NumpadMemoryAdd, 'NumpadMemoryAdd');
  d(ScanCode.NumpadMemorySubtract, 'NumpadMemorySubtract');
  d(ScanCode.NumpadClear, 'NumpadClear');
  d(ScanCode.NumpadClearEntry, 'NumpadClearEntry');
  d(ScanCode.ControlLeft, 'ControlLeft');
  d(ScanCode.ShiftLeft, 'ShiftLeft');
  d(ScanCode.AltLeft, 'AltLeft');
  d(ScanCode.MetaLeft, 'MetaLeft');
  d(ScanCode.ControlRight, 'ControlRight');
  d(ScanCode.ShiftRight, 'ShiftRight');
  d(ScanCode.AltRight, 'AltRight');
  d(ScanCode.MetaRight, 'MetaRight');
  d(ScanCode.BrightnessUp, 'BrightnessUp');
  d(ScanCode.BrightnessDown, 'BrightnessDown');
  d(ScanCode.MediaPlay, 'MediaPlay');
  d(ScanCode.MediaRecord, 'MediaRecord');
  d(ScanCode.MediaFastForward, 'MediaFastForward');
  d(ScanCode.MediaRewind, 'MediaRewind');
  d(ScanCode.MediaTrackNext, 'MediaTrackNext');
  d(ScanCode.MediaTrackPrevious, 'MediaTrackPrevious');
  d(ScanCode.MediaStop, 'MediaStop');
  d(ScanCode.Eject, 'Eject');
  d(ScanCode.MediaPlayPause, 'MediaPlayPause');
  d(ScanCode.MediaSelect, 'MediaSelect');
  d(ScanCode.LaunchMail, 'LaunchMail');
  d(ScanCode.LaunchApp2, 'LaunchApp2');
  d(ScanCode.LaunchApp1, 'LaunchApp1');
  d(ScanCode.SelectTask, 'SelectTask');
  d(ScanCode.LaunchScreenSaver, 'LaunchScreenSaver');
  d(ScanCode.BrowserSearch, 'BrowserSearch');
  d(ScanCode.BrowserHome, 'BrowserHome');
  d(ScanCode.BrowserBack, 'BrowserBack');
  d(ScanCode.BrowserForward, 'BrowserForward');
  d(ScanCode.BrowserStop, 'BrowserStop');
  d(ScanCode.BrowserRefresh, 'BrowserRefresh');
  d(ScanCode.BrowserFavorites, 'BrowserFavorites');
  d(ScanCode.ZoomToggle, 'ZoomToggle');
  d(ScanCode.MailReply, 'MailReply');
  d(ScanCode.MailForward, 'MailForward');
  d(ScanCode.MailSend, 'MailSend');
})();

(function () {
  for (var i = 0; i <= ScanCode.MAX_VALUE; i++) {
    IMMUTABLE_CODE_TO_KEYCODE[i] = -1;
  }

  for (var _i = 0; _i <= _keyCodes.KeyCode.MAX_VALUE; _i++) {
    IMMUTABLE_KEYCODE_TO_CODE[_i] = -1;
  }

  function define(code, keyCode) {
    IMMUTABLE_CODE_TO_KEYCODE[code] = keyCode;

    if (keyCode !== _keyCodes.KeyCode.Unknown && keyCode !== _keyCodes.KeyCode.Enter && keyCode !== _keyCodes.KeyCode.Ctrl && keyCode !== _keyCodes.KeyCode.Shift && keyCode !== _keyCodes.KeyCode.Alt && keyCode !== _keyCodes.KeyCode.Meta) {
      IMMUTABLE_KEYCODE_TO_CODE[keyCode] = code;
    }
  } // Manually added due to the exclusion above (due to duplication with NumpadEnter)


  IMMUTABLE_KEYCODE_TO_CODE[_keyCodes.KeyCode.Enter] = ScanCode.Enter;
  define(ScanCode.None, _keyCodes.KeyCode.Unknown);
  define(ScanCode.Hyper, _keyCodes.KeyCode.Unknown);
  define(ScanCode.Super, _keyCodes.KeyCode.Unknown);
  define(ScanCode.Fn, _keyCodes.KeyCode.Unknown);
  define(ScanCode.FnLock, _keyCodes.KeyCode.Unknown);
  define(ScanCode.Suspend, _keyCodes.KeyCode.Unknown);
  define(ScanCode.Resume, _keyCodes.KeyCode.Unknown);
  define(ScanCode.Turbo, _keyCodes.KeyCode.Unknown);
  define(ScanCode.Sleep, _keyCodes.KeyCode.Unknown);
  define(ScanCode.WakeUp, _keyCodes.KeyCode.Unknown); // define(ScanCode.KeyA, KeyCode.Unknown);
  // define(ScanCode.KeyB, KeyCode.Unknown);
  // define(ScanCode.KeyC, KeyCode.Unknown);
  // define(ScanCode.KeyD, KeyCode.Unknown);
  // define(ScanCode.KeyE, KeyCode.Unknown);
  // define(ScanCode.KeyF, KeyCode.Unknown);
  // define(ScanCode.KeyG, KeyCode.Unknown);
  // define(ScanCode.KeyH, KeyCode.Unknown);
  // define(ScanCode.KeyI, KeyCode.Unknown);
  // define(ScanCode.KeyJ, KeyCode.Unknown);
  // define(ScanCode.KeyK, KeyCode.Unknown);
  // define(ScanCode.KeyL, KeyCode.Unknown);
  // define(ScanCode.KeyM, KeyCode.Unknown);
  // define(ScanCode.KeyN, KeyCode.Unknown);
  // define(ScanCode.KeyO, KeyCode.Unknown);
  // define(ScanCode.KeyP, KeyCode.Unknown);
  // define(ScanCode.KeyQ, KeyCode.Unknown);
  // define(ScanCode.KeyR, KeyCode.Unknown);
  // define(ScanCode.KeyS, KeyCode.Unknown);
  // define(ScanCode.KeyT, KeyCode.Unknown);
  // define(ScanCode.KeyU, KeyCode.Unknown);
  // define(ScanCode.KeyV, KeyCode.Unknown);
  // define(ScanCode.KeyW, KeyCode.Unknown);
  // define(ScanCode.KeyX, KeyCode.Unknown);
  // define(ScanCode.KeyY, KeyCode.Unknown);
  // define(ScanCode.KeyZ, KeyCode.Unknown);
  // define(ScanCode.Digit1, KeyCode.Unknown);
  // define(ScanCode.Digit2, KeyCode.Unknown);
  // define(ScanCode.Digit3, KeyCode.Unknown);
  // define(ScanCode.Digit4, KeyCode.Unknown);
  // define(ScanCode.Digit5, KeyCode.Unknown);
  // define(ScanCode.Digit6, KeyCode.Unknown);
  // define(ScanCode.Digit7, KeyCode.Unknown);
  // define(ScanCode.Digit8, KeyCode.Unknown);
  // define(ScanCode.Digit9, KeyCode.Unknown);
  // define(ScanCode.Digit0, KeyCode.Unknown);

  define(ScanCode.Enter, _keyCodes.KeyCode.Enter);
  define(ScanCode.Escape, _keyCodes.KeyCode.Escape);
  define(ScanCode.Backspace, _keyCodes.KeyCode.Backspace);
  define(ScanCode.Tab, _keyCodes.KeyCode.Tab);
  define(ScanCode.Space, _keyCodes.KeyCode.Space); // define(ScanCode.Minus, KeyCode.Unknown);
  // define(ScanCode.Equal, KeyCode.Unknown);
  // define(ScanCode.BracketLeft, KeyCode.Unknown);
  // define(ScanCode.BracketRight, KeyCode.Unknown);
  // define(ScanCode.Backslash, KeyCode.Unknown);
  // define(ScanCode.IntlHash, KeyCode.Unknown);
  // define(ScanCode.Semicolon, KeyCode.Unknown);
  // define(ScanCode.Quote, KeyCode.Unknown);
  // define(ScanCode.Backquote, KeyCode.Unknown);
  // define(ScanCode.Comma, KeyCode.Unknown);
  // define(ScanCode.Period, KeyCode.Unknown);
  // define(ScanCode.Slash, KeyCode.Unknown);

  define(ScanCode.CapsLock, _keyCodes.KeyCode.CapsLock);
  define(ScanCode.F1, _keyCodes.KeyCode.F1);
  define(ScanCode.F2, _keyCodes.KeyCode.F2);
  define(ScanCode.F3, _keyCodes.KeyCode.F3);
  define(ScanCode.F4, _keyCodes.KeyCode.F4);
  define(ScanCode.F5, _keyCodes.KeyCode.F5);
  define(ScanCode.F6, _keyCodes.KeyCode.F6);
  define(ScanCode.F7, _keyCodes.KeyCode.F7);
  define(ScanCode.F8, _keyCodes.KeyCode.F8);
  define(ScanCode.F9, _keyCodes.KeyCode.F9);
  define(ScanCode.F10, _keyCodes.KeyCode.F10);
  define(ScanCode.F11, _keyCodes.KeyCode.F11);
  define(ScanCode.F12, _keyCodes.KeyCode.F12);
  define(ScanCode.PrintScreen, _keyCodes.KeyCode.Unknown);
  define(ScanCode.ScrollLock, _keyCodes.KeyCode.ScrollLock);
  define(ScanCode.Pause, _keyCodes.KeyCode.PauseBreak);
  define(ScanCode.Insert, _keyCodes.KeyCode.Insert);
  define(ScanCode.Home, _keyCodes.KeyCode.Home);
  define(ScanCode.PageUp, _keyCodes.KeyCode.PageUp);
  define(ScanCode.Delete, _keyCodes.KeyCode.Delete);
  define(ScanCode.End, _keyCodes.KeyCode.End);
  define(ScanCode.PageDown, _keyCodes.KeyCode.PageDown);
  define(ScanCode.ArrowRight, _keyCodes.KeyCode.RightArrow);
  define(ScanCode.ArrowLeft, _keyCodes.KeyCode.LeftArrow);
  define(ScanCode.ArrowDown, _keyCodes.KeyCode.DownArrow);
  define(ScanCode.ArrowUp, _keyCodes.KeyCode.UpArrow);
  define(ScanCode.NumLock, _keyCodes.KeyCode.NumLock);
  define(ScanCode.NumpadDivide, _keyCodes.KeyCode.NUMPAD_DIVIDE);
  define(ScanCode.NumpadMultiply, _keyCodes.KeyCode.NUMPAD_MULTIPLY);
  define(ScanCode.NumpadSubtract, _keyCodes.KeyCode.NUMPAD_SUBTRACT);
  define(ScanCode.NumpadAdd, _keyCodes.KeyCode.NUMPAD_ADD);
  define(ScanCode.NumpadEnter, _keyCodes.KeyCode.Enter); // Duplicate

  define(ScanCode.Numpad1, _keyCodes.KeyCode.NUMPAD_1);
  define(ScanCode.Numpad2, _keyCodes.KeyCode.NUMPAD_2);
  define(ScanCode.Numpad3, _keyCodes.KeyCode.NUMPAD_3);
  define(ScanCode.Numpad4, _keyCodes.KeyCode.NUMPAD_4);
  define(ScanCode.Numpad5, _keyCodes.KeyCode.NUMPAD_5);
  define(ScanCode.Numpad6, _keyCodes.KeyCode.NUMPAD_6);
  define(ScanCode.Numpad7, _keyCodes.KeyCode.NUMPAD_7);
  define(ScanCode.Numpad8, _keyCodes.KeyCode.NUMPAD_8);
  define(ScanCode.Numpad9, _keyCodes.KeyCode.NUMPAD_9);
  define(ScanCode.Numpad0, _keyCodes.KeyCode.NUMPAD_0);
  define(ScanCode.NumpadDecimal, _keyCodes.KeyCode.NUMPAD_DECIMAL); // define(ScanCode.IntlBackslash, KeyCode.Unknown);

  define(ScanCode.ContextMenu, _keyCodes.KeyCode.ContextMenu);
  define(ScanCode.Power, _keyCodes.KeyCode.Unknown);
  define(ScanCode.NumpadEqual, _keyCodes.KeyCode.Unknown);
  define(ScanCode.F13, _keyCodes.KeyCode.F13);
  define(ScanCode.F14, _keyCodes.KeyCode.F14);
  define(ScanCode.F15, _keyCodes.KeyCode.F15);
  define(ScanCode.F16, _keyCodes.KeyCode.F16);
  define(ScanCode.F17, _keyCodes.KeyCode.F17);
  define(ScanCode.F18, _keyCodes.KeyCode.F18);
  define(ScanCode.F19, _keyCodes.KeyCode.F19);
  define(ScanCode.F20, _keyCodes.KeyCode.Unknown);
  define(ScanCode.F21, _keyCodes.KeyCode.Unknown);
  define(ScanCode.F22, _keyCodes.KeyCode.Unknown);
  define(ScanCode.F23, _keyCodes.KeyCode.Unknown);
  define(ScanCode.F24, _keyCodes.KeyCode.Unknown);
  define(ScanCode.Open, _keyCodes.KeyCode.Unknown);
  define(ScanCode.Help, _keyCodes.KeyCode.Unknown);
  define(ScanCode.Select, _keyCodes.KeyCode.Unknown);
  define(ScanCode.Again, _keyCodes.KeyCode.Unknown);
  define(ScanCode.Undo, _keyCodes.KeyCode.Unknown);
  define(ScanCode.Cut, _keyCodes.KeyCode.Unknown);
  define(ScanCode.Copy, _keyCodes.KeyCode.Unknown);
  define(ScanCode.Paste, _keyCodes.KeyCode.Unknown);
  define(ScanCode.Find, _keyCodes.KeyCode.Unknown);
  define(ScanCode.AudioVolumeMute, _keyCodes.KeyCode.Unknown);
  define(ScanCode.AudioVolumeUp, _keyCodes.KeyCode.Unknown);
  define(ScanCode.AudioVolumeDown, _keyCodes.KeyCode.Unknown);
  define(ScanCode.NumpadComma, _keyCodes.KeyCode.NUMPAD_SEPARATOR); // define(ScanCode.IntlRo, KeyCode.Unknown);

  define(ScanCode.KanaMode, _keyCodes.KeyCode.Unknown); // define(ScanCode.IntlYen, KeyCode.Unknown);

  define(ScanCode.Convert, _keyCodes.KeyCode.Unknown);
  define(ScanCode.NonConvert, _keyCodes.KeyCode.Unknown);
  define(ScanCode.Lang1, _keyCodes.KeyCode.Unknown);
  define(ScanCode.Lang2, _keyCodes.KeyCode.Unknown);
  define(ScanCode.Lang3, _keyCodes.KeyCode.Unknown);
  define(ScanCode.Lang4, _keyCodes.KeyCode.Unknown);
  define(ScanCode.Lang5, _keyCodes.KeyCode.Unknown);
  define(ScanCode.Abort, _keyCodes.KeyCode.Unknown);
  define(ScanCode.Props, _keyCodes.KeyCode.Unknown);
  define(ScanCode.NumpadParenLeft, _keyCodes.KeyCode.Unknown);
  define(ScanCode.NumpadParenRight, _keyCodes.KeyCode.Unknown);
  define(ScanCode.NumpadBackspace, _keyCodes.KeyCode.Unknown);
  define(ScanCode.NumpadMemoryStore, _keyCodes.KeyCode.Unknown);
  define(ScanCode.NumpadMemoryRecall, _keyCodes.KeyCode.Unknown);
  define(ScanCode.NumpadMemoryClear, _keyCodes.KeyCode.Unknown);
  define(ScanCode.NumpadMemoryAdd, _keyCodes.KeyCode.Unknown);
  define(ScanCode.NumpadMemorySubtract, _keyCodes.KeyCode.Unknown);
  define(ScanCode.NumpadClear, _keyCodes.KeyCode.Unknown);
  define(ScanCode.NumpadClearEntry, _keyCodes.KeyCode.Unknown);
  define(ScanCode.ControlLeft, _keyCodes.KeyCode.Ctrl); // Duplicate

  define(ScanCode.ShiftLeft, _keyCodes.KeyCode.Shift); // Duplicate

  define(ScanCode.AltLeft, _keyCodes.KeyCode.Alt); // Duplicate

  define(ScanCode.MetaLeft, _keyCodes.KeyCode.Meta); // Duplicate

  define(ScanCode.ControlRight, _keyCodes.KeyCode.Ctrl); // Duplicate

  define(ScanCode.ShiftRight, _keyCodes.KeyCode.Shift); // Duplicate

  define(ScanCode.AltRight, _keyCodes.KeyCode.Alt); // Duplicate

  define(ScanCode.MetaRight, _keyCodes.KeyCode.Meta); // Duplicate

  define(ScanCode.BrightnessUp, _keyCodes.KeyCode.Unknown);
  define(ScanCode.BrightnessDown, _keyCodes.KeyCode.Unknown);
  define(ScanCode.MediaPlay, _keyCodes.KeyCode.Unknown);
  define(ScanCode.MediaRecord, _keyCodes.KeyCode.Unknown);
  define(ScanCode.MediaFastForward, _keyCodes.KeyCode.Unknown);
  define(ScanCode.MediaRewind, _keyCodes.KeyCode.Unknown);
  define(ScanCode.MediaTrackNext, _keyCodes.KeyCode.Unknown);
  define(ScanCode.MediaTrackPrevious, _keyCodes.KeyCode.Unknown);
  define(ScanCode.MediaStop, _keyCodes.KeyCode.Unknown);
  define(ScanCode.Eject, _keyCodes.KeyCode.Unknown);
  define(ScanCode.MediaPlayPause, _keyCodes.KeyCode.Unknown);
  define(ScanCode.MediaSelect, _keyCodes.KeyCode.Unknown);
  define(ScanCode.LaunchMail, _keyCodes.KeyCode.Unknown);
  define(ScanCode.LaunchApp2, _keyCodes.KeyCode.Unknown);
  define(ScanCode.LaunchApp1, _keyCodes.KeyCode.Unknown);
  define(ScanCode.SelectTask, _keyCodes.KeyCode.Unknown);
  define(ScanCode.LaunchScreenSaver, _keyCodes.KeyCode.Unknown);
  define(ScanCode.BrowserSearch, _keyCodes.KeyCode.Unknown);
  define(ScanCode.BrowserHome, _keyCodes.KeyCode.Unknown);
  define(ScanCode.BrowserBack, _keyCodes.KeyCode.Unknown);
  define(ScanCode.BrowserForward, _keyCodes.KeyCode.Unknown);
  define(ScanCode.BrowserStop, _keyCodes.KeyCode.Unknown);
  define(ScanCode.BrowserRefresh, _keyCodes.KeyCode.Unknown);
  define(ScanCode.BrowserFavorites, _keyCodes.KeyCode.Unknown);
  define(ScanCode.ZoomToggle, _keyCodes.KeyCode.Unknown);
  define(ScanCode.MailReply, _keyCodes.KeyCode.Unknown);
  define(ScanCode.MailForward, _keyCodes.KeyCode.Unknown);
  define(ScanCode.MailSend, _keyCodes.KeyCode.Unknown);
})();