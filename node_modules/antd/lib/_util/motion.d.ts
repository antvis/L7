import * as React from 'react';
declare type MotionFunc = (element: HTMLElement) => React.CSSProperties;
interface Motion {
    visible?: boolean;
    motionName?: string;
    motionAppear?: boolean;
    motionEnter?: boolean;
    motionLeave?: boolean;
    motionLeaveImmediately?: boolean;
    removeOnLeave?: boolean;
    leavedClassName?: string;
    onAppearStart?: MotionFunc;
    onAppearActive?: MotionFunc;
    onAppearEnd?: MotionFunc;
    onEnterStart?: MotionFunc;
    onEnterActive?: MotionFunc;
    onEnterEnd?: MotionFunc;
    onLeaveStart?: MotionFunc;
    onLeaveActive?: MotionFunc;
    onLeaveEnd?: MotionFunc;
}
declare const collapseMotion: Motion;
export default collapseMotion;
