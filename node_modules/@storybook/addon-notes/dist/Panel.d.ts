import { ReactElement } from 'react';
import { API } from '@storybook/api';
interface Props {
    active: boolean;
    api: API;
}
interface SyntaxHighlighterProps {
    className?: string;
    children: ReactElement;
    [key: string]: any;
}
export declare const SyntaxHighlighter: ({ className, children, ...props }: SyntaxHighlighterProps) => JSX.Element;
interface NotesLinkProps {
    href: string;
    children: ReactElement;
}
export declare const NotesLink: ({ href, children, ...props }: NotesLinkProps) => JSX.Element;
declare const NotesPanel: ({ active }: Props) => JSX.Element;
export default NotesPanel;
