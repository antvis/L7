import * as fs from 'fs'
import * as path from 'path'
import * as ts from 'typescript'
import { OutputFile } from './interfaces'

const double = /\/\//
export function toUnix(fileName: string): string {
	let res: string = fileName.replace(/\\/g, '/')
	while (res.match(double)) {
		res = res.replace(double, '/')
	}

	return res
}

let caseInsensitiveFs: boolean | undefined
export function isCaseInsensitive() {
	if (typeof caseInsensitiveFs !== 'undefined') {
		return caseInsensitiveFs
	}

	const lowerCaseStat = statSyncNoException(process.execPath.toLowerCase())
	const upperCaseStat = statSyncNoException(process.execPath.toUpperCase())

	if (lowerCaseStat && upperCaseStat) {
		caseInsensitiveFs =
			lowerCaseStat.dev === upperCaseStat.dev && lowerCaseStat.ino === upperCaseStat.ino
	} else {
		caseInsensitiveFs = false
	}

	return caseInsensitiveFs
}

function statSyncNoException(path: string) {
	try {
		return fs.statSync(path)
	} catch (e) {
		return undefined
	}
}

function withoutExt(fileName: string): string {
	return path.basename(fileName).split('.')[0]
}

function compareFileName(first: string, second: string) {
	if (isCaseInsensitive()) {
		return first.toLowerCase() === second.toLowerCase()
	} else {
		return first === second
	}
}

function isFileEmit(fileName, outputFileName, sourceFileName) {
	return (
		compareFileName(sourceFileName, fileName) &&
		// typescript now emits .jsx files for .tsx files.
		(outputFileName.substr(-3).toLowerCase() === '.js' ||
			outputFileName.substr(-4).toLowerCase() === '.jsx')
	)
}

function isSourceMapEmit(fileName, outputFileName, sourceFileName) {
	return (
		compareFileName(sourceFileName, fileName) &&
		// typescript now emits .jsx files for .tsx files.
		(outputFileName.substr(-7).toLowerCase() === '.js.map' ||
			outputFileName.substr(-8).toLowerCase() === '.jsx.map')
	)
}

function isDeclarationEmit(fileName, outputFileName, sourceFileName) {
	return (
		compareFileName(sourceFileName, fileName) &&
		outputFileName.substr(-5).toLowerCase() === '.d.ts'
	)
}

export function findResultFor(fileName: string, outputFiles: ts.OutputFile[]): OutputFile {
	let text
	let sourceMap
	let declaration: ts.OutputFile
	fileName = withoutExt(fileName)

	for (let i = 0; i < outputFiles.length; i++) {
		let o = outputFiles[i]
		let outputFileName = o.name
		let sourceFileName = withoutExt(o.name)
		if (isFileEmit(fileName, outputFileName, sourceFileName)) {
			text = o.text
		}
		if (isSourceMapEmit(fileName, outputFileName, sourceFileName)) {
			sourceMap = o.text
		}
		if (isDeclarationEmit(fileName, outputFileName, sourceFileName)) {
			declaration = o
		}
	}

	return {
		text: text,
		sourceMap: sourceMap,
		declaration
	}
}

export function codegenErrorReport(errors) {
	return errors
		.map(function(error) {
			return 'console.error(' + JSON.stringify(error) + ');'
		})
		.join('\n')
}

export function formatError(diagnostic) {
	let lineChar
	if (diagnostic.file) {
		lineChar = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start)
	}
	return (
		(diagnostic.file ? path.normalize(diagnostic.file.fileName) : '') +
		(lineChar ? formatLineChar(lineChar) + ' ' : '') +
		'\n' +
		(typeof diagnostic.messageText === 'string'
			? diagnostic.messageText
			: formatMessageChain(<ts.DiagnosticMessageChain>diagnostic.messageText))
	)
}

export function formatMessageChain(chain: ts.DiagnosticMessageChain) {
	let result = ''
	let separator = '\n  '
	let current = chain

	while (current) {
		result += current.messageText

		if (!!current.next) {
			result += separator
			separator += '  '
		}

		current = current.next
	}

	return result
}

export function formatLineChar(lineChar) {
	return ':' + (lineChar.line + 1) + ':' + lineChar.character
}

export function loadLib(moduleId) {
	let fileName = require.resolve(moduleId)
	let text = fs.readFileSync(fileName, 'utf8')
	return {
		fileName: fileName,
		text: text
	}
}

const TYPESCRIPT_EXTENSION = /\.(d\.)?(t|j)s$/

export function withoutTypeScriptExtension(fileName: string): string {
	return fileName.replace(TYPESCRIPT_EXTENSION, '')
}

export function unorderedRemoveItem<T>(array: T[], item: T): boolean {
	for (let i = 0; i < array.length; i++) {
		if (array[i] === item) {
			// Fill in the "hole" left at `index`.
			array[i] = array[array.length - 1]
			array.pop()
			return true
		}
	}
	return false
}
