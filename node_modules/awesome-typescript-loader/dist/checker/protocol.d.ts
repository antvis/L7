import { LoaderConfig, CompilerInfo, TsConfig } from '../interfaces';
export { CompilerInfo, LoaderConfig, TsConfig };
export declare type MessageType = 'Init' | 'UpdateFile' | 'Diagnostics' | 'EmitFile' | 'Files' | 'RemoveFile';
export declare const MessageType: {
    Init: "Init";
    Files: "Files";
    UpdateFile: "UpdateFile";
    RemoveFile: "RemoveFile";
    Diagnostics: "Diagnostics";
    EmitFile: "EmitFile";
};
export interface ReqBase {
    seq?: number;
    type: MessageType;
}
export declare type Req = Init.Request | EmitFile.Request | UpdateFile.Request | Diagnostics.Request | RemoveFile.Request | Files.Request;
export interface Res {
    seq?: number;
    success: boolean;
    payload: any;
}
export interface Diagnostic {
}
export declare namespace Init {
    interface Payload {
        loaderConfig: LoaderConfig;
        compilerConfig: TsConfig;
        compilerInfo: CompilerInfo;
        webpackOptions: any;
        context: string;
    }
    interface Request extends ReqBase {
        type: 'Init';
        payload: Payload;
    }
    interface Response extends Res {
    }
}
export declare namespace UpdateFile {
    interface Payload {
        fileName: string;
        text: string;
        ifExist: boolean;
    }
    interface Request extends ReqBase {
        type: 'UpdateFile';
        payload: Payload;
    }
    interface Response extends Res {
        payload: {
            text: string;
            sourceMap: string;
        };
    }
}
export declare namespace RemoveFile {
    interface Payload {
        fileName: string;
    }
    interface Request extends ReqBase {
        type: 'RemoveFile';
        payload: Payload;
    }
    interface Response extends Res {
        payload: {};
    }
}
export declare namespace EmitFile {
    interface ReqPayload {
        fileName: string;
        text: string;
    }
    interface Request extends ReqBase {
        type: 'EmitFile';
        payload: ReqPayload;
    }
    interface ResPayload {
        emitResult: {
            text: string;
            sourceMap: string;
            declaration: {
                name: string;
                text: string;
            };
        };
        deps: string[];
    }
    interface Response extends Res {
        payload: ResPayload;
    }
}
export declare namespace Files {
    interface Request extends ReqBase {
        type: 'Files';
    }
    interface Response {
        payload: {
            files: string[];
        };
    }
}
export declare namespace Diagnostics {
    interface Request extends ReqBase {
        type: 'Diagnostics';
    }
    interface Response {
        payload: {
            diagnostics: any[];
        };
    }
}
