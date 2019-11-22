import { Module } from '../index';
export interface Notification {
    id: string;
    onClear?: () => void;
}
export interface SubState {
    notifications: Notification[];
}
export interface SubAPI {
    addNotification: (notification: Notification) => void;
    clearNotification: (id: string) => void;
}
export default function ({ store }: Module): {
    api: {
        addNotification: (notification: Notification) => void;
        clearNotification: (id: string) => void;
    };
    state: SubState;
};
