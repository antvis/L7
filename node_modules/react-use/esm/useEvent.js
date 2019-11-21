import { useEffect } from 'react';
import { isClient } from './util';
var defaultTarget = isClient ? window : null;
var isListenerType1 = function (target) {
    return !!target.addEventListener;
};
var isListenerType2 = function (target) {
    return !!target.on;
};
var useEvent = function (name, handler, target, options) {
    if (target === void 0) { target = defaultTarget; }
    useEffect(function () {
        if (!handler) {
            return;
        }
        if (!target) {
            return;
        }
        if (isListenerType1(target)) {
            target.addEventListener(name, handler, options);
        }
        else if (isListenerType2(target)) {
            target.on(name, handler, options);
        }
        return function () {
            if (isListenerType1(target)) {
                target.removeEventListener(name, handler, options);
            }
            else if (isListenerType2(target)) {
                target.off(name, handler, options);
            }
        };
    }, [name, handler, target, JSON.stringify(options)]);
};
export default useEvent;
