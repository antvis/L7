import * as React from 'react';
import { Omit } from '../_util/type';
import { WrappedFormInternalProps } from './Form';
interface REACT_STATICS {
    childContextTypes: true;
    contextType: true;
    contextTypes: true;
    defaultProps: true;
    displayName: true;
    getDefaultProps: true;
    getDerivedStateFromError: true;
    getDerivedStateFromProps: true;
    mixins: true;
    propTypes: true;
    type: true;
}
interface KNOWN_STATICS {
    name: true;
    length: true;
    prototype: true;
    caller: true;
    callee: true;
    arguments: true;
    arity: true;
}
interface MEMO_STATICS {
    $$typeof: true;
    compare: true;
    defaultProps: true;
    displayName: true;
    propTypes: true;
    type: true;
}
interface FORWARD_REF_STATICS {
    $$typeof: true;
    render: true;
    defaultProps: true;
    displayName: true;
    propTypes: true;
}
declare type NonReactStatics<S extends React.ComponentType<any>, C extends {
    [key: string]: true;
} = {}> = {
    [key in Exclude<keyof S, S extends React.MemoExoticComponent<any> ? keyof MEMO_STATICS | keyof C : S extends React.ForwardRefExoticComponent<any> ? keyof FORWARD_REF_STATICS | keyof C : keyof REACT_STATICS | keyof KNOWN_STATICS | keyof C>]: S[key];
};
export declare type Matching<InjectedProps, DecorationTargetProps> = {
    [P in keyof DecorationTargetProps]: P extends keyof InjectedProps ? InjectedProps[P] extends DecorationTargetProps[P] ? DecorationTargetProps[P] : InjectedProps[P] : DecorationTargetProps[P];
};
export declare type GetProps<C> = C extends React.ComponentType<infer P> ? P : never;
export declare type ConnectedComponentClass<C extends React.ComponentType<any>, P> = React.ComponentClass<JSX.LibraryManagedAttributes<C, P>> & NonReactStatics<C> & {
    WrappedComponent: C;
};
export declare type FormWrappedProps<TOwnProps extends WrappedFormInternalProps> = <C extends React.ComponentType<Matching<TOwnProps, GetProps<C>>>>(component: C) => ConnectedComponentClass<C, Omit<TOwnProps, keyof WrappedFormInternalProps>>;
export {};
