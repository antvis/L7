import * as React from 'react';
export declare const IconMap: {
    success: string;
    error: string;
    info: string;
    warning: string;
};
export declare const ExceptionMap: {
    '404': () => JSX.Element;
    '500': () => JSX.Element;
    '403': () => JSX.Element;
};
export declare type ExceptionStatusType = keyof typeof ExceptionMap;
export declare type ResultStatusType = ExceptionStatusType | keyof typeof IconMap;
export interface ResultProps {
    icon?: React.ReactNode;
    status?: ResultStatusType;
    title?: React.ReactNode;
    subTitle?: React.ReactNode;
    extra?: React.ReactNode;
    prefixCls?: string;
    className?: string;
    style?: React.CSSProperties;
}
export interface ResultType extends React.SFC<ResultProps> {
    PRESENTED_IMAGE_404: React.ReactNode;
    PRESENTED_IMAGE_403: React.ReactNode;
    PRESENTED_IMAGE_500: React.ReactNode;
}
declare const Result: ResultType;
export default Result;
