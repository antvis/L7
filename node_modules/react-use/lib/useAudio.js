"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var createHTMLMediaHook_1 = tslib_1.__importDefault(require("./util/createHTMLMediaHook"));
var useAudio = createHTMLMediaHook_1.default('audio');
exports.default = useAudio;
