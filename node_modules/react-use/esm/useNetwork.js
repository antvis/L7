import { __assign } from "tslib";
import { useEffect, useState } from 'react';
import { off, on } from './util';
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
    var _a = useState(initialState), state = _a[0], setState = _a[1];
    useEffect(function () {
        var localState = state;
        var localSetState = function (patch) {
            localState = __assign(__assign({}, localState), patch);
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
        on(window, 'online', onOnline);
        on(window, 'offline', onOffline);
        if (connection) {
            on(connection, 'change', onConnectionChange);
            localSetState(__assign(__assign(__assign({}, state), { online: navigator.onLine, since: undefined }), getConnectionState()));
        }
        return function () {
            off(window, 'online', onOnline);
            off(window, 'offline', onOffline);
            if (connection) {
                off(connection, 'change', onConnectionChange);
            }
        };
    }, []);
    return state;
};
export default useNetwork;
