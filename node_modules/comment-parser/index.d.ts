// Type definitions for comment-parser
// Project: comment-parser
// Definitions by: Javier "Ciberman" Mora <https://github.com/jhm-ciberman/>

declare namespace CommentParser {
  export interface Comment {
    tags: Tag[];
    line: number;
    description: string;
    source: string;
  }
  export interface Tag {
    tag: string;
    name: string;
    optional: boolean;
    type: string;
    description: string;
    line: number;
    source: string;
  }
  export interface Options {
    parsers?: [(str: string, data: any) => { source: string, data: any }];
    dotted_names?: boolean;
  }
}

declare function parse(str: string, opts?: CommentParser.Options): [CommentParser.Comment];

export = parse;