import { useEffect, useState, useMemo } from 'react';
var createBreakpoint = function (breakpoints) {
    if (breakpoints === void 0) { breakpoints = { laptopL: 1440, laptop: 1024, tablet: 768 }; }
    return function () {
        var _a = useState(0), screen = _a[0], setScreen = _a[1];
        useEffect(function () {
            var setSideScreen = function () {
                setScreen(window.innerWidth);
            };
            setSideScreen();
            window.addEventListener('resize', setSideScreen);
            return function () {
                window.removeEventListener('resize', setSideScreen);
            };
        });
        var sortedBreakpoints = useMemo(function () { return Object.entries(breakpoints).sort(function (a, b) { return (a[1] >= b[1] ? 1 : -1); }); }, [
            breakpoints,
        ]);
        var result = sortedBreakpoints.reduce(function (acc, _a) {
            var name = _a[0], width = _a[1];
            if (screen >= width) {
                return name;
            }
            else {
                return acc;
            }
        }, sortedBreakpoints[0][0]);
        return result;
    };
};
export default createBreakpoint;
