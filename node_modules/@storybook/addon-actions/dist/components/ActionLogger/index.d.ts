import { Theme } from '@storybook/theming';
import { ActionDisplay } from '../../models';
export declare const Wrapper: import("@emotion/styled-base").StyledComponent<any, Pick<any, string | number | symbol>, Theme>;
interface ActionLoggerProps {
    actions: ActionDisplay[];
    onClear: () => void;
}
export declare const ActionLogger: ({ actions, onClear }: ActionLoggerProps) => JSX.Element;
export {};
