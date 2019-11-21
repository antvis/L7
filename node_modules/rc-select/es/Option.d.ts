import * as PropTypes from 'prop-types';
import { Component } from 'react';
export interface IOptProps {
    title: string | number;
    label: string | number;
    value: string | number;
    key: string | number;
    className: string;
    disabled: boolean;
    testprop?: any;
}
export default class Option extends Component<Partial<IOptProps>> {
    static propTypes: {
        value: PropTypes.Requireable<string | number>;
    };
    static isSelectOption: boolean;
}
