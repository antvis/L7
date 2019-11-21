import { Context } from '@ant-design/create-react-context';
export interface RowContextState {
    gutter?: [number, number];
}
declare const RowContext: Context<RowContextState>;
export default RowContext;
