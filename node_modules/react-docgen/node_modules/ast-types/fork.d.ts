import { Def, Plugin } from "./types";
export default function (defs: Def[]): {
    Type: {
        or(...types: any[]): import("./lib/types").Type<any>;
        from<T>(value: any, name?: string | undefined): import("./lib/types").Type<T>;
        def(typeName: string): import("./lib/types").Def<any>;
        hasDef(typeName: string): boolean;
    };
    builtInTypes: {
        string: import("./lib/types").Type<string>;
        function: import("./lib/types").Type<Function>;
        array: import("./lib/types").Type<any[]>;
        object: import("./lib/types").Type<{
            [key: string]: any;
        }>;
        RegExp: import("./lib/types").Type<RegExp>;
        Date: import("./lib/types").Type<Date>;
        number: import("./lib/types").Type<number>;
        boolean: import("./lib/types").Type<boolean>;
        null: import("./lib/types").Type<null>;
        undefined: import("./lib/types").Type<undefined>;
    };
    namedTypes: {
        [name: string]: import("./lib/types").AnyType;
    };
    builders: {
        [name: string]: import("./lib/types").Builder;
    };
    defineMethod: (name: any, func?: Function | undefined) => Function;
    getFieldNames: (object: any) => string[];
    getFieldValue: (object: any, fieldName: any) => any;
    eachField: (object: any, callback: (name: any, value: any) => any, context?: any) => void;
    someField: (object: any, callback: (name: any, value: any) => any, context?: any) => boolean;
    getSupertypeNames: (typeName: string) => string[];
    getBuilderName: (typeName: any) => any;
    astNodesAreEquivalent: {
        (a: any, b: any, problemPath?: any): boolean;
        assert(a: any, b: any): void;
    };
    finalize: () => void;
    Path: import("./lib/path").PathConstructor;
    NodePath: import("./lib/node-path").NodePathConstructor;
    PathVisitor: import("./lib/path-visitor").PathVisitorConstructor;
    use: <T>(plugin: Plugin<T>) => T;
    visit: (node: import("./lib/types").ASTNode, methods?: any) => any;
};
