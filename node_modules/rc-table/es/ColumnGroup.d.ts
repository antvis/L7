import * as React from 'react';
export interface ColumnGroupProps {
    title?: React.ReactNode;
}
export default class ColumnGroup extends React.Component<ColumnGroupProps> {
    static isTableColumnGroup: boolean;
}
