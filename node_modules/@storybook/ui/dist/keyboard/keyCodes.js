"use strict";

require("core-js/modules/es.array.concat");

require("core-js/modules/es.object.create");

require("core-js/modules/es.object.define-property");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.KeyChord = KeyChord;
exports.createKeyBinding = createKeyBinding;
exports.createSimpleKeybinding = createSimpleKeybinding;
exports.ResolvedKeybinding = exports.ResolveKeybindingPart = exports.ChordKeybinding = exports.SimpleKeybinding = exports.KeybindingType = exports.KeyMod = exports.KeyCode = void 0;

var _platform = require("./platform");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var KeyCode;
exports.KeyCode = KeyCode;

(function (KeyCode) {
  KeyCode[KeyCode["Unknown"] = 0] = "Unknown";
  KeyCode[KeyCode["Backspace"] = 1] = "Backspace";
  KeyCode[KeyCode["Tab"] = 2] = "Tab";
  KeyCode[KeyCode["Enter"] = 3] = "Enter";
  KeyCode[KeyCode["Shift"] = 4] = "Shift";
  KeyCode[KeyCode["Ctrl"] = 5] = "Ctrl";
  KeyCode[KeyCode["Alt"] = 6] = "Alt";
  KeyCode[KeyCode["PauseBreak"] = 7] = "PauseBreak";
  KeyCode[KeyCode["CapsLock"] = 7] = "CapsLock";
  KeyCode[KeyCode["Escape"] = 9] = "Escape";
  KeyCode[KeyCode["Space"] = 10] = "Space";
  KeyCode[KeyCode["PageUp"] = 11] = "PageUp";
  KeyCode[KeyCode["PageDown"] = 12] = "PageDown";
  KeyCode[KeyCode["End"] = 13] = "End";
  KeyCode[KeyCode["Home"] = 14] = "Home";
  KeyCode[KeyCode["LeftArrow"] = 15] = "LeftArrow";
  KeyCode[KeyCode["UpArrow"] = 16] = "UpArrow";
  KeyCode[KeyCode["RightArrow"] = 17] = "RightArrow";
  KeyCode[KeyCode["DownArrow"] = 18] = "DownArrow";
  KeyCode[KeyCode["Insert"] = 19] = "Insert";
  KeyCode[KeyCode["Delete"] = 20] = "Delete";
  KeyCode[KeyCode["KEY_0"] = 21] = "KEY_0";
  KeyCode[KeyCode["KEY_1"] = 22] = "KEY_1";
  KeyCode[KeyCode["KEY_2"] = 23] = "KEY_2";
  KeyCode[KeyCode["KEY_3"] = 24] = "KEY_3";
  KeyCode[KeyCode["KEY_4"] = 25] = "KEY_4";
  KeyCode[KeyCode["KEY_5"] = 26] = "KEY_5";
  KeyCode[KeyCode["KEY_6"] = 27] = "KEY_6";
  KeyCode[KeyCode["KEY_7"] = 28] = "KEY_7";
  KeyCode[KeyCode["KEY_8"] = 29] = "KEY_8";
  KeyCode[KeyCode["KEY_9"] = 30] = "KEY_9";
  KeyCode[KeyCode["KEY_A"] = 31] = "KEY_A";
  KeyCode[KeyCode["KEY_B"] = 32] = "KEY_B";
  KeyCode[KeyCode["KEY_C"] = 33] = "KEY_C";
  KeyCode[KeyCode["KEY_D"] = 34] = "KEY_D";
  KeyCode[KeyCode["KEY_E"] = 35] = "KEY_E";
  KeyCode[KeyCode["KEY_F"] = 36] = "KEY_F";
  KeyCode[KeyCode["KEY_G"] = 37] = "KEY_G";
  KeyCode[KeyCode["KEY_H"] = 38] = "KEY_H";
  KeyCode[KeyCode["KEY_I"] = 39] = "KEY_I";
  KeyCode[KeyCode["KEY_J"] = 40] = "KEY_J";
  KeyCode[KeyCode["KEY_K"] = 41] = "KEY_K";
  KeyCode[KeyCode["KEY_L"] = 42] = "KEY_L";
  KeyCode[KeyCode["KEY_M"] = 43] = "KEY_M";
  KeyCode[KeyCode["KEY_N"] = 44] = "KEY_N";
  KeyCode[KeyCode["KEY_O"] = 45] = "KEY_O";
  KeyCode[KeyCode["KEY_P"] = 46] = "KEY_P";
  KeyCode[KeyCode["KEY_Q"] = 47] = "KEY_Q";
  KeyCode[KeyCode["KEY_R"] = 48] = "KEY_R";
  KeyCode[KeyCode["KEY_S"] = 49] = "KEY_S";
  KeyCode[KeyCode["KEY_T"] = 50] = "KEY_T";
  KeyCode[KeyCode["KEY_U"] = 51] = "KEY_U";
  KeyCode[KeyCode["KEY_V"] = 52] = "KEY_V";
  KeyCode[KeyCode["KEY_W"] = 53] = "KEY_W";
  KeyCode[KeyCode["KEY_X"] = 54] = "KEY_X";
  KeyCode[KeyCode["KEY_Y"] = 55] = "KEY_Y";
  KeyCode[KeyCode["KEY_Z"] = 56] = "KEY_Z";
  KeyCode[KeyCode["Meta"] = 57] = "Meta";
  KeyCode[KeyCode["ContextMenu"] = 58] = "ContextMenu";
  KeyCode[KeyCode["F1"] = 59] = "F1";
  KeyCode[KeyCode["F2"] = 60] = "F2";
  KeyCode[KeyCode["F3"] = 61] = "F3";
  KeyCode[KeyCode["F4"] = 62] = "F4";
  KeyCode[KeyCode["F5"] = 63] = "F5";
  KeyCode[KeyCode["F6"] = 64] = "F6";
  KeyCode[KeyCode["F7"] = 65] = "F7";
  KeyCode[KeyCode["F8"] = 66] = "F8";
  KeyCode[KeyCode["F9"] = 67] = "F9";
  KeyCode[KeyCode["F10"] = 68] = "F10";
  KeyCode[KeyCode["F11"] = 69] = "F11";
  KeyCode[KeyCode["F12"] = 70] = "F12";
  KeyCode[KeyCode["F13"] = 71] = "F13";
  KeyCode[KeyCode["F14"] = 72] = "F14";
  KeyCode[KeyCode["F15"] = 73] = "F15";
  KeyCode[KeyCode["F16"] = 74] = "F16";
  KeyCode[KeyCode["F17"] = 75] = "F17";
  KeyCode[KeyCode["F18"] = 76] = "F18";
  KeyCode[KeyCode["F19"] = 77] = "F19";
  KeyCode[KeyCode["NumLock"] = 78] = "NumLock";
  KeyCode[KeyCode["ScrollLock"] = 79] = "ScrollLock";
  KeyCode[KeyCode["US_SEMICOLON"] = 80] = "US_SEMICOLON";
  KeyCode[KeyCode["US_EQUAL"] = 81] = "US_EQUAL";
  KeyCode[KeyCode["US_COMMA"] = 82] = "US_COMMA";
  KeyCode[KeyCode["US_MINUS"] = 83] = "US_MINUS";
  KeyCode[KeyCode["US_DOT"] = 84] = "US_DOT";
  KeyCode[KeyCode["US_SLASH"] = 85] = "US_SLASH";
  KeyCode[KeyCode["US_BACKTICK"] = 86] = "US_BACKTICK";
  KeyCode[KeyCode["US_OPEN_SQUARE_BRACKET"] = 87] = "US_OPEN_SQUARE_BRACKET";
  KeyCode[KeyCode["US_BACKSLASH"] = 88] = "US_BACKSLASH";
  KeyCode[KeyCode["US_CLOSE_SQUARE_BRACKET"] = 89] = "US_CLOSE_SQUARE_BRACKET";
  KeyCode[KeyCode["US_QUOTE"] = 90] = "US_QUOTE";
  KeyCode[KeyCode["OEM_8"] = 91] = "OEM_8";
  KeyCode[KeyCode["OEM_102"] = 92] = "OEM_102";
  KeyCode[KeyCode["NUMPAD_0"] = 93] = "NUMPAD_0";
  KeyCode[KeyCode["NUMPAD_1"] = 94] = "NUMPAD_1";
  KeyCode[KeyCode["NUMPAD_2"] = 95] = "NUMPAD_2";
  KeyCode[KeyCode["NUMPAD_3"] = 96] = "NUMPAD_3";
  KeyCode[KeyCode["NUMPAD_4"] = 97] = "NUMPAD_4";
  KeyCode[KeyCode["NUMPAD_5"] = 98] = "NUMPAD_5";
  KeyCode[KeyCode["NUMPAD_6"] = 99] = "NUMPAD_6";
  KeyCode[KeyCode["NUMPAD_7"] = 100] = "NUMPAD_7";
  KeyCode[KeyCode["NUMPAD_8"] = 101] = "NUMPAD_8";
  KeyCode[KeyCode["NUMPAD_9"] = 102] = "NUMPAD_9";
  KeyCode[KeyCode["NUMPAD_MULTIPLY"] = 103] = "NUMPAD_MULTIPLY";
  KeyCode[KeyCode["NUMPAD_ADD"] = 104] = "NUMPAD_ADD";
  KeyCode[KeyCode["NUMPAD_SEPARATOR"] = 105] = "NUMPAD_SEPARATOR";
  KeyCode[KeyCode["NUMPAD_SUBTRACT"] = 106] = "NUMPAD_SUBTRACT";
  KeyCode[KeyCode["NUMPAD_DECIMAL"] = 107] = "NUMPAD_DECIMAL";
  KeyCode[KeyCode["NUMPAD_DIVIDE"] = 108] = "NUMPAD_DIVIDE";
  KeyCode[KeyCode["KEY_IN_COMPOSITION"] = 109] = "KEY_IN_COMPOSITION";
  KeyCode[KeyCode["ABNT_C1"] = 110] = "ABNT_C1";
  KeyCode[KeyCode["ABNT_C2"] = 111] = "ABNT_C2";
  KeyCode[KeyCode["MAX_VALUE"] = 112] = "MAX_VALUE";
})(KeyCode || (exports.KeyCode = KeyCode = {}));

var KeyCodeStrMap =
/*#__PURE__*/
function () {
  function KeyCodeStrMap() {
    _classCallCheck(this, KeyCodeStrMap);

    this._keyCodetoStr = void 0;
    this._strToKeyCode = void 0;
    this._keyCodetoStr = [];
    this._strToKeyCode = Object.create(null);
  }

  _createClass(KeyCodeStrMap, [{
    key: "define",
    value: function define(keyCode, str) {
      this._keyCodetoStr[keyCode] = str;
      this._strToKeyCode[str.toLowerCase()] = keyCode;
    }
  }, {
    key: "keyCodeToStr",
    value: function keyCodeToStr(keyCode) {
      return this._keyCodetoStr[keyCode];
    }
  }, {
    key: "strToKeyCode",
    value: function strToKeyCode(str) {
      return this._strToKeyCode[str.toLowerCase()] || KeyCode.Unknown;
    }
  }]);

  return KeyCodeStrMap;
}();

var uiMap = new KeyCodeStrMap();
var userSettingsUSMap = new KeyCodeStrMap();
var userSettingsGeneralMap = new KeyCodeStrMap();

(function () {
  function define(keyCode, uiLabel) {
    var usUserSettingsLabel = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : uiLabel;
    var generalUserSettingsLabel = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : usUserSettingsLabel;
    uiMap.define(keyCode, uiLabel);
    userSettingsUSMap.define(keyCode, usUserSettingsLabel);
    userSettingsGeneralMap.define(keyCode, generalUserSettingsLabel);
  }

  define(KeyCode.Unknown, 'unknown');
  define(KeyCode.Backspace, 'Backspace');
  define(KeyCode.Tab, 'Tab');
  define(KeyCode.Enter, 'Enter');
  define(KeyCode.Shift, 'Shift');
  define(KeyCode.Ctrl, 'Ctrl');
  define(KeyCode.Alt, 'Alt');
  define(KeyCode.PauseBreak, 'PauseBreak');
  define(KeyCode.CapsLock, 'CapsLock');
  define(KeyCode.Escape, 'Escape');
  define(KeyCode.Space, 'Space');
  define(KeyCode.PageUp, 'PageUp');
  define(KeyCode.PageDown, 'PageDown');
  define(KeyCode.End, 'End');
  define(KeyCode.Home, 'Home');
  define(KeyCode.LeftArrow, 'LeftArrow');
  define(KeyCode.UpArrow, 'UpArrow');
  define(KeyCode.RightArrow, 'RightArrow');
  define(KeyCode.DownArrow, 'DownArrow');
  define(KeyCode.Insert, 'Insert');
  define(KeyCode.Delete, 'Delete');
  define(KeyCode.KEY_0, 'KEY_0');
  define(KeyCode.KEY_1, 'KEY_1');
  define(KeyCode.KEY_2, 'KEY_2');
  define(KeyCode.KEY_3, 'KEY_3');
  define(KeyCode.KEY_4, 'KEY_4');
  define(KeyCode.KEY_5, 'KEY_5');
  define(KeyCode.KEY_6, 'KEY_6');
  define(KeyCode.KEY_7, 'KEY_7');
  define(KeyCode.KEY_8, 'KEY_8');
  define(KeyCode.KEY_9, 'KEY_9');
  define(KeyCode.KEY_A, 'KEY_A');
  define(KeyCode.KEY_B, 'KEY_B');
  define(KeyCode.KEY_C, 'KEY_C');
  define(KeyCode.KEY_D, 'KEY_D');
  define(KeyCode.KEY_E, 'KEY_E');
  define(KeyCode.KEY_F, 'KEY_F');
  define(KeyCode.KEY_G, 'KEY_G');
  define(KeyCode.KEY_H, 'KEY_H');
  define(KeyCode.KEY_I, 'KEY_I');
  define(KeyCode.KEY_J, 'KEY_J');
  define(KeyCode.KEY_K, 'KEY_K');
  define(KeyCode.KEY_L, 'KEY_L');
  define(KeyCode.KEY_M, 'KEY_M');
  define(KeyCode.KEY_N, 'KEY_N');
  define(KeyCode.KEY_O, 'KEY_O');
  define(KeyCode.KEY_P, 'KEY_P');
  define(KeyCode.KEY_Q, 'KEY_Q');
  define(KeyCode.KEY_R, 'KEY_R');
  define(KeyCode.KEY_S, 'KEY_S');
  define(KeyCode.KEY_T, 'KEY_T');
  define(KeyCode.KEY_U, 'KEY_U');
  define(KeyCode.KEY_V, 'KEY_V');
  define(KeyCode.KEY_W, 'KEY_W');
  define(KeyCode.KEY_X, 'KEY_X');
  define(KeyCode.KEY_Y, 'KEY_Y');
  define(KeyCode.KEY_Z, 'KEY_Z');
  define(KeyCode.Meta, 'Meta');
  define(KeyCode.ContextMenu, 'ContextMenu');
  define(KeyCode.F1, 'F1');
  define(KeyCode.F2, 'F2');
  define(KeyCode.F3, 'F3');
  define(KeyCode.F4, 'F4');
  define(KeyCode.F5, 'F5');
  define(KeyCode.F6, 'F6');
  define(KeyCode.F7, 'F7');
  define(KeyCode.F8, 'F8');
  define(KeyCode.F9, 'F9');
  define(KeyCode.F10, 'F10');
  define(KeyCode.F11, 'F11');
  define(KeyCode.F12, 'F12');
  define(KeyCode.F13, 'F13');
  define(KeyCode.F14, 'F14');
  define(KeyCode.F15, 'F15');
  define(KeyCode.F16, 'F16');
  define(KeyCode.F17, 'F17');
  define(KeyCode.F18, 'F18');
  define(KeyCode.F19, 'F19');
  define(KeyCode.NumLock, 'NumLock');
  define(KeyCode.ScrollLock, 'ScrollLock');
  define(KeyCode.US_SEMICOLON, ';', ';', 'OEM_1');
  define(KeyCode.US_EQUAL, '=', '=', 'OEM_PLUS');
  define(KeyCode.US_COMMA, ',', ',', 'OEM_COMMA');
  define(KeyCode.US_MINUS, '-', '-', 'OEM_MINUS');
  define(KeyCode.US_DOT, '.', '.', 'OEM_PERIOD');
  define(KeyCode.US_SLASH, '/', '/', 'OEM_2');
  define(KeyCode.US_BACKTICK, '`', '`', 'OEM_3');
  define(KeyCode.ABNT_C1, 'ABNT_C1');
  define(KeyCode.ABNT_C2, 'ABNT_C2');
  define(KeyCode.US_OPEN_SQUARE_BRACKET, '[', '[', 'OEM_4');
  define(KeyCode.US_BACKSLASH, '\\', '\\', 'OEM_5');
  define(KeyCode.US_CLOSE_SQUARE_BRACKET, ']', ']', 'OEM_6');
  define(KeyCode.US_QUOTE, "'", "'", 'OEM_7');
  define(KeyCode.OEM_8, 'OEM_8');
  define(KeyCode.OEM_102, 'OEM_102');
  define(KeyCode.NUMPAD_0, 'NumPad0');
  define(KeyCode.NUMPAD_1, 'NumPad1');
  define(KeyCode.NUMPAD_2, 'NumPad2');
  define(KeyCode.NUMPAD_3, 'NumPad3');
  define(KeyCode.NUMPAD_4, 'NumPad4');
  define(KeyCode.NUMPAD_5, 'NumPad5');
  define(KeyCode.NUMPAD_6, 'NumPad6');
  define(KeyCode.NUMPAD_7, 'NumPad7');
  define(KeyCode.NUMPAD_8, 'NumPad8');
  define(KeyCode.NUMPAD_9, 'NumPad9');
  define(KeyCode.NUMPAD_MULTIPLY, 'NumPad_Multiply');
  define(KeyCode.NUMPAD_ADD, 'NumPad_Add');
  define(KeyCode.NUMPAD_SEPARATOR, 'NumPad_Separator');
  define(KeyCode.NUMPAD_SUBTRACT, 'NumPad_Subtract');
  define(KeyCode.NUMPAD_DECIMAL, 'NumPad_Decimal');
  define(KeyCode.NUMPAD_DIVIDE, 'NumPad_Divide');
})(); // export namespace KeyCodeUtils {
//   export function toString(keyCode: KeyCode): string {
//     return uiMap.keyCodeToStr(keyCode);
//   }
//   export function fromString(key: string): KeyCode {
//     return uiMap.strToKeyCode(key);
//   }
// }

/**
 * Binary encoding strategy:
 * ```
 *    1111 11
 *    5432 1098 7654 3210
 *    ---- CSAW KKKK KKKK
 *  C = bit 11 = ctrlCmd flag
 *  S = bit 10 = shift flag
 *  A = bit 9 = alt flag
 *  W = bit 8 = winCtrl flag
 *  K = bits 0-7 = key code
 * ```
 */


var BinaryKeybindingsMask;

(function (BinaryKeybindingsMask) {
  BinaryKeybindingsMask[BinaryKeybindingsMask["CtrlCmd"] = 2048] = "CtrlCmd";
  BinaryKeybindingsMask[BinaryKeybindingsMask["Shift"] = 1024] = "Shift";
  BinaryKeybindingsMask[BinaryKeybindingsMask["Alt"] = 512] = "Alt";
  BinaryKeybindingsMask[BinaryKeybindingsMask["WinCtrl"] = 256] = "WinCtrl";
  BinaryKeybindingsMask[BinaryKeybindingsMask["KeyCode"] = 255] = "KeyCode";
})(BinaryKeybindingsMask || (BinaryKeybindingsMask = {}));

var KeyMod;
exports.KeyMod = KeyMod;

(function (KeyMod) {
  KeyMod[KeyMod["CtrlCmd"] = 2048] = "CtrlCmd";
  KeyMod[KeyMod["Shift"] = 1024] = "Shift";
  KeyMod[KeyMod["Alt"] = 512] = "Alt";
  KeyMod[KeyMod["WinCtrl"] = 256] = "WinCtrl";
})(KeyMod || (exports.KeyMod = KeyMod = {}));

function KeyChord(firstPart, secondPart) {
  var chordPart = (secondPart & 0x0000ffff) << 16 >>> 0;
  return (firstPart | chordPart) >>> 0;
}

var KeybindingType;
exports.KeybindingType = KeybindingType;

(function (KeybindingType) {
  KeybindingType[KeybindingType["Simple"] = 1] = "Simple";
  KeybindingType[KeybindingType["Chord"] = 2] = "Chord";
})(KeybindingType || (exports.KeybindingType = KeybindingType = {}));

var SimpleKeybinding =
/*#__PURE__*/
function () {
  function SimpleKeybinding(ctrlKey, shiftKey, altKey, metaKey, keyCode) {
    _classCallCheck(this, SimpleKeybinding);

    this.type = KeybindingType.Simple;
    this.ctrlKey = void 0;
    this.shiftKey = void 0;
    this.altKey = void 0;
    this.metaKey = void 0;
    this.keyCode = void 0;
    this.ctrlKey = ctrlKey;
    this.shiftKey = shiftKey;
    this.altKey = altKey;
    this.metaKey = metaKey;
    this.keyCode = keyCode;
  }

  _createClass(SimpleKeybinding, [{
    key: "equals",
    value: function equals(other) {
      if (other.type !== KeybindingType.Simple) {
        return false;
      }

      return this.ctrlKey === other.ctrlKey && this.shiftKey === other.shiftKey && this.altKey === other.altKey && this.metaKey === other.metaKey && this.keyCode === other.keyCode;
    }
  }, {
    key: "getHashCode",
    value: function getHashCode() {
      var ctrl = this.ctrlKey ? '1' : '0';
      var shift = this.shiftKey ? '1' : '0';
      var alt = this.altKey ? '1' : '0';
      var meta = this.metaKey ? '1' : '0';
      return "".concat(ctrl).concat(shift).concat(alt).concat(meta).concat(this.keyCode);
    }
  }, {
    key: "isModifierKey",
    value: function isModifierKey() {
      return this.keyCode === KeyCode.Unknown || this.keyCode === KeyCode.Ctrl || this.keyCode === KeyCode.Meta || this.keyCode === KeyCode.Alt || this.keyCode === KeyCode.Shift;
    }
  }, {
    key: "isDupliateModifierCase",
    value: function isDupliateModifierCase() {
      return this.ctrlKey && this.keyCode === KeyCode.Ctrl || this.shiftKey && this.keyCode === KeyCode.Shift || this.altKey && this.keyCode === KeyCode.Alt || this.metaKey && this.keyCode === KeyCode.Meta;
    }
  }]);

  return SimpleKeybinding;
}();

exports.SimpleKeybinding = SimpleKeybinding;

var ChordKeybinding =
/*#__PURE__*/
function () {
  function ChordKeybinding(firstPart, chordPart) {
    _classCallCheck(this, ChordKeybinding);

    this.type = KeybindingType.Chord;
    this.firstPart = void 0;
    this.chordPart = void 0;
    this.firstPart = firstPart;
    this.chordPart = chordPart;
  }

  _createClass(ChordKeybinding, [{
    key: "getHashCode",
    value: function getHashCode() {
      return "".concat(this.firstPart.getHashCode(), ";").concat(this.chordPart.getHashCode());
    }
  }]);

  return ChordKeybinding;
}();

exports.ChordKeybinding = ChordKeybinding;

function createKeyBinding(keybinding, OS) {
  if (keybinding === 0) {
    return null;
  }

  var firstPart = (keybinding & 0x0000ffff) >>> 0;
  var chordPart = (keybinding & 0xffff0000) >>> 16;

  if (chordPart !== 0) {
    return new ChordKeybinding(createSimpleKeybinding(firstPart, OS), createSimpleKeybinding(chordPart, OS));
  }

  return createSimpleKeybinding(firstPart, OS);
}

function createSimpleKeybinding(keybinding, OS) {
  var ctrlCmd = !!(keybinding & BinaryKeybindingsMask.CtrlCmd);
  var winCtrl = !!(keybinding & BinaryKeybindingsMask.WinCtrl);
  var ctrlKey = OS === _platform.OperatingSystem.Macintosh ? winCtrl : ctrlCmd;
  var shiftKey = !!(keybinding & BinaryKeybindingsMask.Shift);
  var altKey = !!(keybinding & BinaryKeybindingsMask.Alt);
  var metaKey = OS === _platform.OperatingSystem.Macintosh ? ctrlCmd : winCtrl;
  var keyCode = keybinding & BinaryKeybindingsMask.KeyCode;
  return new SimpleKeybinding(ctrlKey, shiftKey, altKey, metaKey, keyCode);
}

var ResolveKeybindingPart = function ResolveKeybindingPart(ctrlKey, shiftKey, altKey, metaKey, kbLabel, kbAriaLabel) {
  _classCallCheck(this, ResolveKeybindingPart);

  this.ctrlKey = void 0;
  this.shiftKey = void 0;
  this.altKey = void 0;
  this.metaKey = void 0;
  this.keyLabel = void 0;
  this.keyAriaLabel = void 0;
  this.ctrlKey = ctrlKey;
  this.shiftKey = shiftKey;
  this.altKey = altKey;
  this.metaKey = metaKey;
  this.keyLabel = kbLabel;
  this.keyAriaLabel = kbAriaLabel;
};

exports.ResolveKeybindingPart = ResolveKeybindingPart;

var ResolvedKeybinding = function ResolvedKeybinding() {
  _classCallCheck(this, ResolvedKeybinding);
};

exports.ResolvedKeybinding = ResolvedKeybinding;