import { Component } from 'react';
export interface IOptGroupProps {
    label: string;
    value: string | number;
    key: string | number;
    testprop?: any;
}
export default class OptGroup extends Component<Partial<IOptGroupProps>> {
    static isSelectOptGroup: boolean;
}
