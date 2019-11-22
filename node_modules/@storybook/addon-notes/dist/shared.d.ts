export declare const ADDON_ID = "storybookjs/notes";
export declare const PANEL_ID: string;
export declare const PARAM_KEY = "notes";
interface TextParameter {
    text: string;
}
interface MarkdownParameter {
    markdown: string;
}
interface DisabledParameter {
    disable: boolean;
}
declare type TabsParameter = Record<string, string>;
export declare type Parameters = string | TextParameter | MarkdownParameter | DisabledParameter | TabsParameter;
export {};
