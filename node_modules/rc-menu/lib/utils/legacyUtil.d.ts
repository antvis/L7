import { MotionType, AnimationType, TransitionNameType } from '../interface';
interface GetMotionProps {
    motion?: MotionType;
    openAnimation?: AnimationType;
    openTransitionName?: TransitionNameType;
    prefixCls?: string;
}
export declare function getMotion({ prefixCls, motion, openAnimation, openTransitionName, }: GetMotionProps): MotionType;
export {};
