import * as _ from 'lodash'
import * as childProcess from 'child_process'
import * as path from 'path'
import { QueuedSender, createQueuedSender } from './send'

import {
	CompilerInfo,
	LoaderConfig,
	Req,
	Res,
	Init,
	EmitFile,
	Files,
	Diagnostics,
	UpdateFile,
	TsConfig,
	RemoveFile
} from './protocol'

export interface Resolve {
	resolve: (...args: any[]) => void
	reject: (e: Error) => void
}

export class Checker {
	seq: number = 0
	checker: childProcess.ChildProcess
	pending: Map<number, Resolve> = new Map()

	compilerInfo?: CompilerInfo
	loaderConfig?: LoaderConfig
	compilerConfig?: TsConfig
	webpackOptions?: any

	sender: QueuedSender

	constructor(
		compilerInfo: CompilerInfo,
		loaderConfig: LoaderConfig,
		compilerConfig: TsConfig,
		webpackOptions: any,
		context: string,
		fork: boolean = false
	) {
		const execArgv = getExecArgv()
		const checker: childProcess.ChildProcess = fork
			? childProcess.fork(path.join(__dirname, 'runtime.js'), [], { execArgv })
			: require('./runtime').run()

		this.sender = fork ? createQueuedSender(checker) : { send: checker.send }

		this.checker = checker
		this.compilerInfo = compilerInfo
		this.loaderConfig = loaderConfig
		this.compilerConfig = compilerConfig
		this.webpackOptions = webpackOptions

		checker.on('error', e => {
			console.error('Typescript checker error:', e)
		})

		checker.on('message', (res: Res) => {
			const { seq, success, payload } = res
			if (seq && this.pending.has(seq)) {
				const resolver = this.pending.get(seq)
				if (success) {
					resolver.resolve(payload)
				} else {
					resolver.reject(payload)
				}

				this.pending.delete(seq)
			} else {
				console.warn('Unknown message: ', payload)
			}
		})

		this.req({
			type: 'Init',
			payload: {
				compilerInfo: _.omit(compilerInfo, 'tsImpl'),
				loaderConfig,
				compilerConfig,
				webpackOptions,
				context
			}
		} as Init.Request)
	}

	req<T>(message: Req): Promise<T> {
		message.seq = ++this.seq
		const promise = new Promise<T>((resolve, reject) => {
			let resolver: Resolve = {
				resolve,
				reject
			}

			this.pending.set(message.seq, resolver)
		})
		this.sender.send(message)
		return promise
	}

	emitFile(fileName: string, text: string): Promise<EmitFile.ResPayload> {
		return this.req({
			type: 'EmitFile',
			payload: {
				fileName,
				text
			}
		} as EmitFile.Request)
	}

	updateFile(fileName: string, text: string, ifExist = false) {
		return this.req({
			type: 'UpdateFile',
			payload: {
				fileName,
				text,
				ifExist
			}
		} as UpdateFile.Request)
	}

	removeFile(fileName: string) {
		return this.req({
			type: 'RemoveFile',
			payload: {
				fileName
			}
		} as RemoveFile.Request)
	}

	getDiagnostics(): Promise<any> {
		return this.req({
			type: 'Diagnostics'
		} as Diagnostics.Request)
	}

	getFiles(): any {
		return this.req({
			type: 'Files'
		} as Files.Request)
	}

	kill() {
		this.checker.kill('SIGKILL')
	}
}

function getExecArgv() {
	let execArgv = []
	for (let _i = 0, _a = process.execArgv; _i < _a.length; _i++) {
		let arg = _a[_i]
		let match = /^--(debug|inspect)(=(\d+))?$/.exec(arg)
		if (match) {
			let currentPort =
				match[3] !== undefined ? +match[3] : match[1] === 'debug' ? 5858 : 9229
			execArgv.push('--' + match[1] + '=' + (currentPort + 1))
		} else {
			execArgv.push(arg)
		}
	}

	return execArgv
}
