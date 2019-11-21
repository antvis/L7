"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var react_1 = require("react");
var util_1 = require("./util");
var getConnection = function () {
    if (typeof navigator !== 'object') {
        return null;
    }
    var nav = navigator;
    return nav.connection || nav.mozConnection || nav.webkitConnection;
};
var getConnectionState = function () {
    var connection = getConnection();
    if (!connection) {
        return {};
    }
    var downlink = connection.downlink, downlinkMax = connection.downlinkMax, effectiveType = connection.effectiveType, type = connection.type, rtt = connection.rtt;
    return {
        downlink: downlink,
        downlinkMax: downlinkMax,
        effectiveType: effectiveType,
        type: type,
        rtt: rtt,
    };
};
var useNetwork = function (initialState) {
    if (initialState === void 0) { initialState = {}; }
    var _a = react_1.useState(initialState), state = _a[0], setState = _a[1];
    react_1.useEffect(function () {
        var localState = state;
        var localSetState = function (patch) {
            localState = tslib_1.__assign(tslib_1.__assign({}, localState), patch);
            setState(localState);
        };
        var connection = getConnection();
        var onOnline = function () {
            localSetState({
                online: true,
                since: new Date(),
            });
        };
        var onOffline = function () {
            localSetState({
                online: false,
                since: new Date(),
            });
        };
        var onConnectionChange = function () {
            localSetState(getConnectionState());
        };
        util_1.on(window, 'online', onOnline);
        util_1.on(window, 'offline', onOffline);
        if (connection) {
            util_1.on(connection, 'change', onConnectionChange);
            localSetState(tslib_1.__assign(tslib_1.__assign(tslib_1.__assign({}, state), { online: navigator.onLine, since: undefined }), getConnectionState()));
        }
        return function () {
            util_1.off(window, 'online', onOnline);
            util_1.off(window, 'offline', onOffline);
            if (connection) {
                util_1.off(connection, 'change', onConnectionChange);
            }
        };
    }, []);
    return state;
};
exports.default = useNetwork;
