/// <reference types="react" />
import { Omit } from '../_util/type';
import { TransferItem } from '.';
import { TransferListProps, RenderedItem } from './list';
export declare const OmitProps: ["handleFilter", "handleSelect", "handleSelectAll", "handleClear", "body", "checkedKeys"];
export declare type OmitProp = (typeof OmitProps)[number];
declare type PartialTransferListProps = Omit<TransferListProps, OmitProp>;
export interface TransferListBodyProps extends PartialTransferListProps {
    filteredItems: TransferItem[];
    filteredRenderItems: RenderedItem[];
    selectedKeys: string[];
}
declare const ListBodyWrapper: (props: TransferListBodyProps) => JSX.Element;
export default ListBodyWrapper;
