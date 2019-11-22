import { useEffect } from 'react';
import { isClient } from './util';
import useRafState from './useRafState';
var useWindowScroll = function () {
    var _a = useRafState({
        x: isClient ? window.pageXOffset : 0,
        y: isClient ? window.pageYOffset : 0,
    }), state = _a[0], setState = _a[1];
    useEffect(function () {
        var handler = function () {
            setState({
                x: window.pageXOffset,
                y: window.pageYOffset,
            });
        };
        window.addEventListener('scroll', handler, {
            capture: false,
            passive: true,
        });
        return function () {
            window.removeEventListener('scroll', handler);
        };
    }, []);
    return state;
};
export default useWindowScroll;
