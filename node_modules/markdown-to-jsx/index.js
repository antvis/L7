/* @jsx h */
/**
 * markdown-to-jsx@6 is a fork of [simple-markdown v0.2.2](https://github.com/Khan/simple-markdown)
 * from Khan Academy. Thank you Khan devs for making such an awesome and extensible
 * parsing infra... without it, half of the optimizations here wouldn't be feasible. 🙏🏼
 */
import React from 'react';
import unquote from 'unquote';

/** TODO: Drop for React 16? */
const ATTRIBUTE_TO_JSX_PROP_MAP = {
  accesskey: 'accessKey',
  allowfullscreen: 'allowFullScreen',
  allowtransparency: 'allowTransparency',
  autocomplete: 'autoComplete',
  autofocus: 'autoFocus',
  autoplay: 'autoPlay',
  cellpadding: 'cellPadding',
  cellspacing: 'cellSpacing',
  charset: 'charSet',
  class: 'className',
  classid: 'classId',
  colspan: 'colSpan',
  contenteditable: 'contentEditable',
  contextmenu: 'contextMenu',
  crossorigin: 'crossOrigin',
  enctype: 'encType',
  for: 'htmlFor',
  formaction: 'formAction',
  formenctype: 'formEncType',
  formmethod: 'formMethod',
  formnovalidate: 'formNoValidate',
  formtarget: 'formTarget',
  frameborder: 'frameBorder',
  hreflang: 'hrefLang',
  inputmode: 'inputMode',
  keyparams: 'keyParams',
  keytype: 'keyType',
  marginheight: 'marginHeight',
  marginwidth: 'marginWidth',
  maxlength: 'maxLength',
  mediagroup: 'mediaGroup',
  minlength: 'minLength',
  novalidate: 'noValidate',
  radiogroup: 'radioGroup',
  readonly: 'readOnly',
  rowspan: 'rowSpan',
  spellcheck: 'spellCheck',
  srcdoc: 'srcDoc',
  srclang: 'srcLang',
  srcset: 'srcSet',
  tabindex: 'tabIndex',
  usemap: 'useMap',
};

const namedCodesToUnicode = {
  amp: '\u0026',
  apos: '\u0027',
  gt: '\u003e',
  lt: '\u003c',
  nbsp: '\u00a0',
  quot: '\u201c',
};

const DO_NOT_PROCESS_HTML_ELEMENTS = ['style', 'script'];

/**
 * the attribute extractor regex looks for a valid attribute name,
 * followed by an equal sign (whitespace around the equal sign is allowed), followed
 * by one of the following:
 *
 * 1. a single quote-bounded string, e.g. 'foo'
 * 2. a double quote-bounded string, e.g. "bar"
 * 3. an interpolation, e.g. {something}
 *
 * JSX can be be interpolated into itself and is passed through the compiler using
 * the same options and setup as the current run.
 *
 * <Something children={<SomeOtherThing />} />
 *                      ==================
 *                              ↳ children: [<SomeOtherThing />]
 *
 * Otherwise, interpolations are handled as strings or simple booleans
 * unless HTML syntax is detected.
 *
 * <Something color={green} disabled={true} />
 *                   =====            ====
 *                     ↓                ↳ disabled: true
 *                     ↳ color: "green"
 *
 * Numbers are not parsed at this time due to complexities around int, float,
 * and the upcoming bigint functionality that would make handling it unwieldy.
 * Parse the string in your component as desired.
 *
 * <Something someBigNumber={123456789123456789} />
 *                           ==================
 *                                   ↳ someBigNumber: "123456789123456789"
 */
const ATTR_EXTRACTOR_R = /([-A-Z0-9_:]+)(?:\s*=\s*(?:(?:"((?:\\.|[^"])*)")|(?:'((?:\\.|[^'])*)')|(?:\{((?:\\.|{[^}]*?}|[^}])*)\})))?/gi;

/** TODO: Write explainers for each of these */

const AUTOLINK_MAILTO_CHECK_R = /mailto:/i;
const BLOCK_END_R = /\n{2,}$/;
const BLOCKQUOTE_R = /^( *>[^\n]+(\n[^\n]+)*\n*)+\n{2,}/;
const BLOCKQUOTE_TRIM_LEFT_MULTILINE_R = /^ *> ?/gm;
const BREAK_LINE_R = /^ {2,}\n/;
const BREAK_THEMATIC_R = /^(?:( *[-*_]) *){3,}(?:\n *)+\n/;
const CODE_BLOCK_FENCED_R = /^\s*(`{3,}|~{3,}) *(\S+)? *\n([\s\S]+?)\s*\1 *(?:\n *)+\n?/;
const CODE_BLOCK_R = /^(?: {4}[^\n]+\n*)+(?:\n *)+\n?/;
const CODE_INLINE_R = /^(`+)\s*([\s\S]*?[^`])\s*\1(?!`)/;
const CONSECUTIVE_NEWLINE_R = /^(?:\n *)*\n/;
const CR_NEWLINE_R = /\r\n?/g;
const FOOTNOTE_R = /^\[\^(.*)\](:.*)\n/;
const FOOTNOTE_REFERENCE_R = /^\[\^(.*)\]/;
const FORMFEED_R = /\f/g;
const GFM_TASK_R = /^\s*?\[(x|\s)\]/;
const HEADING_R = /^ *(#{1,6}) *([^\n]+)\n{0,2}/;
const HEADING_SETEXT_R = /^([^\n]+)\n *(=|-){3,} *(?:\n *)+\n/;

/**
 * Explanation:
 *
 * 1. Look for a starting tag, preceeded by any amount of spaces
 *    ^ *<
 *
 * 2. Capture the tag name (capture 1)
 *    ([^ >/]+)
 *
 * 3. Ignore a space after the starting tag and capture the attribute portion of the tag (capture 2)
 *     ?([^>]*)\/{0}>
 *
 * 4. Ensure a matching closing tag is present in the rest of the input string
 *    (?=[\s\S]*<\/\1>)
 *
 * 5. Capture everything until the matching closing tag -- this might include additional pairs
 *    of the same tag type found in step 2 (capture 3)
 *    ((?:[\s\S]*?(?:<\1[^>]*>[\s\S]*?<\/\1>)*[\s\S]*?)*?)<\/\1>
 *
 * 6. Capture excess newlines afterward
 *    \n*
 */
const HTML_BLOCK_ELEMENT_R = /^ *(?!<[a-z][^ >/]* ?\/>)<([a-z][^ >/]*) ?([^>]*)\/{0}>\n?(\s*(?:<\1[^>]*?>[\s\S]*?<\/\1>|(?!<\1)[\s\S])*?)<\/\1>\n*/i;

const HTML_CHAR_CODE_R = /&([a-z]+);/g;

const HTML_COMMENT_R = /^<!--.*?-->/;

/**
 * borrowed from React 15(https://github.com/facebook/react/blob/894d20744cba99383ffd847dbd5b6e0800355a5c/src/renderers/dom/shared/HTMLDOMPropertyConfig.js)
 */
const HTML_CUSTOM_ATTR_R = /^(data|aria|x)-[a-z_][a-z\d_.-]*$/;

const HTML_SELF_CLOSING_ELEMENT_R = /^ *<([a-z][a-z0-9:]*)(?:\s+((?:<.*?>|[^>])*))?\/?>(?!<\/\1>)(\s*\n)?/i;
const INTERPOLATION_R = /^\{.*\}$/;
const LINK_AUTOLINK_BARE_URL_R = /^(https?:\/\/[^\s<]+[^<.,:;"')\]\s])/;
const LINK_AUTOLINK_MAILTO_R = /^<([^ >]+@[^ >]+)>/;
const LINK_AUTOLINK_R = /^<([^ >]+:\/[^ >]+)>/;
const LIST_ITEM_END_R = / *\n+$/;
const LIST_LOOKBEHIND_R = /(?:^|\n)( *)$/;
const CAPTURE_LETTER_AFTER_HYPHEN = /-([a-z])?/gi;
const NP_TABLE_R = /^(.*\|?.*)\n *(\|? *[-:]+ *\|[-| :]*)\n((?:.*\|.*\n)*)\n?/;
const PARAGRAPH_R = /^((?:[^\n]|\n(?! *\n))+)(?:\n *)+\n/;
const REFERENCE_IMAGE_OR_LINK = /^\[([^\]]*)\]:\s*(\S+)\s*("([^"]*)")?/;
const REFERENCE_IMAGE_R = /^!\[([^\]]*)\] ?\[([^\]]*)\]/;
const REFERENCE_LINK_R = /^\[([^\]]*)\] ?\[([^\]]*)\]/;
const SQUARE_BRACKETS_R = /(\[|\])/g;
const SHOULD_RENDER_AS_BLOCK_R = /(\n|^[-*]\s|^#|^ {2,}|^-{2,}|^>\s)/;
const TAB_R = /\t/g;
const TABLE_SEPARATOR_R = /^ *\| */;
const TABLE_TRIM_PIPES = /(^ *\||\| *$)/g;
const TABLE_CELL_END_TRIM = / *$/;
const TABLE_CENTER_ALIGN = /^ *:-+: *$/;
const TABLE_LEFT_ALIGN = /^ *:-+ *$/;
const TABLE_RIGHT_ALIGN = /^ *-+: *$/;

const TEXT_BOLD_R = /^([*_])\1((?:\[.*?\][([].*?[)\]]|<.*?>(?:.*?<.*?>)?|`.*?`|~+.*?~+|.)*?)\1\1(?!\1)/;
const TEXT_EMPHASIZED_R = /^([*_])((?:\[.*?\][([].*?[)\]]|<.*?>(?:.*?<.*?>)?|`.*?`|~+.*?~+|.)*?)\1(?!\1)/;
const TEXT_STRIKETHROUGHED_R = /^~~((?:\[.*?\]|<.*?>(?:.*?<.*?>)?|`.*?`|.)*?)~~/;

const TEXT_ESCAPED_R = /^\\([^0-9A-Za-z\s])/;
const TEXT_PLAIN_R = /^[\s\S]+?(?=[^0-9A-Z\s\u00c0-\uffff&;.()'"]|\d+\.|\n\n| {2,}\n|\w+:\S|$)/i;
const TRIM_NEWLINES_AND_TRAILING_WHITESPACE_R = /(^\n+|\n+$|\s+$)/g;

const HTML_LEFT_TRIM_AMOUNT_R = /^([ \t]*)/;

const UNESCAPE_URL_R = /\\([^0-9A-Z\s])/gi;

// recognize a `*` `-`, `+`, `1.`, `2.`... list bullet
const LIST_BULLET = '(?:[*+-]|\\d+\\.)';

// recognize the start of a list item:
// leading space plus a bullet plus a space (`   * `)
const LIST_ITEM_PREFIX = '( *)(' + LIST_BULLET + ') +';
const LIST_ITEM_PREFIX_R = new RegExp('^' + LIST_ITEM_PREFIX);

// recognize an individual list item:
//  * hi
//    this is part of the same item
//
//    as is this, which is a new paragraph in the same item
//
//  * but this is not part of the same item
const LIST_ITEM_R = new RegExp(
  LIST_ITEM_PREFIX +
    '[^\\n]*(?:\\n' +
    '(?!\\1' +
    LIST_BULLET +
    ' )[^\\n]*)*(\\n|$)',
  'gm'
);

// check whether a list item has paragraphs: if it does,
// we leave the newlines at the end
const LIST_R = new RegExp(
  '^( *)(' +
    LIST_BULLET +
    ') ' +
    '[\\s\\S]+?(?:\\n{2,}(?! )' +
    '(?!\\1' +
    LIST_BULLET +
    ' (?!' +
    LIST_BULLET +
    ' ))\\n*' +
    // the \\s*$ here is so that we can parse the inside of nested
    // lists, where our content might end before we receive two `\n`s
    '|\\s*\\n*$)'
);

const LINK_INSIDE = '(?:\\[[^\\]]*\\]|[^\\[\\]]|\\](?=[^\\[]*\\]))*';
const LINK_HREF_AND_TITLE =
  '\\s*<?((?:[^\\s\\\\]|\\\\.)*?)>?(?:\\s+[\'"]([\\s\\S]*?)[\'"])?\\s*';

const LINK_R = new RegExp(
  '^\\[(' + LINK_INSIDE + ')\\]\\(' + LINK_HREF_AND_TITLE + '\\)'
);

const IMAGE_R = new RegExp(
  '^!\\[(' + LINK_INSIDE + ')\\]\\(' + LINK_HREF_AND_TITLE + '\\)'
);

const BLOCK_SYNTAXES = [
  BLOCKQUOTE_R,
  CODE_BLOCK_R,
  CODE_BLOCK_FENCED_R,
  HEADING_R,
  HEADING_SETEXT_R,
  HTML_BLOCK_ELEMENT_R,
  HTML_COMMENT_R,
  HTML_SELF_CLOSING_ELEMENT_R,
  LIST_ITEM_R,
  LIST_R,
  NP_TABLE_R,
  PARAGRAPH_R,
];

function containsBlockSyntax(input) {
  return BLOCK_SYNTAXES.some(r => r.test(input));
}

// based on https://stackoverflow.com/a/18123682/1141611
// not complete, but probably good enough
function slugify(str) {
  return str
    .replace(/[ÀÁÂÃÄÅàáâãäåæÆ]/g, 'a')
    .replace(/[çÇ]/g, 'c')
    .replace(/[ðÐ]/g, 'd')
    .replace(/[ÈÉÊËéèêë]/g, 'e')
    .replace(/[ÏïÎîÍíÌì]/g, 'i')
    .replace(/[Ññ]/g, 'n')
    .replace(/[øØœŒÕõÔôÓóÒò]/g, 'o')
    .replace(/[ÜüÛûÚúÙù]/g, 'u')
    .replace(/[ŸÿÝý]/g, 'y')
    .replace(/[^a-z0-9- ]/gi, '')
    .replace(/ /gi, '-')
    .toLowerCase();
}

function parseTableAlignCapture(alignCapture) {
  if (TABLE_RIGHT_ALIGN.test(alignCapture)) {
    return 'right';
  } else if (TABLE_CENTER_ALIGN.test(alignCapture)) {
    return 'center';
  } else if (TABLE_LEFT_ALIGN.test(alignCapture)) {
    return 'left';
  }

  return null;
}

function parseTableRow(source, parse, state) {
  const prevInTable = state.inTable;
  state.inTable = true;
  const tableRow = parse(source.trim(), state);
  state.inTable = prevInTable;

  let cells = [[]];
  tableRow.forEach(function(node, i) {
    if (node.type === 'tableSeparator') {
      // Filter out empty table separators at the start/end:
        if (i !== 0 && i !== tableRow.length - 1) {
          // Split the current row:
          cells.push([]);
        }
    } else {
      if (node.type === 'text' && (
        tableRow[i + 1] == null ||
        tableRow[i + 1].type === 'tableSeparator'
      )) {
        node.content = node.content.replace(TABLE_CELL_END_TRIM, "");
      }
      cells[cells.length - 1].push(node);
    }
  });
  return cells;
}

function parseTableAlign(source /*, parse, state*/) {
  const alignText = source
    .replace(TABLE_TRIM_PIPES, '')
    .split('|');

  return alignText.map(parseTableAlignCapture);
}

function parseTableCells(source, parse, state) {
  const rowsText = source
    .trim()
    .split('\n');

  return rowsText.map(function(rowText) {
      return parseTableRow(rowText, parse, state);
  });
}

function parseTable(capture, parse, state) {
  state.inline = true;
  const header = parseTableRow(capture[1], parse, state);
  const align = parseTableAlign(capture[2], parse, state);
  const cells = parseTableCells(capture[3], parse, state);
  state.inline = false;

  return {
    align: align,
    cells: cells,
    header: header,
    type: 'table',
  };
}

function getTableStyle(node, colIndex) {
  return node.align[colIndex] == null
    ? {}
    : {
        textAlign: node.align[colIndex],
      };
}

/** TODO: remove for react 16 */
function normalizeAttributeKey(key) {
  const hyphenIndex = key.indexOf('-');

  if (hyphenIndex !== -1 && key.match(HTML_CUSTOM_ATTR_R) === null) {
    key = key.replace(CAPTURE_LETTER_AFTER_HYPHEN, function(_, letter) {
      return letter.toUpperCase();
    });
  }

  return key;
}

function attributeValueToJSXPropValue(key, value) {
  if (key === 'style') {
    return value.split(/;\s?/).reduce(function(styles, kvPair) {
      const key = kvPair.slice(0, kvPair.indexOf(':'));

      // snake-case to camelCase
      // also handles PascalCasing vendor prefixes
      const camelCasedKey = key.replace(/(-[a-z])/g, substr =>
        substr[1].toUpperCase()
      );

      // key.length + 1 to skip over the colon
      styles[camelCasedKey] = kvPair.slice(key.length + 1).trim();

      return styles;
    }, {});
  } else if (key === 'href') {
    return sanitizeUrl(value)
  } else if (value.match(INTERPOLATION_R)) {
    // return as a string and let the consumer decide what to do with it
    value = value.slice(1, value.length - 1);
  }

  if (value === 'true') {
    return true;
  } else if (value === 'false') {
    return false;
  }

  return value;
}

function normalizeWhitespace(source) {
  return source
    .replace(CR_NEWLINE_R, '\n')
    .replace(FORMFEED_R, '')
    .replace(TAB_R, '    ');
}

/**
 * Creates a parser for a given set of rules, with the precedence
 * specified as a list of rules.
 *
 * @rules: an object containing
 * rule type -> {match, order, parse} objects
 * (lower order is higher precedence)
 * (Note: `order` is added to defaultRules after creation so that
 *  the `order` of defaultRules in the source matches the `order`
 *  of defaultRules in terms of `order` fields.)
 *
 * @returns The resulting parse function, with the following parameters:
 *   @source: the input source string to be parsed
 *   @state: an optional object to be threaded through parse
 *     calls. Allows clients to add stateful operations to
 *     parsing, such as keeping track of how many levels deep
 *     some nesting is. For an example use-case, see passage-ref
 *     parsing in src/widgets/passage/passage-markdown.jsx
 */
function parserFor(rules) {
  // Sorts rules in order of increasing order, then
  // ascending rule name in case of ties.
  let ruleList = Object.keys(rules);

  /* istanbul ignore next */
  if (process.env.NODE_ENV !== 'production') {
    ruleList.forEach(function(type) {
      let order = rules[type].order;
      if (
        process.env.NODE_ENV !== 'production' &&
        (typeof order !== 'number' || !isFinite(order))
      ) {
        console.warn(
          'markdown-to-jsx: Invalid order for rule `' + type + '`: ' + order
        );
      }
    });
  }

  ruleList.sort(function(typeA, typeB) {
    let orderA = rules[typeA].order;
    let orderB = rules[typeB].order;

    // First sort based on increasing order
    if (orderA !== orderB) {
      return orderA - orderB;

      // Then based on increasing unicode lexicographic ordering
    } else if (typeA < typeB) {
      return -1;
    }

    return 1;
  });

  function nestedParse(source, state) {
    let result = [];

    // We store the previous capture so that match functions can
    // use some limited amount of lookbehind. Lists use this to
    // ensure they don't match arbitrary '- ' or '* ' in inline
    // text (see the list rule for more information).
    let prevCapture = '';
    while (source) {
      let i = 0;
      while (i < ruleList.length) {
        const ruleType = ruleList[i];
        const rule = rules[ruleType];
        const capture = rule.match(source, state, prevCapture);

        if (capture) {
          const currCaptureString = capture[0];
          source = source.substring(currCaptureString.length);
          const parsed = rule.parse(capture, nestedParse, state);

          // We also let rules override the default type of
          // their parsed node if they would like to, so that
          // there can be a single output function for all links,
          // even if there are several rules to parse them.
          if (parsed.type == null) {
            parsed.type = ruleType;
          }

          result.push(parsed);

          prevCapture = currCaptureString;
          break;
        }

        i++;
      }
    }

    return result;
  }

  return function outerParse(source, state) {
    return nestedParse(normalizeWhitespace(source), state);
  };
}

// Creates a match function for an inline scoped or simple element from a regex
function inlineRegex(regex) {
  return function match(source, state) {
    if (state.inline) {
      return regex.exec(source);
    } else {
      return null;
    }
  };
}

// basically any inline element except links
function simpleInlineRegex(regex) {
  return function match(source, state) {
    if (state.inline || state.simple) {
      return regex.exec(source);
    } else {
      return null;
    }
  };
}

// Creates a match function for a block scoped element from a regex
function blockRegex(regex) {
  return function match(source, state) {
    if (state.inline || state.simple) {
      return null;
    } else {
      return regex.exec(source);
    }
  };
}

// Creates a match function from a regex, ignoring block/inline scope
function anyScopeRegex(regex) {
  return function match(source /*, state*/) {
    return regex.exec(source);
  };
}

function reactFor(outputFunc) {
  return function nestedReactOutput(ast, state) {
    state = state || {};
    if (Array.isArray(ast)) {
      const oldKey = state.key;
      const result = [];

      // map nestedOutput over the ast, except group any text
      // nodes together into a single string output.
      let lastWasString = false;

      for (let i = 0; i < ast.length; i++) {
        state.key = i;

        const nodeOut = nestedReactOutput(ast[i], state);
        const isString = typeof nodeOut === 'string';

        if (isString && lastWasString) {
          result[result.length - 1] += nodeOut;
        } else {
          result.push(nodeOut);
        }

        lastWasString = isString;
      }

      state.key = oldKey;

      return result;
    }

    return outputFunc(ast, nestedReactOutput, state);
  };
}

function sanitizeUrl(url) {
  try {
    const decoded = decodeURIComponent(url);

    if (decoded.match(/^\s*javascript:/i)) {
      if (process.env.NODE_ENV !== 'production') {
        console.warn(
          'Anchor URL contains an unsafe JavaScript expression, it will not be rendered.',
          decoded
        );
      }

      return null;
    }
  } catch (e) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(
        'Anchor URL could not be decoded due to malformed syntax or characters, it will not be rendered.',
        url
      );
    }

    // decodeURIComponent sometimes throws a URIError
    // See `decodeURIComponent('a%AFc');`
    // http://stackoverflow.com/questions/9064536/javascript-decodeuricomponent-malformed-uri-exception
    return null;
  }

  return url;
}

function unescapeUrl(rawUrlString) {
  return rawUrlString.replace(UNESCAPE_URL_R, '$1');
}

/**
 * Everything inline, including links.
 */
function parseInline(parse, content, state) {
  const isCurrentlyInline = state.inline || false;
  const isCurrentlySimple = state.simple || false;
  state.inline = true;
  state.simple = true;
  const result = parse(content, state);
  state.inline = isCurrentlyInline;
  state.simple = isCurrentlySimple;
  return result;
}

/**
 * Anything inline that isn't a link.
 */
function parseSimpleInline(parse, content, state) {
  const isCurrentlyInline = state.inline || false;
  const isCurrentlySimple = state.simple || false;
  state.inline = false;
  state.simple = true;
  const result = parse(content, state);
  state.inline = isCurrentlyInline;
  state.simple = isCurrentlySimple;
  return result;
}

function parseBlock(parse, content, state) {
  state.inline = false;
  return parse(content + '\n\n', state);
}

function parseCaptureInline(capture, parse, state) {
  return {
    content: parseInline(parse, capture[1], state),
  };
}

function captureNothing() {
  return {};
}

function renderNothing() {
  return null;
}

function ruleOutput(rules) {
  return function nestedRuleOutput(ast, outputFunc, state) {
    return rules[ast.type].react(ast, outputFunc, state);
  };
}

function cx(...args) {
  return args.filter(Boolean).join(' ');
}

function get(src, path, fb) {
  let ptr = src;
  const frags = path.split('.');

  while (frags.length) {
    ptr = ptr[frags[0]];

    if (ptr === undefined) break;
    else frags.shift();
  }

  return ptr || fb;
}

function getTag(tag, overrides) {
  const override = get(overrides, tag);

  if (!override) return tag;

  return typeof override === 'function' || (typeof override === 'object' && 'render' in override)
    ? override
    : get(overrides, `${tag}.component`, tag);
}

/**
 * anything that must scan the tree before everything else
 */
const PARSE_PRIORITY_MAX = 1;

/**
 * scans for block-level constructs
 */
const PARSE_PRIORITY_HIGH = 2;

/**
 * inline w/ more priority than other inline
 */
const PARSE_PRIORITY_MED = 3;

/**
 * inline elements
 */
const PARSE_PRIORITY_LOW = 4;

/**
 * bare text and stuff that is considered leftovers
 */
const PARSE_PRIORITY_MIN = 5;

export function compiler(markdown, options) {
  options = options || {};
  options.overrides = options.overrides || {};
  options.slugify = options.slugify || slugify;
  options.namedCodesToUnicode = options.namedCodesToUnicode 
    ? {...namedCodesToUnicode, ...options.namedCodesToUnicode}
    : namedCodesToUnicode;

  const createElementFn = options.createElement || React.createElement;

  // eslint-disable-next-line no-unused-vars
  function h(tag, props, ...children) {
    const overrideProps = get(options.overrides, `${tag}.props`, {});

    return createElementFn(
      getTag(tag, options.overrides),
      {
        ...props,
        ...overrideProps,
        className:
          cx(props && props.className, overrideProps.className) || undefined,
      },
      ...children
    );
  }

  function compile(input) {
    let inline = false;

    if (options.forceInline) {
      inline = true;
    } else if (!options.forceBlock) {
      /**
       * should not contain any block-level markdown like newlines, lists, headings,
       * thematic breaks, blockquotes, tables, etc
       */
      inline = SHOULD_RENDER_AS_BLOCK_R.test(input) === false;
    }

    const arr = emitter(
      parser(
        inline
          ? input
          : `${input.replace(TRIM_NEWLINES_AND_TRAILING_WHITESPACE_R, '')}\n\n`,
        { inline }
      )
    );

    let jsx;
    if (arr.length > 1) {
      jsx = inline ? <span key="outer">{arr}</span> : <div key="outer">{arr}</div>;
    } else if (arr.length === 1) {
      jsx = arr[0];

      // TODO: remove this for React 16
      if (typeof jsx === 'string') {
        jsx = <span key="outer">{jsx}</span>;
      }
    } else {
      // TODO: return null for React 16
      jsx = <span key="outer" />;
    }

    return jsx;
  }

  function attrStringToMap(str) {
    const attributes = str.match(ATTR_EXTRACTOR_R);

    return attributes
      ? attributes.reduce(function(map, raw, index) {
          const delimiterIdx = raw.indexOf('=');

          if (delimiterIdx !== -1) {
            const key = normalizeAttributeKey(
              raw.slice(0, delimiterIdx)
            ).trim();
            const value = unquote(raw.slice(delimiterIdx + 1).trim());

            const mappedKey = ATTRIBUTE_TO_JSX_PROP_MAP[key] || key;
            const normalizedValue = (map[
              mappedKey
            ] = attributeValueToJSXPropValue(key, value));

            if (
              HTML_BLOCK_ELEMENT_R.test(normalizedValue) ||
              HTML_SELF_CLOSING_ELEMENT_R.test(normalizedValue)
            ) {
              map[mappedKey] = React.cloneElement(
                compile(normalizedValue.trim()),
                { key: index }
              );
            }
          } else {
            map[ATTRIBUTE_TO_JSX_PROP_MAP[raw] || raw] = true;
          }

          return map;
        }, {})
      : undefined;
  }

  /* istanbul ignore next */
  if (process.env.NODE_ENV !== 'production') {
    if (typeof markdown !== 'string') {
      throw new Error(`markdown-to-jsx: the first argument must be
                             a string`);
    }

    if (
      Object.prototype.toString.call(options.overrides) !== '[object Object]'
    ) {
      throw new Error(`markdown-to-jsx: options.overrides (second argument property) must be
                             undefined or an object literal with shape:
                             {
                                htmltagname: {
                                    component: string|ReactComponent(optional),
                                    props: object(optional)
                                }
                             }`);
    }
  }

  const footnotes = [];
  const refs = {};

  /**
   * each rule's react() output function goes through our custom h() JSX pragma;
   * this allows the override functionality to be automatically applied
   */
  const rules = {
    blockQuote: {
      match: blockRegex(BLOCKQUOTE_R),
      order: PARSE_PRIORITY_HIGH,
      parse(capture, parse, state) {
        return {
          content: parse(
            capture[0].replace(BLOCKQUOTE_TRIM_LEFT_MULTILINE_R, ''),
            state
          ),
        };
      },
      react(node, output, state) {
        return (
          <blockquote key={state.key}>{output(node.content, state)}</blockquote>
        );
      },
    },

    breakLine: {
      match: anyScopeRegex(BREAK_LINE_R),
      order: PARSE_PRIORITY_HIGH,
      parse: captureNothing,
      react(_, __, state) {
        return <br key={state.key} />;
      },
    },

    breakThematic: {
      match: blockRegex(BREAK_THEMATIC_R),
      order: PARSE_PRIORITY_HIGH,
      parse: captureNothing,
      react(_, __, state) {
        return <hr key={state.key} />;
      },
    },

    codeBlock: {
      match: blockRegex(CODE_BLOCK_R),
      order: PARSE_PRIORITY_MAX,
      parse(capture /*, parse, state*/) {
        let content = capture[0].replace(/^ {4}/gm, '').replace(/\n+$/, '');
        return {
          content: content,
          lang: undefined,
        };
      },

      react(node, output, state) {
        return (
          <pre key={state.key}>
            <code className={node.lang ? `lang-${node.lang}` : ''}>
              {node.content}
            </code>
          </pre>
        );
      },
    },

    codeFenced: {
      match: blockRegex(CODE_BLOCK_FENCED_R),
      order: PARSE_PRIORITY_MAX,
      parse(capture /*, parse, state*/) {
        return {
          content: capture[3],
          lang: capture[2] || undefined,
          type: 'codeBlock',
        };
      },
    },

    codeInline: {
      match: simpleInlineRegex(CODE_INLINE_R),
      order: PARSE_PRIORITY_LOW,
      parse(capture /*, parse, state*/) {
        return {
          content: capture[2],
        };
      },
      react(node, output, state) {
        return <code key={state.key}>{node.content}</code>;
      },
    },

    /**
     * footnotes are emitted at the end of compilation in a special <footer> block
     */
    footnote: {
      match: blockRegex(FOOTNOTE_R),
      order: PARSE_PRIORITY_MAX,
      parse(capture /*, parse, state*/) {
        footnotes.push({
          footnote: capture[2],
          identifier: capture[1],
        });

        return {};
      },
      react: renderNothing,
    },

    footnoteReference: {
      match: inlineRegex(FOOTNOTE_REFERENCE_R),
      order: PARSE_PRIORITY_HIGH,
      parse(capture /*, parse*/) {
        return {
          content: capture[1],
          target: `#${capture[1]}`,
        };
      },
      react(node, output, state) {
        return (
          <a key={state.key} href={sanitizeUrl(node.target)}>
            <sup key={state.key}>{node.content}</sup>
          </a>
        );
      },
    },

    gfmTask: {
      match: inlineRegex(GFM_TASK_R),
      order: PARSE_PRIORITY_HIGH,
      parse(capture /*, parse, state*/) {
        return {
          completed: capture[1].toLowerCase() === 'x',
        };
      },
      react(node, output, state) {
        return (
          <input
            checked={node.completed}
            key={state.key}
            readOnly
            type="checkbox"
          />
        );
      },
    },

    heading: {
      match: blockRegex(HEADING_R),
      order: PARSE_PRIORITY_HIGH,
      parse(capture, parse, state) {
        return {
          content: parseInline(parse, capture[2], state),
          id: options.slugify(capture[2]),
          level: capture[1].length,
        };
      },
      react(node, output, state) {
        const Tag = `h${node.level}`;
        return (
          <Tag id={node.id} key={state.key}>
            {output(node.content, state)}
          </Tag>
        );
      },
    },

    headingSetext: {
      match: blockRegex(HEADING_SETEXT_R),
      order: PARSE_PRIORITY_MAX,
      parse(capture, parse, state) {
        return {
          content: parseInline(parse, capture[1], state),
          level: capture[2] === '=' ? 1 : 2,
          type: 'heading',
        };
      },
    },

    htmlBlock: {
      /**
       * find the first matching end tag and process the interior
       */
      match: anyScopeRegex(HTML_BLOCK_ELEMENT_R),
      order: PARSE_PRIORITY_HIGH,
      parse(capture, parse, state) {
        const [, whitespace] = capture[3].match(HTML_LEFT_TRIM_AMOUNT_R);
        const trimmer = new RegExp(`^${whitespace}`, 'gm');
        const trimmed = capture[3].replace(trimmer, '');

        const parseFunc = containsBlockSyntax(trimmed)
          ? parseBlock
          : parseInline;

        const tagName = capture[1].toLowerCase();
        const noInnerParse =
          DO_NOT_PROCESS_HTML_ELEMENTS.indexOf(tagName) !== -1;

        return {
          attrs: attrStringToMap(capture[2]),
          /**
           * if another html block is detected within, parse as block,
           * otherwise parse as inline to pick up any further markdown
           */
          content: noInnerParse ? capture[3] : parseFunc(parse, trimmed, state),

          noInnerParse,

          tag: noInnerParse ? tagName : capture[1]
        };
      },
      react(node, output, state) {
        return (
          <node.tag key={state.key} {...node.attrs}>
            {node.noInnerParse ? node.content : output(node.content, state)}
          </node.tag>
        );
      },
    },

    htmlComment: {
      match: anyScopeRegex(HTML_COMMENT_R),
      order: PARSE_PRIORITY_HIGH,
      parse() {
        return {};
      },
      react: renderNothing,
    },

    htmlSelfClosing: {
      /**
       * find the first matching end tag and process the interior
       */
      match: anyScopeRegex(HTML_SELF_CLOSING_ELEMENT_R),
      order: PARSE_PRIORITY_HIGH,
      parse(capture /*, parse, state*/) {
        return {
          attrs: attrStringToMap(capture[2] || ''),
          tag: capture[1],
        };
      },
      react(node, output, state) {
        return <node.tag {...node.attrs} key={state.key} />;
      },
    },

    image: {
      match: simpleInlineRegex(IMAGE_R),
      order: PARSE_PRIORITY_HIGH,
      parse(capture /*, parse, state*/) {
        return {
          alt: capture[1],
          target: unescapeUrl(capture[2]),
          title: capture[3],
        };
      },
      react(node, output, state) {
        return (
          <img
            key={state.key}
            alt={node.alt || undefined}
            title={node.title || undefined}
            src={sanitizeUrl(node.target)}
          />
        );
      },
    },

    link: {
      match: inlineRegex(LINK_R, false),
      order: PARSE_PRIORITY_LOW,
      parse(capture, parse, state) {
        return {
          content: parseSimpleInline(parse, capture[1], state),
          target: unescapeUrl(capture[2]),
          title: capture[3],
        };
      },
      react(node, output, state) {
        return (
          <a key={state.key} href={sanitizeUrl(node.target)} title={node.title}>
            {output(node.content, state)}
          </a>
        );
      },
    },

    // https://daringfireball.net/projects/markdown/syntax#autolink
    linkAngleBraceStyleDetector: {
      match: inlineRegex(LINK_AUTOLINK_R),
      order: PARSE_PRIORITY_MAX,
      parse(capture /*, parse, state*/) {
        return {
          content: [
            {
              content: capture[1],
              type: 'text',
            },
          ],
          target: capture[1],
          type: 'link',
        };
      },
    },

    linkBareUrlDetector: {
      match: inlineRegex(LINK_AUTOLINK_BARE_URL_R),
      order: PARSE_PRIORITY_MAX,
      parse(capture /*, parse, state*/) {
        return {
          content: [
            {
              content: capture[1],
              type: 'text',
            },
          ],
          target: capture[1],
          title: undefined,
          type: 'link',
        };
      },
    },

    linkMailtoDetector: {
      match: inlineRegex(LINK_AUTOLINK_MAILTO_R),
      order: PARSE_PRIORITY_MAX,
      parse(capture /*, parse, state*/) {
        let address = capture[1];
        let target = capture[1];

        // Check for a `mailto:` already existing in the link:
        if (!AUTOLINK_MAILTO_CHECK_R.test(target)) {
          target = 'mailto:' + target;
        }

        return {
          content: [
            {
              content: address.replace('mailto:', ''),
              type: 'text',
            },
          ],
          target: target,
          type: 'link',
        };
      },
    },

    list: {
      match(source, state, prevCapture) {
        // We only want to break into a list if we are at the start of a
        // line. This is to avoid parsing "hi * there" with "* there"
        // becoming a part of a list.
        // You might wonder, "but that's inline, so of course it wouldn't
        // start a list?". You would be correct! Except that some of our
        // lists can be inline, because they might be inside another list,
        // in which case we can parse with inline scope, but need to allow
        // nested lists inside this inline scope.
        const isStartOfLine = LIST_LOOKBEHIND_R.exec(prevCapture);
        const isListBlock = state._list || !state.inline;

        if (isStartOfLine && isListBlock) {
          source = isStartOfLine[1] + source;

          return LIST_R.exec(source);
        } else {
          return null;
        }
      },
      order: PARSE_PRIORITY_HIGH,
      parse(capture, parse, state) {
        const bullet = capture[2];
        const ordered = bullet.length > 1;
        const start = ordered ? +bullet : undefined;
        const items = capture[0]
          // recognize the end of a paragraph block inside a list item:
          // two or more newlines at end end of the item
          .replace(BLOCK_END_R, '\n')
          .match(LIST_ITEM_R);

        let lastItemWasAParagraph = false;
        const itemContent = items.map(function(item, i) {
          // We need to see how far indented the item is:
          const space = LIST_ITEM_PREFIX_R.exec(item)[0].length;

          // And then we construct a regex to "unindent" the subsequent
          // lines of the items by that amount:
          const spaceRegex = new RegExp('^ {1,' + space + '}', 'gm');

          // Before processing the item, we need a couple things
          const content = item
            // remove indents on trailing lines:
            .replace(spaceRegex, '')
            // remove the bullet:
            .replace(LIST_ITEM_PREFIX_R, '');

          // Handling "loose" lists, like:
          //
          //  * this is wrapped in a paragraph
          //
          //  * as is this
          //
          //  * as is this
          const isLastItem = i === items.length - 1;
          const containsBlocks = content.indexOf('\n\n') !== -1;

          // Any element in a list is a block if it contains multiple
          // newlines. The last element in the list can also be a block
          // if the previous item in the list was a block (this is
          // because non-last items in the list can end with \n\n, but
          // the last item can't, so we just "inherit" this property
          // from our previous element).
          const thisItemIsAParagraph =
            containsBlocks || (isLastItem && lastItemWasAParagraph);
          lastItemWasAParagraph = thisItemIsAParagraph;

          // backup our state for restoration afterwards. We're going to
          // want to set state._list to true, and state.inline depending
          // on our list's looseness.
          const oldStateInline = state.inline;
          const oldStateList = state._list;
          state._list = true;

          // Parse inline if we're in a tight list, or block if we're in
          // a loose list.
          let adjustedContent;
          if (thisItemIsAParagraph) {
            state.inline = false;
            adjustedContent = content.replace(LIST_ITEM_END_R, '\n\n');
          } else {
            state.inline = true;
            adjustedContent = content.replace(LIST_ITEM_END_R, '');
          }

          const result = parse(adjustedContent, state);

          // Restore our state before returning
          state.inline = oldStateInline;
          state._list = oldStateList;

          return result;
        });

        return {
          items: itemContent,
          ordered: ordered,
          start: start,
        };
      },
      react(node, output, state) {
        const Tag = node.ordered ? 'ol' : 'ul';

        return (
          <Tag key={state.key} start={node.start}>
            {node.items.map(function generateListItem(item, i) {
              return <li key={i}>{output(item, state)}</li>;
            })}
          </Tag>
        );
      },
    },

    newlineCoalescer: {
      match: blockRegex(CONSECUTIVE_NEWLINE_R),
      order: PARSE_PRIORITY_LOW,
      parse: captureNothing,
      react(/*node, output, state*/) {
        return '\n';
      },
    },

    paragraph: {
      match: blockRegex(PARAGRAPH_R),
      order: PARSE_PRIORITY_LOW,
      parse: parseCaptureInline,
      react(node, output, state) {
        return <p key={state.key}>{output(node.content, state)}</p>;
      },
    },

    ref: {
      match: inlineRegex(REFERENCE_IMAGE_OR_LINK),
      order: PARSE_PRIORITY_MAX,
      parse(capture /*, parse*/) {
        refs[capture[1]] = {
          target: capture[2],
          title: capture[4],
        };

        return {};
      },
      react: renderNothing,
    },

    refImage: {
      match: simpleInlineRegex(REFERENCE_IMAGE_R),
      order: PARSE_PRIORITY_MAX,
      parse(capture) {
        return {
          alt: capture[1] || undefined,
          ref: capture[2],
        };
      },
      react(node, output, state) {
        return (
          <img
            key={state.key}
            alt={node.alt}
            src={sanitizeUrl(refs[node.ref].target)}
            title={refs[node.ref].title}
          />
        );
      },
    },

    refLink: {
      match: inlineRegex(REFERENCE_LINK_R),
      order: PARSE_PRIORITY_MAX,
      parse(capture, parse, state) {
        return {
          content: parse(capture[1], state),
          fallbackContent: parse(capture[0].replace(SQUARE_BRACKETS_R, '\\$1'), state),
          ref: capture[2],
        };
      },
      react(node, output, state) {
        return refs[node.ref] ? (
          <a
            key={state.key}
            href={sanitizeUrl(refs[node.ref].target)}
            title={refs[node.ref].title}
          >
            {output(node.content, state)}
          </a>
        ) : <span key={state.key}>{output(node.fallbackContent, state)}</span>;
      },
    },

    table: {
      match: blockRegex(NP_TABLE_R),
      order: PARSE_PRIORITY_HIGH,
      parse: parseTable,
      react(node, output, state) {
        return (
          <table key={state.key}>
            <thead>
              <tr>
                {node.header.map(function generateHeaderCell(content, i) {
                  return (
                    <th key={i} style={getTableStyle(node, i)}>
                      {output(content, state)}
                    </th>
                  );
                })}
              </tr>
            </thead>

            <tbody>
              {node.cells.map(function generateTableRow(row, i) {
                return (
                  <tr key={i}>
                    {row.map(function generateTableCell(content, c) {
                      return (
                        <td key={c} style={getTableStyle(node, c)}>
                          {output(content, state)}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        );
      },
    },

    tableSeparator: {
      match: function(source, state) {
        if (!state.inTable) {
            return null;
        }
        return TABLE_SEPARATOR_R.exec(source);
      },
      order: PARSE_PRIORITY_HIGH,
      parse: function() {
          return { type: 'tableSeparator' };
      },
      // These shouldn't be reached, but in case they are, be reasonable:
      react() { return ' | '; }
    },

    text: {
      // Here we look for anything followed by non-symbols,
      // double newlines, or double-space-newlines
      // We break on any symbol characters so that this grammar
      // is easy to extend without needing to modify this regex
      match: anyScopeRegex(TEXT_PLAIN_R),
      order: PARSE_PRIORITY_MIN,
      parse(capture /*, parse, state*/) {
        return {
          content: capture[0]
            // nbsp -> unicode equivalent for named chars
            .replace(HTML_CHAR_CODE_R, (full, inner) => {
              return options.namedCodesToUnicode[inner]
                ? options.namedCodesToUnicode[inner]
                : full;
            }),
        };
      },
      react(node /*, output, state*/) {
        return node.content;
      },
    },

    textBolded: {
      match: simpleInlineRegex(TEXT_BOLD_R),
      order: PARSE_PRIORITY_MED,
      parse(capture, parse, state) {
        return {
          // capture[1] -> the syntax control character
          // capture[2] -> inner content
          content: parse(capture[2], state),
        };
      },
      react(node, output, state) {
        return <strong key={state.key}>{output(node.content, state)}</strong>;
      },
    },

    textEmphasized: {
      match: simpleInlineRegex(TEXT_EMPHASIZED_R),
      order: PARSE_PRIORITY_LOW,
      parse(capture, parse, state) {
        return {
          // capture[1] -> opening * or _
          // capture[2] -> inner content
          content: parse(capture[2], state),
        };
      },
      react(node, output, state) {
        return <em key={state.key}>{output(node.content, state)}</em>;
      },
    },

    textEscaped: {
      // We don't allow escaping numbers, letters, or spaces here so that
      // backslashes used in plain text still get rendered. But allowing
      // escaping anything else provides a very flexible escape mechanism,
      // regardless of how this grammar is extended.
      match: simpleInlineRegex(TEXT_ESCAPED_R),
      order: PARSE_PRIORITY_HIGH,
      parse(capture /*, parse, state*/) {
        return {
          content: capture[1],
          type: 'text',
        };
      },
    },

    textStrikethroughed: {
      match: simpleInlineRegex(TEXT_STRIKETHROUGHED_R),
      order: PARSE_PRIORITY_LOW,
      parse: parseCaptureInline,
      react(node, output, state) {
        return <del key={state.key}>{output(node.content, state)}</del>;
      },
    },
  };

  // Object.keys(rules).forEach(key => {
  //     let { match, parse } = rules[key];

  //     rules[key].match = (...args) => {
  //         const start = performance.now();
  //         const result = match(...args);
  //         const delta = performance.now() - start;

  //         if (delta > 5)
  //             console.warn(
  //                 `Slow match for ${key}: ${delta.toFixed(3)}ms, input: ${
  //                     args[0]
  //                 }`
  //             );

  //         return result;
  //     };

  //     rules[key].parse = (...args) => {
  //         const start = performance.now();
  //         const result = parse(...args);
  //         const delta = performance.now() - start;

  //         if (delta > 5)
  //             console.warn(`Slow parse for ${key}: ${delta.toFixed(3)}ms`);

  //         console.log(`${key}:parse`, `${delta.toFixed(3)}ms`, args[0]);

  //         return result;
  //     };
  // });

  const parser = parserFor(rules);
  const emitter = reactFor(ruleOutput(rules));

  const jsx = compile(markdown);

  if (footnotes.length) {
    jsx.props.children.push(
      <footer key="footer">
        {footnotes.map(function createFootnote(def) {
          return (
            <div id={def.identifier} key={def.identifier}>
              {def.identifier}
              {emitter(parser(def.footnote, { inline: true }))}
            </div>
          );
        })}
      </footer>
    );
  }

  return jsx;
}

/**
 * A simple HOC for easy React use. Feed the markdown content as a direct child
 * and the rest is taken care of automatically.
 *
 * @param  {String}   options.children   must be a string
 * @param  {Object}   options.options    markdown-to-jsx options (arg 2 of the compiler)
 *
 * @return {ReactElement} the compiled JSX
 */

export default function Markdown({ children, options, ...props }) {
  return React.cloneElement(compiler(children, options), props);
}

if (process.env.NODE_ENV !== 'production') {
  const PropTypes = require('prop-types');

  Markdown.propTypes = {
    children: PropTypes.string.isRequired,
    options: PropTypes.object,
  };
}
