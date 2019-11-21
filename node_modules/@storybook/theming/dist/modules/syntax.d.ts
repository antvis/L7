interface ColorsHash {
    [key: string]: string;
}
export declare const chromeDark: {
    BASE_FONT_FAMILY: string;
    BASE_FONT_SIZE: string;
    BASE_LINE_HEIGHT: number;
    BASE_BACKGROUND_COLOR: string;
    BASE_COLOR: string;
    OBJECT_PREVIEW_ARRAY_MAX_PROPERTIES: number;
    OBJECT_PREVIEW_OBJECT_MAX_PROPERTIES: number;
    OBJECT_NAME_COLOR: string;
    OBJECT_VALUE_NULL_COLOR: string;
    OBJECT_VALUE_UNDEFINED_COLOR: string;
    OBJECT_VALUE_REGEXP_COLOR: string;
    OBJECT_VALUE_STRING_COLOR: string;
    OBJECT_VALUE_SYMBOL_COLOR: string;
    OBJECT_VALUE_NUMBER_COLOR: string;
    OBJECT_VALUE_BOOLEAN_COLOR: string;
    OBJECT_VALUE_FUNCTION_PREFIX_COLOR: string;
    HTML_TAG_COLOR: string;
    HTML_TAGNAME_COLOR: string;
    HTML_TAGNAME_TEXT_TRANSFORM: string;
    HTML_ATTRIBUTE_NAME_COLOR: string;
    HTML_ATTRIBUTE_VALUE_COLOR: string;
    HTML_COMMENT_COLOR: string;
    HTML_DOCTYPE_COLOR: string;
    ARROW_COLOR: string;
    ARROW_MARGIN_RIGHT: number;
    ARROW_FONT_SIZE: number;
    ARROW_ANIMATION_DURATION: string;
    TREENODE_FONT_FAMILY: string;
    TREENODE_FONT_SIZE: string;
    TREENODE_LINE_HEIGHT: number;
    TREENODE_PADDING_LEFT: number;
    TABLE_BORDER_COLOR: string;
    TABLE_TH_BACKGROUND_COLOR: string;
    TABLE_TH_HOVER_COLOR: string;
    TABLE_SORT_ICON_COLOR: string;
    TABLE_DATA_BACKGROUND_IMAGE: string;
    TABLE_DATA_BACKGROUND_SIZE: string;
};
export declare const chromeLight: {
    BASE_FONT_FAMILY: string;
    BASE_FONT_SIZE: string;
    BASE_LINE_HEIGHT: number;
    BASE_BACKGROUND_COLOR: string;
    BASE_COLOR: string;
    OBJECT_PREVIEW_ARRAY_MAX_PROPERTIES: number;
    OBJECT_PREVIEW_OBJECT_MAX_PROPERTIES: number;
    OBJECT_NAME_COLOR: string;
    OBJECT_VALUE_NULL_COLOR: string;
    OBJECT_VALUE_UNDEFINED_COLOR: string;
    OBJECT_VALUE_REGEXP_COLOR: string;
    OBJECT_VALUE_STRING_COLOR: string;
    OBJECT_VALUE_SYMBOL_COLOR: string;
    OBJECT_VALUE_NUMBER_COLOR: string;
    OBJECT_VALUE_BOOLEAN_COLOR: string;
    OBJECT_VALUE_FUNCTION_PREFIX_COLOR: string;
    HTML_TAG_COLOR: string;
    HTML_TAGNAME_COLOR: string;
    HTML_TAGNAME_TEXT_TRANSFORM: string;
    HTML_ATTRIBUTE_NAME_COLOR: string;
    HTML_ATTRIBUTE_VALUE_COLOR: string;
    HTML_COMMENT_COLOR: string;
    HTML_DOCTYPE_COLOR: string;
    ARROW_COLOR: string;
    ARROW_MARGIN_RIGHT: number;
    ARROW_FONT_SIZE: number;
    ARROW_ANIMATION_DURATION: string;
    TREENODE_FONT_FAMILY: string;
    TREENODE_FONT_SIZE: string;
    TREENODE_LINE_HEIGHT: number;
    TREENODE_PADDING_LEFT: number;
    TABLE_BORDER_COLOR: string;
    TABLE_TH_BACKGROUND_COLOR: string;
    TABLE_TH_HOVER_COLOR: string;
    TABLE_SORT_ICON_COLOR: string;
    TABLE_DATA_BACKGROUND_IMAGE: string;
    TABLE_DATA_BACKGROUND_SIZE: string;
};
export declare const create: ({ colors, mono }: {
    colors: ColorsHash;
    mono: string;
}) => {
    token: {
        fontFamily: string;
        WebkitFontSmoothing: string;
        '&.comment': {
            fontStyle: string;
            color: string;
        };
        '&.prolog': {
            fontStyle: string;
            color: string;
        };
        '&.doctype': {
            fontStyle: string;
            color: string;
        };
        '&.cdata': {
            fontStyle: string;
            color: string;
        };
        '&.string': {
            color: string;
        };
        '&.punctuation': {
            color: string;
        };
        '&.operator': {
            color: string;
        };
        '&.url': {
            color: string;
        };
        '&.symbol': {
            color: string;
        };
        '&.number': {
            color: string;
        };
        '&.boolean': {
            color: string;
        };
        '&.variable': {
            color: string;
        };
        '&.constant': {
            color: string;
        };
        '&.inserted': {
            color: string;
        };
        '&.atrule': {
            color: string;
        };
        '&.keyword': {
            color: string;
        };
        '&.attr-value': {
            color: string;
        };
        '&.function': {
            color: string;
        };
        '&.deleted': {
            color: string;
        };
        '&.important': {
            fontWeight: string;
        };
        '&.bold': {
            fontWeight: string;
        };
        '&.italic': {
            fontStyle: string;
        };
        '&.class-name': {
            color: string;
        };
        '&.tag': {
            color: string;
        };
        '&.selector': {
            color: string;
        };
        '&.attr-name': {
            color: string;
        };
        '&.property': {
            color: string;
        };
        '&.regex': {
            color: string;
        };
        '&.entity': {
            color: string;
        };
        '&.directive.tag .tag': {
            color: string;
            background: string;
        };
    };
    'language-json .token.boolean': {
        color: string;
    };
    'language-json .token.number': {
        color: string;
    };
    'language-json .token.property': {
        color: string;
    };
    namespace: {
        opacity: number;
    };
};
export {};
