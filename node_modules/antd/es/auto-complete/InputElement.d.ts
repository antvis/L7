import * as React from 'react';
export interface InputElementProps {
    children: React.ReactElement<any>;
}
export default class InputElement extends React.Component<InputElementProps, any> {
    saveRef: (ele: HTMLInputElement) => void;
    render(): React.ReactElement<any, string | ((props: any) => React.ReactElement<any, string | any | (new (props: any) => React.Component<any, any, any>)> | null) | (new (props: any) => React.Component<any, any, any>)>;
}
