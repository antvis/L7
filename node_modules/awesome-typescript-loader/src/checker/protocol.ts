import { LoaderConfig, CompilerInfo, TsConfig } from '../interfaces'
export { CompilerInfo, LoaderConfig, TsConfig }

export type MessageType =
	| 'Init'
	| 'UpdateFile'
	| 'Diagnostics'
	| 'EmitFile'
	| 'Files'
	| 'RemoveFile'

export const MessageType = {
	Init: 'Init' as 'Init',
	Files: 'Files' as 'Files',
	UpdateFile: 'UpdateFile' as 'UpdateFile',
	RemoveFile: 'RemoveFile' as 'RemoveFile',
	Diagnostics: 'Diagnostics' as 'Diagnostics',
	EmitFile: 'EmitFile' as 'EmitFile'
}

export interface ReqBase {
	seq?: number
	type: MessageType
}

export type Req =
	| Init.Request
	| EmitFile.Request
	| UpdateFile.Request
	| Diagnostics.Request
	| RemoveFile.Request
	| Files.Request

export interface Res {
	seq?: number
	success: boolean
	payload: any
}

export interface Diagnostic {}

export namespace Init {
	export interface Payload {
		loaderConfig: LoaderConfig
		compilerConfig: TsConfig
		compilerInfo: CompilerInfo
		webpackOptions: any
		context: string
	}

	export interface Request extends ReqBase {
		type: 'Init'
		payload: Payload
	}

	export interface Response extends Res {}
}

export namespace UpdateFile {
	export interface Payload {
		fileName: string
		text: string
		ifExist: boolean
	}

	export interface Request extends ReqBase {
		type: 'UpdateFile'
		payload: Payload
	}

	export interface Response extends Res {
		payload: {
			text: string
			sourceMap: string
		}
	}
}

export namespace RemoveFile {
	export interface Payload {
		fileName: string
	}

	export interface Request extends ReqBase {
		type: 'RemoveFile'
		payload: Payload
	}

	export interface Response extends Res {
		payload: {}
	}
}

export namespace EmitFile {
	export interface ReqPayload {
		fileName: string
		text: string
	}

	export interface Request extends ReqBase {
		type: 'EmitFile'
		payload: ReqPayload
	}

	export interface ResPayload {
		emitResult: {
			text: string
			sourceMap: string
			declaration: { name: string; text: string }
		}
		deps: string[]
	}

	export interface Response extends Res {
		payload: ResPayload
	}
}

export namespace Files {
	export interface Request extends ReqBase {
		type: 'Files'
	}

	export interface Response {
		payload: {
			files: string[]
		}
	}
}

export namespace Diagnostics {
	export interface Request extends ReqBase {
		type: 'Diagnostics'
	}

	export interface Response {
		payload: {
			diagnostics: any[]
		}
	}
}
